import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { crmRepo } from '@/lib/crm/repo';
import { userRpc } from '@/lib/crm/rpc';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Respaldo completo del CRM en JSON (perfiles, leads, notas, tareas, historial, eventos y auditoría). Solo administrador. */
export async function GET() {
  const session = await getSession();
  if (!session) return new NextResponse('No autenticado', { status: 401, headers: { 'Cache-Control': 'no-store' } });
  if (session.role !== 'admin') return new NextResponse('Sin permiso', { status: 403, headers: { 'Cache-Control': 'no-store' } });
  // La base vuelve a exigir rol administrador y registra la descarga en audit_log.
  const backup = await crmRepo(await userRpc(session)).backup();
  return new NextResponse(JSON.stringify(backup), { headers: {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex',
    'Content-Disposition': `attachment; filename="velour-crm-respaldo-${new Date().toISOString().slice(0, 10)}.json"`,
  } });
}
