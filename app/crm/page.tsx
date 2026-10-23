import Link from 'next/link';
import { requireSession } from '@/lib/auth/session';
import { crmRepo } from '@/lib/crm/repo';
import { userRpc } from '@/lib/crm/rpc';
import { PIPELINE, STATUS_LABEL } from '@/lib/crm/types';
import { fmtDate, fmtDateTime, todayAr } from './format';
import { Banner, StatusBadge } from './ui';

const EVENT_LABEL: Record<string, string> = {
  cta_click: 'Clics en "Cotizar"', whatsapp_click: 'Clics en WhatsApp', email_click: 'Clics en email',
  form_start: 'Formularios iniciados', form_step_complete: 'Pasos completados', lead_submit_success: 'Envíos correctos', lead_submit_error: 'Envíos con error',
};

export default async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const session = await requireSession();
  const params = await searchParams;
  const days = [7, 30, 90].includes(Number(params.dias)) ? Number(params.dias) : 30;
  const repo = crmRepo(await userRpc(session));
  const [metrics, tasks, recent] = await Promise.all([
    repo.metrics(todayAr(-(days - 1)), todayAr()), repo.openTasks(true), repo.list({ limit: 6 }),
  ]);
  const admin = session.role === 'admin';
  const max = Math.max(1, ...PIPELINE.map(status => metrics.by_status[status] ?? 0));
  const started = metrics.events.form_start ?? 0;
  const sent = metrics.events.lead_submit_success ?? 0;
  const hasEvents = Object.keys(metrics.events).length > 0;

  return <>
    <div className="crm-page-head">
      <div><span className="eyebrow crm-muted">{admin ? 'Vista completa' : 'Tus leads asignados'}</span><h1>Panel comercial</h1>
        <p className="crm-muted crm-small">Hola, {session.name}. Período: {fmtDate(metrics.from)} al {fmtDate(metrics.to)}.</p></div>
      <nav className="crm-actions" aria-label="Período">
        {[7, 30, 90].map(option => <Link key={option} className={`button ${option === days ? '' : 'button-quiet'}`} href={`/crm?dias=${option}`} aria-current={option === days ? 'true' : undefined}>{option} días</Link>)}
      </nav>
    </div>
    <Banner code={params.e ?? (params.clave ? 'clave' : undefined)} />

    <section className="crm-grid crm-kpis" aria-label="Indicadores">
      <div className="crm-card crm-kpi"><span>Leads del período</span><strong>{metrics.total}</strong></div>
      <div className="crm-card crm-kpi"><span>Ganados</span><strong>{metrics.won}</strong></div>
      <div className="crm-card crm-kpi"><span>Conversión a ganado</span><strong>{metrics.conversion_rate === null ? '—' : `${metrics.conversion_rate}%`}</strong></div>
      {admin && <div className="crm-card crm-kpi"><span>Sin asignar</span><strong>{metrics.unassigned}</strong></div>}
      <div className="crm-card crm-kpi"><span>Tareas vencidas</span><strong>{metrics.overdue_tasks}</strong></div>
      {admin && <div className="crm-card crm-kpi"><span>Posibles duplicados</span><strong>{metrics.duplicates}</strong></div>}
    </section>

    <div className="crm-grid crm-two">
      <section className="crm-card"><h3>Embudo comercial</h3>
        {metrics.total === 0 ? <p className="crm-empty">Todavía no hay leads en este período.</p> :
          <div className="crm-bars">{PIPELINE.map(status => {
            const count = metrics.by_status[status] ?? 0;
            return <div className="crm-bar" key={status}><Link href={`/crm/leads?estado=${status}`}>{STATUS_LABEL[status]}</Link><i><b style={{ width: `${(count / max) * 100}%` }} /></i><em>{count}</em></div>;
          })}</div>}
        {(metrics.by_status.archivado ?? 0) > 0 && <p className="crm-small crm-muted" style={{ marginTop: 14 }}>Archivados: {metrics.by_status.archivado}</p>}
      </section>
      <section className="crm-card"><h3>Mis tareas pendientes</h3>
        {tasks.length === 0 ? <p className="crm-empty">No tenés tareas pendientes.</p> :
          <ul className="crm-list">{tasks.slice(0, 8).map(task => <li key={task.id}>
            <span><Link href={`/crm/leads/${task.lead_id}`}>{task.title}</Link><br /><small className="crm-muted">{task.lead_name}</small></span>
            <small style={task.overdue ? { color: '#b4534b', fontWeight: 600 } : undefined}>{task.due_at ? `${task.overdue ? 'Vencida · ' : ''}${fmtDate(task.due_at)}` : 'Sin fecha'}</small></li>)}</ul>}
      </section>
    </div>

    <div className="crm-grid crm-two">
      <section className="crm-card"><h3>Por servicio solicitado</h3>
        {metrics.by_service.length === 0 ? <p className="crm-empty">Sin datos todavía.</p> :
          <ul className="crm-list">{metrics.by_service.map(row => <li key={row.label}><span>{row.label}</span><b>{row.count}</b></li>)}</ul>}
      </section>
      <section className="crm-card"><h3>Fuente de adquisición</h3>
        {metrics.by_origin.length === 0 ? <p className="crm-empty">Sin datos todavía.</p> :
          <ul className="crm-list">{metrics.by_origin.map(row => <li key={row.label}><Link href={`/crm/leads?origen=${encodeURIComponent(row.label.split(':')[0])}`}>{row.label}</Link><b>{row.count}</b></li>)}</ul>}
      </section>
    </div>

    {admin && <section className="crm-card" style={{ marginBottom: 16 }}><h3>Actividad del sitio público</h3>
      {!hasEvents ? <p className="crm-empty">Sin eventos registrados en este período. Los contadores son anónimos: cero visitas, cero datos.</p> : <>
        <ul className="crm-list">{Object.entries(metrics.events).map(([event, count]) => <li key={event}><span>{EVENT_LABEL[event] ?? event}</span><b>{count}</b></li>)}</ul>
        {started > 0 && <p className="crm-small crm-muted" style={{ marginTop: 12 }}>De {started} formularios iniciados se enviaron {sent} ({Math.round((sent / started) * 100)}%).</p>}</>}
    </section>}

    <section className="crm-card"><div className="crm-page-head" style={{ marginBottom: 6 }}><h3 style={{ margin: 0 }}>Últimos leads</h3><Link className="text-link" href="/crm/leads">Ver todos</Link></div>
      {recent.rows.length === 0 ? <p className="crm-empty">Todavía no llegaron leads. Cuando alguien complete el formulario del sitio, aparecerá acá.</p> :
        <ul className="crm-list">{recent.rows.map(lead => <li key={lead.id}>
          <span><Link href={`/crm/leads/${lead.id}`}><b>{lead.name}</b></Link><br /><small className="crm-muted">{lead.service_type || 'Consulta general'} · {fmtDateTime(lead.created_at)}</small></span>
          <StatusBadge status={lead.status} /></li>)}</ul>}
    </section>
  </>;
}
