import 'server-only';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Inquiry } from '../inquiry';
import type { LeadTracking } from './tracking';
import { driver } from '../crm/config';
import { serviceRpc } from '../crm/rpc';
import type { Rpc } from '../crm/dev-db';
import type { LeadStatus } from '../crm/types';

/** Estados del pipeline (03_REQUISITOS_FUNNEL_CRM). El CRM de Fase 2 los usará tal cual. */

export const CONSENT_VERSION = 'privacidad-2026-10';

export type Lead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  kind: Inquiry['kind'];
  name: string;
  email: string;
  emailNormalized: string;
  phone: string;
  phoneNormalized: string;
  company: string;
  serviceType: string;
  audience: string;
  situation: string;
  budget: string;
  questionType: string;
  message: string;
  origin: string;
  tracking: LeadTracking;
  consent: { version: string; acceptedAt: string; method: 'aviso-al-enviar' };
  status: LeadStatus;
  priority: 'normal';
  ownerId: string | null;
  /** Clave de idempotencia del navegador: un reintento no crea un segundo lead. */
  requestKey: string;
  /** Id de un lead anterior con el mismo email (posible duplicado, se revisa en el CRM). */
  possibleDuplicateOf: string | null;
  notification: 'pendiente' | 'enviada' | 'fallida' | 'sin-configurar';
};

export type NewLead = Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'emailNormalized' | 'phoneNormalized' | 'status' | 'priority' | 'ownerId' | 'possibleDuplicateOf' | 'notification' | 'consent'>;

export type EventName = typeof EVENT_NAMES[number];
export const EVENT_NAMES = ['cta_click', 'whatsapp_click', 'email_click', 'form_start', 'form_step_complete', 'lead_submit_success', 'lead_submit_error'] as const;

export type CreateResult = { id: string; created: boolean; notified: boolean } | { rejected: 'rate_limited' };

export interface LeadStore {
  /** Idempotente por requestKey. Puede rechazar por abuso (varios envíos del mismo email en una hora). */
  createLead(input: NewLead): Promise<CreateResult>;
  setNotification(id: string, value: Lead['notification']): Promise<void>;
  /** Conteo anónimo y agregado: día + evento + página. Sin IP, cookies ni identificadores. */
  countEvent(event: EventName, page: string): Promise<void>;
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const normalizePhone = (phone: string) => phone.replace(/\D/g, '');

type FileData = { version: 1; leads: Lead[]; events: Record<string, number> };

/**
 * Almacenamiento en archivo JSON para desarrollo local y pruebas.
 * Un solo proceso escribe; las escrituras se encadenan y son atómicas (tmp + rename).
 * NO sirve para Vercel (disco efímero): en producción se usará Postgres (ver db/migrations).
 */
export function createFileStore(file: string): LeadStore {
  let queue: Promise<unknown> = Promise.resolve();
  const load = async (): Promise<FileData> => {
    try { return JSON.parse(await readFile(file, 'utf8')) as FileData; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { version: 1, leads: [], events: {} };
      throw error;
    }
  };
  const save = async (data: FileData) => {
    await mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${randomUUID()}.tmp`;
    await writeFile(tmp, JSON.stringify(data, null, 2), { mode: 0o600 });
    await rename(tmp, file);
  };
  const exclusive = <T>(task: (data: FileData) => Promise<T> | T): Promise<T> => {
    const run = queue.then(async () => { const data = await load(); const result = await task(data); await save(data); return result; });
    queue = run.catch(() => undefined);
    return run;
  };
  return {
    createLead: input => exclusive(data => {
      const existing = data.leads.find(lead => lead.requestKey === input.requestKey);
      if (existing) return { id: existing.id, created: false, notified: existing.notification === 'enviada' };
      const now = new Date().toISOString();
      const emailNormalized = normalizeEmail(input.email);
      const hourAgo = Date.now() - 3600_000;
      if (data.leads.filter(lead => lead.emailNormalized === emailNormalized && Date.parse(lead.createdAt) > hourAgo).length >= 5) return { rejected: 'rate_limited' as const };
      const lead: Lead = {
        ...input, id: randomUUID(), createdAt: now, updatedAt: now, emailNormalized,
        phoneNormalized: normalizePhone(input.phone), status: 'nuevo', priority: 'normal', ownerId: null,
        consent: { version: CONSENT_VERSION, acceptedAt: now, method: 'aviso-al-enviar' },
        possibleDuplicateOf: data.leads.find(lead => lead.emailNormalized === emailNormalized)?.id ?? null,
        notification: 'pendiente',
      };
      data.leads.push(lead);
      return { id: lead.id, created: true, notified: false };
    }),
    setNotification: (id, value) => exclusive(data => {
      const lead = data.leads.find(item => item.id === id);
      if (lead) { lead.notification = value; lead.updatedAt = new Date().toISOString(); }
    }),
    countEvent: (event, page) => exclusive(data => {
      const key = `${new Date().toISOString().slice(0, 10)}|${event}|${page || '/'}`;
      data.events[key] = (data.events[key] ?? 0) + 1;
    }),
  };
}

/** Intake sobre SQL (Supabase en producción, PGlite local): la misma migración y las mismas funciones. */
export function createSqlStore(rpc: () => Rpc | null): LeadStore {
  const call = async <T,>(fn: string, payload: Record<string, unknown>) => {
    const run = rpc();
    if (!run) throw new Error('Base de datos no configurada');
    return run<T>(fn, payload);
  };
  return {
    createLead: input => call<CreateResult>('create_lead', {
      kind: input.kind, name: input.name, email: input.email, phone: input.phone, company: input.company,
      service_type: input.serviceType, audience: input.audience, situation: input.situation, budget: input.budget,
      question_type: input.questionType, message: input.message, origin: input.origin,
      landing_page: input.tracking.landingPage, source_page: input.tracking.sourcePage, referrer_host: input.tracking.referrerHost,
      utm_source: input.tracking.utmSource, utm_medium: input.tracking.utmMedium, utm_campaign: input.tracking.utmCampaign,
      utm_content: input.tracking.utmContent, utm_term: input.tracking.utmTerm,
      consent_version: CONSENT_VERSION, request_key: input.requestKey,
    }),
    setNotification: async (id, value) => { await call('set_lead_notification', { id, value }); },
    countEvent: async (event, page) => { await call('count_event', { event, page }); },
  };
}

let cached: LeadStore | null | undefined;

/**
 * LEAD_STORE=supabase → producción (Postgres + RLS).  pglite / file → solo desarrollo y pruebas.
 * Sin configurar → null: el formulario sigue funcionando solo por email (comportamiento original).
 */
export function getLeadStore(): LeadStore | null {
  const current = driver();
  if (!current) return null;
  if (cached === undefined) {
    cached = current === 'file'
      ? createFileStore(path.resolve(/*turbopackIgnore: true*/ process.env.LEAD_STORE_PATH || '.data/leads.json'))
      : createSqlStore(serviceRpc);
  }
  return cached;
}

/** Solo para pruebas. */
export function resetLeadStoreForTests() { cached = undefined; }
