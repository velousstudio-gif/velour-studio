import 'server-only';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { crmDriver, localStorageAllowed } from '../crm/config';
import { devDb, devRpc, verifyPassword, hashPassword } from '../crm/dev-db';
import { userClient } from '../crm/supabase';
import { crmRepo, type Me } from '../crm/repo';
import { userRpc } from '../crm/rpc';
import { siteUrl } from '../site-config';
import type { Session } from '../crm/types';
import { allow, clientIp } from './limiter';
import { safeNext } from './safe-next';
export { safeNext };

/**
 * Autenticación.
 *  - Producción: Supabase Auth (cookies HttpOnly gestionadas por @supabase/ssr; el navegador nunca ve tokens).
 *  - Desarrollo/pruebas: usuarios locales en PGlite + cookie firmada. Imposible en producción (localStorageAllowed).
 * En ambos casos el rol sale de la tabla `profiles` y la autorización final la aplica RLS en la base de datos.
 */
const DEV_COOKIE = 'velour_dev_session';
const DEV_TTL_MS = 8 * 3600_000;
const g = globalThis as unknown as { __velourDevSecret?: Buffer };
const devSecret = () => (g.__velourDevSecret ??= process.env.DEV_SESSION_SECRET ? Buffer.from(process.env.DEV_SESSION_SECRET) : randomBytes(32));
const sign = (body: string) => createHmac('sha256', devSecret()).update(body).digest('base64url');

function readDevToken(token: string | undefined): string | null {
  if (!token) return null;
  const [body, mac] = token.split('.');
  if (!body || !mac) return null;
  const expected = Buffer.from(sign(body)); const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { sub, exp } = JSON.parse(Buffer.from(body, 'base64url').toString()) as { sub: string; exp: number };
    return typeof sub === 'string' && exp > Date.now() ? sub : null;
  } catch { return null; }
}

const toSession = (me: Me): Session => ({ userId: me.id, email: me.email, name: me.name, role: me.role });

/** Sesión válida (usuario autenticado Y con perfil activo) o null. */
export const getSession = cache(async function getSession(): Promise<Session | null> {
  const mode = crmDriver();
  if (mode === 'supabase') {
    const client = await userClient();
    const { data } = await client.auth.getUser(); // valida el JWT contra Supabase; no se confía en la cookie sola
    if (!data.user) return null;
    const me = await crmRepo(await userRpc({ userId: data.user.id })).me().catch(() => null);
    return me ? toSession(me) : null;
  }
  if (mode === 'pglite') {
    const sub = readDevToken((await cookies()).get(DEV_COOKIE)?.value);
    if (!sub) return null;
    const me = await crmRepo(devRpc({ role: 'authenticated', sub })).me().catch(() => null);
    return me ? toSession(me) : null;
  }
  return null;
});

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect('/login?expirada=1');
  return session;
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireSession();
  if (session.role !== 'admin') redirect('/crm?e=permiso');
  return session;
}

export async function requestIp(): Promise<string> {
  return clientIp(await headers());
}

export type SignInResult = 'ok' | 'invalid' | 'limited' | 'unavailable';

export async function signIn(email: string, password: string): Promise<SignInResult> {
  const mode = crmDriver();
  if (!mode) return 'unavailable';
  const ip = await requestIp();
  // Capa propia contra fuerza bruta (además de la de Supabase Auth): por IP y por cuenta.
  if (!allow(`login-account:${email}`, 8, 15 * 60_000) || (ip && !allow(`login-ip:${ip}`, 30, 15 * 60_000))) return 'limited';
  if (!email || !password || email.length > 254 || password.length > 200) return 'invalid';

  if (mode === 'supabase') {
    const client = await userClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !data.user) return 'invalid';
    const me = await crmRepo(await userRpc({ userId: data.user.id })).me().catch(() => null);
    if (!me) { await client.auth.signOut(); return 'invalid'; } // existe en Auth pero no es miembro del equipo
    return 'ok';
  }
  const db = await devDb();
  const row = (await db.query<{ id: string; encrypted_password: string }>(`select id, encrypted_password from auth.users where email = $1`, [email])).rows[0];
  const valid = verifyPassword(password, row?.encrypted_password);
  if (!row || !valid) return 'invalid';
  const me = await crmRepo(devRpc({ role: 'authenticated', sub: row.id })).me().catch(() => null);
  if (!me) return 'invalid';
  const body = Buffer.from(JSON.stringify({ sub: row.id, exp: Date.now() + DEV_TTL_MS })).toString('base64url');
  (await cookies()).set(DEV_COOKIE, `${body}.${sign(body)}`, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: DEV_TTL_MS / 1000 });
  return 'ok';
}

export async function signOut() {
  if (crmDriver() === 'supabase') await (await userClient()).auth.signOut();
  (await cookies()).delete(DEV_COOKIE);
}

/** Respuesta siempre idéntica exista o no la cuenta (sin enumeración de usuarios). */
export async function requestRecovery(email: string): Promise<'sent' | 'limited' | 'unavailable'> {
  const mode = crmDriver();
  if (!mode) return 'unavailable';
  const ip = await requestIp();
  if (!allow(`recovery-account:${email}`, 3, 60 * 60_000) || (ip && !allow(`recovery-ip:${ip}`, 10, 60 * 60_000))) return 'limited';
  if (mode === 'supabase' && email && email.length <= 254) {
    const origin = process.env.NODE_ENV === 'production' ? siteUrl : (await headers()).get('origin') || siteUrl;
    await (await userClient()).auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/login/nueva-clave` }).catch(() => undefined);
  }
  return 'sent'; // en desarrollo local no se envían correos
}

export const PASSWORD_MIN = 12;

export async function updatePassword(password: string): Promise<boolean> {
  const mode = crmDriver();
  if (password.length < PASSWORD_MIN || password.length > 200) return false;
  if (mode === 'supabase') {
    const { error } = await (await userClient()).auth.updateUser({ password });
    return !error;
  }
  if (mode === 'pglite' && localStorageAllowed()) {
    const session = await getSession();
    if (!session) return false;
    await (await devDb()).query(`update auth.users set encrypted_password = $1 where id = $2`, [hashPassword(password), session.userId]);
    return true;
  }
  return false;
}
