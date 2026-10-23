'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireSession } from '@/lib/auth/session';
import { crmRepo, isUuid } from '@/lib/crm/repo';
import { userRpc } from '@/lib/crm/rpc';
import { CrmError, isStatus } from '@/lib/crm/types';
import { dueFromDate } from './format';

/**
 * Toda acción: 1) verifica sesión en el servidor, 2) valida entradas, 3) ejecuta con la identidad del usuario.
 * La base de datos vuelve a autorizar (RLS): un colaborador no puede tocar leads ajenos aunque manipule el formulario.
 */
const text = (data: FormData, key: string, max: number) => String(data.get(key) ?? '').trim().slice(0, max);

async function run(data: FormData, task: (repo: ReturnType<typeof crmRepo>, id: string) => Promise<unknown>) {
  const session = await requireSession();
  const id = text(data, 'id', 40);
  if (!isUuid(id)) redirect('/crm/leads?e=invalido');
  let error = '';
  try { await task(crmRepo(await userRpc(session)), id); }
  catch (cause) { error = cause instanceof CrmError ? (cause.code === 'forbidden' ? 'permiso' : cause.code === 'not_found' ? 'noexiste' : 'invalido') : 'error'; }
  revalidatePath(`/crm/leads/${id}`); revalidatePath('/crm'); revalidatePath('/crm/leads');
  redirect(`/crm/leads/${id}${error ? `?e=${error}` : ''}`);
}

export async function setStatusAction(data: FormData) {
  const status = text(data, 'status', 20);
  if (!isStatus(status)) redirect(`/crm/leads/${text(data, 'id', 40)}?e=invalido`);
  await run(data, (repo, id) => repo.setStatus(id, status, status === 'perdido' ? text(data, 'lost_reason', 300) : ''));
}

export async function assignAction(data: FormData) {
  const owner = text(data, 'owner_id', 40);
  await run(data, (repo, id) => repo.assign(id, owner && isUuid(owner) ? owner : null));
}

export async function addNoteAction(data: FormData) {
  const body = text(data, 'body', 5000);
  await run(data, (repo, id) => (body ? repo.addNote(id, body) : Promise.reject(new CrmError('invalid'))));
}

export async function addTaskAction(data: FormData) {
  const title = text(data, 'title', 200);
  const assignee = text(data, 'assignee_id', 40);
  await run(data, (repo, id) => (title ? repo.addTask(id, title, dueFromDate(text(data, 'due', 10)), isUuid(assignee) ? assignee : null) : Promise.reject(new CrmError('invalid'))));
}

export async function toggleTaskAction(data: FormData) {
  const taskId = text(data, 'task_id', 40);
  await run(data, repo => (isUuid(taskId) ? repo.setTaskDone(taskId, text(data, 'done', 5) === 'true') : Promise.reject(new CrmError('invalid'))));
}
