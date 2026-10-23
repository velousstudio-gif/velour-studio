import Link from 'next/link';
import { requireSession } from '@/lib/auth/session';
import { crmRepo } from '@/lib/crm/repo';
import { userRpc } from '@/lib/crm/rpc';
import { ORIGIN_KINDS, STATUSES, STATUS_LABEL, isStatus } from '@/lib/crm/types';
import { siteContent } from '@/content/site-content';
import { fmtDate } from '../format';
import { Banner, Pager, StatusBadge } from '../ui';

const PAGE_SIZE = 25;
const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';
const date = (value: string) => (/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '');

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await requireSession();
  const raw = await searchParams;
  const q = one(raw.q).slice(0, 100);
  const estado = isStatus(one(raw.estado)) ? one(raw.estado) : '';
  const servicio = siteContent.diagnosticOptions.projectTypes.includes(one(raw.servicio)) ? one(raw.servicio) : '';
  const origen = ORIGIN_KINDS.some(([value]) => value === one(raw.origen)) ? one(raw.origen) : '';
  const desde = date(one(raw.desde)); const hasta = date(one(raw.hasta));
  const dup = one(raw.dup) === '1';
  const admin = session.role === 'admin';
  const repo = crmRepo(await userRpc(session));
  const staff = admin ? await repo.staff() : [];
  const owner = admin && (one(raw.resp) === 'none' || staff.some(person => person.id === one(raw.resp))) ? one(raw.resp) : '';
  const page = Math.max(1, Math.min(10000, Number(one(raw.pagina)) || 1));

  const filters = { q, status: estado, service: servicio, origin: origen, owner, from: desde, to: hasta, duplicates: dup };
  const { total, rows } = await repo.list({ ...filters, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const query = (extra: Record<string, string>) => {
    const params = new URLSearchParams(Object.entries({ q, estado, servicio, origen, resp: owner, desde, hasta, dup: dup ? '1' : '', ...extra }).filter(([, value]) => value));
    return `/crm/leads${params.size ? `?${params}` : ''}`;
  };
  const exportHref = `/crm/export?${new URLSearchParams(Object.entries({ estado, desde, hasta }).filter(([, value]) => value))}`;
  const filtered = Boolean(q || estado || servicio || origen || owner || desde || hasta || dup);

  return <>
    <div className="crm-page-head"><div><span className="eyebrow crm-muted">{total} {total === 1 ? 'resultado' : 'resultados'}</span><h1>Leads</h1></div>
      {admin && <a className="button button-quiet" href={exportHref} download>Exportar CSV</a>}{admin && <a className="button button-quiet" href="/crm/respaldo" download title="Respaldo completo en JSON: leads, notas, tareas, historial, usuarios y eventos">Respaldo completo</a>}</div>
    <Banner code={one(raw.e)} />
    <form className="crm-filters" method="get" action="/crm/leads">
      <label className="crm-field wide"><span>Buscar (nombre, email, empresa, teléfono)</span><input name="q" defaultValue={q} maxLength={100} type="search" /></label>
      <label className="crm-field"><span>Estado</span><select name="estado" defaultValue={estado}><option value="">Todos</option>{STATUSES.map(status => <option key={status} value={status}>{STATUS_LABEL[status]}</option>)}</select></label>
      <label className="crm-field"><span>Servicio</span><select name="servicio" defaultValue={servicio}><option value="">Todos</option>{siteContent.diagnosticOptions.projectTypes.map(type => <option key={type}>{type}</option>)}</select></label>
      <label className="crm-field"><span>Origen</span><select name="origen" defaultValue={origen}><option value="">Todos</option>{ORIGIN_KINDS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      {admin && <label className="crm-field"><span>Responsable</span><select name="resp" defaultValue={owner}><option value="">Todos</option><option value="none">Sin asignar</option>{staff.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>}
      <label className="crm-field"><span>Desde</span><input type="date" name="desde" defaultValue={desde} /></label>
      <label className="crm-field"><span>Hasta</span><input type="date" name="hasta" defaultValue={hasta} /></label>
      <label className="crm-field"><span>Duplicados</span><select name="dup" defaultValue={dup ? '1' : ''}><option value="">Todos</option><option value="1">Solo posibles duplicados</option></select></label>
      <div className="crm-actions"><button className="button" type="submit">Filtrar</button>{filtered && <Link className="button button-quiet" href="/crm/leads">Limpiar</Link>}</div>
    </form>

    {rows.length === 0 ? <div className="crm-card"><p className="crm-empty">{filtered ? 'Ningún lead coincide con los filtros.' : admin ? 'Todavía no hay leads. Cuando alguien complete el formulario del sitio, aparecerá acá.' : 'Todavía no tenés leads asignados.'}</p></div> :
      <div className="crm-table-wrap"><table className="crm-table">
        <thead><tr><th>Fecha</th><th>Contacto</th><th>Servicio</th><th>Estado</th><th>Origen</th>{admin && <th>Responsable</th>}<th>Tareas</th></tr></thead>
        <tbody>{rows.map(lead => <tr key={lead.id}>
          <td data-label="Fecha">{fmtDate(lead.created_at)}</td>
          <td><Link className="name" href={`/crm/leads/${lead.id}`}>{lead.name}</Link>{lead.possible_duplicate_of && <span className="crm-flag">Posible duplicado</span>}<br /><span className="crm-muted">{lead.company ? `${lead.company} · ` : ''}{lead.email}</span></td>
          <td data-label="Servicio">{lead.service_type || 'Consulta general'}</td>
          <td><StatusBadge status={lead.status} /></td>
          <td data-label="Origen">{lead.origin}</td>
          {admin && <td data-label="Responsable">{lead.owner_name ?? 'Sin asignar'}</td>}
          <td data-label="Tareas abiertas">{lead.open_tasks}</td></tr>)}</tbody>
      </table></div>}
    <Pager page={page} pages={pages} href={target => query({ pagina: String(target) })} />
  </>;
}
