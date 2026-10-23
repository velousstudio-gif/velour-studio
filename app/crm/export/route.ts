import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { crmRepo } from '@/lib/crm/repo';
import { userRpc } from '@/lib/crm/rpc';
import { isStatus } from '@/lib/crm/types';
import { csvCell } from '@/lib/crm/csv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COLUMNS: [string, string][] = [
  ['created_at', 'Fecha'], ['name', 'Nombre'], ['email', 'Email'], ['phone', 'WhatsApp'], ['company', 'Empresa'], ['service_type', 'Servicio'],
  ['audience', 'Para'], ['situation', 'Situación'], ['budget', 'Presupuesto'], ['message', 'Mensaje'], ['status', 'Estado'], ['lost_reason', 'Motivo perdido'],
  ['origin', 'Origen'], ['utm_source', 'utm_source'], ['utm_medium', 'utm_medium'], ['utm_campaign', 'utm_campaign'], ['utm_content', 'utm_content'],
  ['landing_page', 'Página de llegada'], ['referrer_host', 'Referrer'], ['consent_version', 'Consentimiento'], ['id', 'ID'],
];

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return new NextResponse('No autenticado', { status: 401, headers: { 'Cache-Control': 'no-store' } });
  if (session.role !== 'admin') return new NextResponse('Sin permiso', { status: 403, headers: { 'Cache-Control': 'no-store' } });
  const params = request.nextUrl.searchParams;
  const date = (key: string) => (/^\d{4}-\d{2}-\d{2}$/.test(params.get(key) ?? '') ? params.get(key)! : '');
  const status = isStatus(params.get('estado')) ? params.get('estado')! : '';
  // La base registra la exportación en audit_log y vuelve a exigir rol administrador.
  const rows = await crmRepo(await userRpc(session)).exportRows({ status, from: date('desde'), to: date('hasta') });
  const csv = '﻿' + [COLUMNS.map(([, label]) => csvCell(label)).join(','), ...rows.map(row => COLUMNS.map(([key]) => csvCell(row[key])).join(','))].join('\r\n');
  return new NextResponse(csv, { headers: {
    'Content-Type': 'text/csv; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex',
    'Content-Disposition': `attachment; filename="velour-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
  } });
}
