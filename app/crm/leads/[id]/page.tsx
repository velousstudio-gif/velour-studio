import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth/session';
import { crmRepo, isUuid } from '@/lib/crm/repo';
import { userRpc } from '@/lib/crm/rpc';
import { ACTIVITY_LABEL, STATUSES, STATUS_LABEL } from '@/lib/crm/types';
import { addNoteAction, addTaskAction, assignAction, setStatusAction, toggleTaskAction } from '../../actions';
import { fmtDate, fmtDateTime, whatsappLink } from '../../format';
import { Banner, StatusBadge } from '../../ui';

const dash = (value: string | null | undefined) => (value ? value : '—');

export default async function LeadPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const session = await requireSession();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const repo = crmRepo(await userRpc(session));
  const detail = await repo.get(id);
  if (!detail) notFound(); // también cuando el lead existe pero pertenece a otro colaborador (RLS)
  const { lead, notes, tasks, activities, related } = detail;
  const admin = session.role === 'admin';
  const staff = admin ? await repo.staff() : [];
  const whatsapp = whatsappLink(lead.phone);
  const mailto = `mailto:${lead.email}?subject=${encodeURIComponent('Velour Studio — tu consulta')}`;
  const { e } = await searchParams;

  return <>
    <Link className="text-link" href="/crm/leads">← Leads</Link>
    <div className="crm-page-head" style={{ marginTop: 18 }}>
      <div><span className="eyebrow crm-muted">Recibido {fmtDateTime(lead.created_at)} · {lead.kind === 'project' ? 'Diagnóstico de proyecto' : `Consulta: ${lead.question_type || 'Pregunta'}`}</span>
        <h1>{lead.name}</h1>
        <p style={{ marginTop: 10 }}><StatusBadge status={lead.status} />{lead.possible_duplicate_of && <span className="crm-flag">Posible duplicado</span>}</p></div>
      <div className="crm-actions">
        {whatsapp && <a className="button" href={whatsapp} target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>}
        <a className="button button-quiet" href={mailto}>Abrir email</a>
      </div>
    </div>
    <Banner code={e} />

    <div className="crm-grid crm-detail">
      <div className="crm-stack">
        <section className="crm-card"><h3>Contacto</h3>
          <dl className="crm-dl"><dt>Email</dt><dd>{lead.email}</dd><dt>WhatsApp</dt><dd>{dash(lead.phone)}</dd><dt>Empresa</dt><dd>{dash(lead.company)}</dd></dl></section>
        <section className="crm-card"><h3>Solicitud</h3>
          <dl className="crm-dl"><dt>Servicio</dt><dd>{dash(lead.service_type)}</dd><dt>Es para</dt><dd>{dash(lead.audience)}</dd><dt>Situación</dt><dd>{dash(lead.situation)}</dd><dt>Presupuesto</dt><dd>{dash(lead.budget)}</dd></dl>
          <p className="crm-label" style={{ margin: '18px 0 8px' }}>Mensaje</p><div className="crm-message">{lead.message}</div></section>
        <section className="crm-card"><h3>Origen y atribución</h3>
          <dl className="crm-dl"><dt>Fuente</dt><dd>{lead.origin}</dd><dt>utm_source</dt><dd>{dash(lead.utm_source)}</dd><dt>utm_medium</dt><dd>{dash(lead.utm_medium)}</dd><dt>utm_campaign</dt><dd>{dash(lead.utm_campaign)}</dd>
            <dt>utm_content</dt><dd>{dash(lead.utm_content)}</dd><dt>Página de llegada</dt><dd>{dash(lead.landing_page)}</dd><dt>Página del envío</dt><dd>{dash(lead.source_page)}</dd><dt>Sitio de referencia</dt><dd>{dash(lead.referrer_host)}</dd>
            <dt>Consentimiento</dt><dd>{lead.consent_version} · {fmtDate(lead.consent_at)}</dd><dt>Aviso por email</dt><dd>{lead.notification}</dd></dl></section>
        {related.length > 0 && <section className="crm-card"><h3>Posibles duplicados (mismo email o teléfono)</h3>
          <ul className="crm-list">{related.map(item => <li key={item.id}><Link href={`/crm/leads/${item.id}`}>{item.name} · {fmtDate(item.created_at)}</Link><StatusBadge status={item.status} /></li>)}</ul></section>}
      </div>

      <div className="crm-stack">
        <section className="crm-card"><h3>Estado comercial</h3>
          <form className="crm-form" action={setStatusAction}><input type="hidden" name="id" value={lead.id} />
            <label className="crm-field"><span>Estado</span><select name="status" defaultValue={lead.status}>{STATUSES.map(status => <option key={status} value={status}>{STATUS_LABEL[status]}</option>)}</select></label>
            <label className="crm-field"><span>Motivo (solo si se marca Perdido)</span><input name="lost_reason" defaultValue={lead.lost_reason} maxLength={300} /></label>
            <div><button className="button" type="submit">Guardar estado</button></div></form>
          {lead.closed_at && <p className="crm-small crm-muted" style={{ marginTop: 12 }}>Cerrado el {fmtDate(lead.closed_at)}.</p>}</section>

        {admin && <section className="crm-card"><h3>Responsable</h3>
          <form className="crm-inline" action={assignAction}><input type="hidden" name="id" value={lead.id} />
            <label className="crm-field"><span>Asignado a</span><select name="owner_id" defaultValue={lead.owner_id ?? ''}><option value="">Sin asignar</option>{staff.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
            <button className="button button-quiet" type="submit">Asignar</button></form></section>}

        <section className="crm-card"><h3>Tareas y recordatorios</h3>
          {tasks.length === 0 ? <p className="crm-empty" style={{ padding: '6px 0 14px' }}>Sin tareas todavía.</p> : <div>{tasks.map(task => {
            const overdue = !task.done_at && task.due_at && new Date(task.due_at) < new Date();
            return <div className="crm-task" key={task.id} data-done={Boolean(task.done_at)}>
              <form action={toggleTaskAction}><input type="hidden" name="id" value={lead.id} /><input type="hidden" name="task_id" value={task.id} /><input type="hidden" name="done" value={task.done_at ? 'false' : 'true'} />
                <button className="crm-check" type="submit" aria-pressed={Boolean(task.done_at)} aria-label={task.done_at ? 'Marcar como pendiente' : 'Marcar como hecha'}>{task.done_at ? '✓' : ''}</button></form>
              <div><span className="t">{task.title}</span><br /><small className="due crm-muted" data-overdue={Boolean(overdue)}>{task.due_at ? `Vence ${fmtDate(task.due_at)}` : 'Sin fecha'}{task.assignee ? ` · ${task.assignee}` : ''}</small></div></div>;
          })}</div>}
          <form className="crm-form" action={addTaskAction} style={{ marginTop: 14 }}><input type="hidden" name="id" value={lead.id} />
            <label className="crm-field"><span>Nueva tarea</span><input name="title" required maxLength={200} placeholder="Ej.: llamar para calificar" /></label>
            <div className="crm-inline"><label className="crm-field"><span>Fecha límite (opcional)</span><input type="date" name="due" /></label>
              {admin && <label className="crm-field"><span>Para</span><select name="assignee_id" defaultValue={session.userId}>{staff.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>}</div>
            <div><button className="button button-quiet" type="submit">Agregar tarea</button></div></form></section>

        <section className="crm-card"><h3>Notas internas</h3>
          <form className="crm-form" action={addNoteAction}><input type="hidden" name="id" value={lead.id} />
            <label className="crm-field"><span className="sr-only">Nota</span><textarea name="body" required maxLength={5000} placeholder="Qué se habló, próximos pasos, objeciones…" /></label>
            <div><button className="button button-quiet" type="submit">Guardar nota</button></div></form>
          {notes.length === 0 ? <p className="crm-empty">Sin notas.</p> : <div style={{ marginTop: 10 }}>{notes.map(note => <article className="crm-note" key={note.id}>
            <small className="crm-muted">{note.author ?? 'Usuario'} · {fmtDateTime(note.created_at)}</small><p>{note.body}</p></article>)}</div>}</section>

        <section className="crm-card"><h3>Historial</h3>
          <ol className="crm-timeline">{activities.map(item => <li key={item.id}><b>{ACTIVITY_LABEL[item.type] ?? item.type}</b>{item.detail ? ` — ${item.detail}` : ''}<br /><span className="crm-muted">{item.actor ?? 'Sistema'} · {fmtDateTime(item.created_at)}</span></li>)}</ol></section>
      </div>
    </div>
  </>;
}
