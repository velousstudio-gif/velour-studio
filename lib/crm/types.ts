/** Tipos y constantes del CRM. Seguro de importar desde cliente y servidor. */
export const PIPELINE = ['nuevo', 'contactado', 'calificado', 'propuesta', 'negociacion', 'ganado', 'perdido'] as const;
export const STATUSES = [...PIPELINE, 'archivado'] as const;
export type LeadStatus = typeof STATUSES[number];

export const STATUS_LABEL: Record<LeadStatus, string> = {
  nuevo: 'Nuevo', contactado: 'Contactado', calificado: 'Calificado', propuesta: 'Propuesta',
  negociacion: 'Negociación', ganado: 'Ganado', perdido: 'Perdido', archivado: 'Archivado',
};
export const isStatus = (value: unknown): value is LeadStatus => typeof value === 'string' && (STATUSES as readonly string[]).includes(value);

export type Role = 'admin' | 'colaborador';
export type Session = { userId: string; email: string; name: string; role: Role };

export const ORIGIN_KINDS = [['directo', 'Directo'], ['campaña', 'Campaña (UTM)'], ['referido', 'Referido']] as const;

export type LeadRow = {
  id: string; created_at: string; name: string; email: string; phone: string; company: string; service_type: string;
  status: LeadStatus; origin: string; owner_id: string | null; owner_name: string | null; possible_duplicate_of: string | null;
  kind: 'project' | 'question'; open_tasks: number;
};
export type LeadList = { total: number; rows: LeadRow[] };

export type LeadFull = {
  id: string; created_at: string; updated_at: string; kind: 'project' | 'question'; name: string; email: string; phone: string;
  company: string; service_type: string; audience: string; situation: string; budget: string; question_type: string; message: string;
  origin: string; landing_page: string; source_page: string; referrer_host: string;
  utm_source: string; utm_medium: string; utm_campaign: string; utm_content: string; utm_term: string;
  consent_version: string; consent_at: string; status: LeadStatus; lost_reason: string; closed_at: string | null;
  owner_id: string | null; possible_duplicate_of: string | null; notification: string;
};
export type LeadDetail = {
  lead: LeadFull; owner_name: string | null;
  notes: { id: string; body: string; created_at: string; author: string | null }[];
  tasks: { id: string; title: string; due_at: string | null; done_at: string | null; assignee: string | null }[];
  activities: { id: string; type: string; detail: string; created_at: string; actor: string | null }[];
  related: { id: string; name: string; status: LeadStatus; created_at: string }[];
};
export type OpenTask = { id: string; title: string; due_at: string | null; lead_id: string; lead_name: string; overdue: boolean; assignee: string | null };
export type Staff = { id: string; name: string; role: Role };
export type Metrics = {
  from: string; to: string; total: number; won: number; lost: number; conversion_rate: number | null;
  by_status: Partial<Record<LeadStatus, number>>; by_service: { label: string; count: number }[];
  by_origin: { label: string; count: number }[]; by_day: { day: string; count: number }[];
  unassigned: number; overdue_tasks: number; duplicates: number; events: Record<string, number>;
};

export const ACTIVITY_LABEL: Record<string, string> = {
  creado: 'Lead creado', estado: 'Cambio de estado', asignacion: 'Asignación', nota: 'Nota agregada',
  tarea: 'Tarea creada', tarea_completada: 'Tarea completada',
};

export class CrmError extends Error {
  constructor(public code: 'forbidden' | 'not_found' | 'invalid' | 'unavailable', message?: string) { super(message ?? code); }
}
