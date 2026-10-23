import 'server-only';
import type { Rpc } from './dev-db';
import { CrmError, type LeadDetail, type LeadList, type Metrics, type OpenTask, type Role, type Staff } from './types';

const UUID = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;
export const isUuid = (value: unknown): value is string => typeof value === 'string' && UUID.test(value);
const uuid = (value: unknown) => { if (!isUuid(value)) throw new CrmError('invalid'); return value; };

export type ListFilters = { q?: string; status?: string; service?: string; origin?: string; owner?: string; from?: string; to?: string; duplicates?: boolean; limit?: number; offset?: number };
export type CrmBackup = { format: 'velour-crm-backup'; version: 1; created_at: string; tables: Record<string, Record<string, unknown>[]> };
export type Me = { id: string; email: string; name: string; role: Role };

/** Operaciones tipadas. La autorización real la hace la base de datos (RLS + funciones), no esta capa. */
export function crmRepo(rpc: Rpc) {
  return {
    me: () => rpc<Me | null>('crm_me'),
    list: (filters: ListFilters) => rpc<LeadList>('crm_list_leads', { ...filters, duplicates: filters.duplicates ? 'true' : '' }),
    get: (id: string) => rpc<LeadDetail | null>('crm_get_lead', { id: uuid(id) }),
    setStatus: (id: string, status: string, lostReason = '') => rpc('crm_set_status', { id: uuid(id), status, lost_reason: lostReason }),
    assign: (id: string, ownerId: string | null) => rpc('crm_assign', { id: uuid(id), owner_id: ownerId ? uuid(ownerId) : null }),
    addNote: (id: string, body: string) => rpc('crm_add_note', { id: uuid(id), body }),
    addTask: (id: string, title: string, dueAt: string | null, assigneeId: string | null) =>
      rpc('crm_add_task', { id: uuid(id), title, due_at: dueAt, assignee_id: assigneeId ? uuid(assigneeId) : null }),
    setTaskDone: (taskId: string, done: boolean) => rpc('crm_set_task_done', { task_id: uuid(taskId), done }),
    openTasks: (mine: boolean) => rpc<OpenTask[]>('crm_open_tasks', { mine: mine ? 'true' : '' }),
    staff: () => rpc<Staff[]>('crm_staff'),
    metrics: (from?: string, to?: string) => rpc<Metrics>('crm_metrics', { from, to }),
    exportRows: (filters: { status?: string; from?: string; to?: string }) => rpc<Record<string, unknown>[]>('crm_export', filters),
    /** Respaldo completo (solo admin; la base lo verifica y lo audita). */
    backup: () => rpc<CrmBackup>('crm_backup'),
  };
}
