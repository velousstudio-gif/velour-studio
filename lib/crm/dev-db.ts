import 'server-only';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { PGlite } from '@electric-sql/pglite';
import { CrmError, type Role } from './types';
import { localStorageAllowed } from './config';

/**
 * SOLO DESARROLLO Y PRUEBAS: Postgres embebido (PGlite) con la MISMA migración que Supabase,
 * incluidas las políticas RLS. Nunca se usa en producción (ver localStorageAllowed).
 */
export type Rpc = <T = unknown>(fn: string, payload?: Record<string, unknown>) => Promise<T>;
export type Identity = { role: 'service_role' } | { role: 'authenticated'; sub: string };

const g = globalThis as unknown as { __velourDevDb?: Promise<PGlite> };

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  return `scrypt$${salt.toString('base64')}$${scryptSync(password, salt, 64).toString('base64')}`;
}
export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  // Siempre se calcula un hash (aunque el usuario no exista) para no revelar su existencia por tiempos.
  const [kind, salt, hash] = (stored || 'scrypt$AAAAAAAAAAAAAAAAAAAAAA==$' + 'A'.repeat(86) + '==').split('$');
  const expected = Buffer.from(hash || '', 'base64');
  const actual = scryptSync(password, Buffer.from(salt || '', 'base64'), 64);
  return Boolean(stored) && kind === 'scrypt' && expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function devDb(): Promise<PGlite> {
  if (!localStorageAllowed()) throw new Error('El almacenamiento local de desarrollo no está permitido en este entorno.');
  // Si el arranque falla, no se cachea el error: el próximo pedido reintenta.
  return (g.__velourDevDb ??= init().catch(error => { g.__velourDevDb = undefined; throw error; }));
}

async function init(): Promise<PGlite> {
  const { PGlite } = await import('@electric-sql/pglite');
  const target = process.env.DEV_DB_DIR === 'memory' ? undefined : path.resolve(/*turbopackIgnore: true*/ process.env.DEV_DB_DIR || '.data/pglite');
  if (target) mkdirSync(path.dirname(target), { recursive: true });
  const db = new PGlite(target);
  await db.waitReady;
  // Misma secuencia de migraciones que Supabase, aplicadas una sola vez y en orden (solo desarrollo/pruebas).
  const root = /*turbopackIgnore: true*/ process.cwd();
  const exists = await db.query<{ t: string | null }>(`select to_regclass('public.leads')::text as t`);
  if (!exists.rows[0].t) await db.exec(readFileSync(path.join(root, 'supabase/dev/shim.sql'), 'utf8'));
  await db.exec(`create schema if not exists dev; create table if not exists dev.migrations (name text primary key)`);
  if (exists.rows[0].t) await db.exec(`insert into dev.migrations values ('20261022000000_crm_init.sql') on conflict do nothing`);
  const dir = path.join(root, 'supabase/migrations');
  for (const name of readdirSync(dir).filter(file => file.endsWith('.sql')).sort()) {
    if ((await db.query(`select 1 from dev.migrations where name = $1`, [name])).rows.length) continue;
    await db.transaction(async tx => { await tx.exec(readFileSync(path.join(dir, name), 'utf8')); await tx.query(`insert into dev.migrations values ($1)`, [name]); });
  }
  // Usuarios de prueba definidos por variables de entorno locales (nunca en el código).
  for (const [prefix, role, name] of [['DEV_ADMIN', 'admin', 'Admin local'], ['DEV_COLLAB', 'colaborador', 'Colaborador local']] as const) {
    const email = process.env[`${prefix}_EMAIL`]?.trim().toLowerCase();
    const password = process.env[`${prefix}_PASSWORD`];
    if (email && password) await ensureDevUser(db, email, password, role, name);
  }
  return db;
}

export async function ensureDevUser(db: PGlite, email: string, password: string, role: Role, name: string) {
  const found = await db.query<{ id: string }>(`select id from auth.users where email = $1`, [email]);
  if (found.rows[0]) return found.rows[0].id;
  const created = await db.query<{ id: string }>(`insert into auth.users (email, encrypted_password) values ($1, $2) returning id`, [email, hashPassword(password)]);
  const id = created.rows[0].id;
  await db.query(`insert into public.profiles (id, email, full_name, role) values ($1, $2, $3, $4)`, [id, email, name, role]);
  return id;
}

export function toCrmError(message: string): CrmError {
  if (/forbidden|row-level security|permission denied/i.test(message)) return new CrmError('forbidden');
  if (/not_found/.test(message)) return new CrmError('not_found');
  if (/invalid|check constraint|violates/i.test(message)) return new CrmError('invalid', message);
  return new CrmError('unavailable', message);
}

/** Ejecuta una función rpc con el rol y las claims JWT indicadas, igual que PostgREST en Supabase. */
export function devRpc(identity: Identity): Rpc {
  return async <T,>(fn: string, payload: Record<string, unknown> = {}) => {
    if (!/^[a-z_]+$/.test(fn)) throw new CrmError('invalid');
    const db = await devDb();
    const claims = identity.role === 'authenticated' ? { sub: identity.sub, role: 'authenticated' } : { role: 'service_role' };
    try {
      return await db.transaction(async tx => {
        await tx.query(`set local role ${identity.role}`);
        await tx.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify(claims)]);
        const result = await tx.query<{ r: T }>(`select public.${fn}($1::jsonb) as r`, [JSON.stringify(payload)]);
        return result.rows[0].r;
      });
    } catch (error) {
      throw toCrmError(error instanceof Error ? error.message : String(error));
    }
  };
}
