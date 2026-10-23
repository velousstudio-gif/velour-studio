-- Velour Studio — CRM de leads (Fase 2)
-- Ejecutar UNA vez en Supabase (SQL Editor o `supabase db push`). Ver supabase/README.md.
--
-- Modelo de seguridad:
--  * RLS activo en todas las tablas. `anon` no tiene ningún permiso.
--  * El formulario público escribe SOLO mediante funciones SECURITY DEFINER ejecutables por `service_role`
--    (la clave de servicio vive únicamente en el servidor).
--  * El CRM usa la sesión del usuario (rol `authenticated`): administrador ve todo; colaborador solo sus leads asignados.
--  * Cambios de estado/asignación/notas/tareas se registran en `lead_activities` mediante triggers: no se puede omitir el historial.
--  * Los usuarios del panel se crean a mano (Auth + fila en `profiles`). Un registro externo sin perfil no accede a nada.

create schema if not exists app;

-- ---------- Tablas ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role text not null check (role in ('admin', 'colaborador')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  kind text not null check (kind in ('project', 'question')),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  email_normalized text not null,
  phone text not null default '' check (char_length(phone) <= 40),
  phone_normalized text not null default '',
  company text not null default '' check (char_length(company) <= 150),
  service_type text not null default '' check (char_length(service_type) <= 100),
  audience text not null default '' check (char_length(audience) <= 100),
  situation text not null default '' check (char_length(situation) <= 150),
  budget text not null default '' check (char_length(budget) <= 100),
  question_type text not null default '' check (char_length(question_type) <= 50),
  message text not null check (char_length(message) between 1 and 5000),
  origin text not null default 'directo' check (char_length(origin) <= 150),
  landing_page text not null default '' check (char_length(landing_page) <= 200),
  source_page text not null default '' check (char_length(source_page) <= 200),
  referrer_host text not null default '' check (char_length(referrer_host) <= 253),
  utm_source text not null default '' check (char_length(utm_source) <= 100),
  utm_medium text not null default '' check (char_length(utm_medium) <= 100),
  utm_campaign text not null default '' check (char_length(utm_campaign) <= 100),
  utm_content text not null default '' check (char_length(utm_content) <= 100),
  utm_term text not null default '' check (char_length(utm_term) <= 100),
  consent_version text not null,
  consent_at timestamptz not null default now(),
  status text not null default 'nuevo'
    check (status in ('nuevo', 'contactado', 'calificado', 'propuesta', 'negociacion', 'ganado', 'perdido', 'archivado')),
  lost_reason text not null default '' check (char_length(lost_reason) <= 300),
  closed_at timestamptz,
  owner_id uuid references public.profiles (id) on delete set null,
  request_key text not null unique,
  possible_duplicate_of uuid references public.leads (id) on delete set null,
  notification text not null default 'pendiente'
    check (notification in ('pendiente', 'enviada', 'fallida', 'sin-configurar'))
);
create index leads_created_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);
create index leads_owner_idx on public.leads (owner_id);
create index leads_email_idx on public.leads (email_normalized);
create index leads_phone_idx on public.leads (phone_normalized) where phone_normalized <> '';

create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  body text not null check (char_length(btrim(body)) between 1 and 5000),
  created_at timestamptz not null default now()
);
create index lead_notes_lead_idx on public.lead_notes (lead_id, created_at desc);

create table public.lead_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  due_at timestamptz,
  assignee_id uuid references public.profiles (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  done_at timestamptz,
  created_at timestamptz not null default now()
);
create index lead_tasks_lead_idx on public.lead_tasks (lead_id);
create index lead_tasks_open_idx on public.lead_tasks (due_at) where done_at is null;

create table public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  type text not null check (type in ('creado', 'estado', 'asignacion', 'nota', 'tarea', 'tarea_completada')),
  detail text not null default '' check (char_length(detail) <= 400),
  created_at timestamptz not null default now()
);
create index lead_activities_lead_idx on public.lead_activities (lead_id, created_at desc);

-- Conteos anónimos y agregados por día. Sin IP, cookies ni identificadores.
create table public.conversion_events (
  day date not null default current_date,
  event text not null check (event in ('cta_click', 'whatsapp_click', 'email_click', 'form_start', 'form_step_complete', 'lead_submit_success', 'lead_submit_error')),
  page text not null default '/' check (char_length(page) <= 200),
  count integer not null default 0,
  primary key (day, event, page)
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------- Funciones de apoyo para políticas ----------
create function app.staff_role() returns text
language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = auth.uid() and active
$$;
create function app.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(app.staff_role() = 'admin', false)
$$;
create function app.is_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select app.staff_role() is not null
$$;

-- ---------- Permisos y RLS ----------
revoke all on public.profiles, public.leads, public.lead_notes, public.lead_tasks, public.lead_activities,
  public.conversion_events, public.audit_log from anon, authenticated;

grant select on public.profiles, public.leads, public.lead_notes, public.lead_tasks, public.lead_activities,
  public.conversion_events, public.audit_log to authenticated;
-- Solo estas columnas son editables desde el CRM; el resto del lead es inmutable.
grant update (status, lost_reason, owner_id) on public.leads to authenticated;
grant insert (lead_id, author_id, body) on public.lead_notes to authenticated;
grant insert (lead_id, title, due_at, assignee_id, created_by) on public.lead_tasks to authenticated;
grant update (done_at) on public.lead_tasks to authenticated;

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;
alter table public.lead_tasks enable row level security;
alter table public.lead_activities enable row level security;
alter table public.conversion_events enable row level security;
alter table public.audit_log enable row level security;

create policy profiles_read on public.profiles for select to authenticated
  using (id = auth.uid() or app.is_admin());

create policy leads_read on public.leads for select to authenticated
  using (app.is_admin() or (app.is_staff() and owner_id = auth.uid()));
create policy leads_update on public.leads for update to authenticated
  using (app.is_admin() or (app.is_staff() and owner_id = auth.uid()))
  with check (app.is_admin() or (app.is_staff() and owner_id = auth.uid()));

create policy notes_read on public.lead_notes for select to authenticated
  using (exists (select 1 from public.leads l where l.id = lead_id));
create policy notes_insert on public.lead_notes for insert to authenticated
  with check (author_id = auth.uid() and exists (select 1 from public.leads l where l.id = lead_id));

create policy tasks_read on public.lead_tasks for select to authenticated
  using (exists (select 1 from public.leads l where l.id = lead_id));
create policy tasks_insert on public.lead_tasks for insert to authenticated
  with check (created_by = auth.uid() and exists (select 1 from public.leads l where l.id = lead_id));
create policy tasks_update on public.lead_tasks for update to authenticated
  using (exists (select 1 from public.leads l where l.id = lead_id))
  with check (exists (select 1 from public.leads l where l.id = lead_id));

create policy activities_read on public.lead_activities for select to authenticated
  using (exists (select 1 from public.leads l where l.id = lead_id));

create policy events_read on public.conversion_events for select to authenticated using (app.is_admin());
create policy audit_read on public.audit_log for select to authenticated using (app.is_admin());

-- ---------- Triggers: historial imposible de omitir ----------
create function app.leads_before_update() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  new.updated_at := now();
  if new.status is distinct from old.status then
    new.closed_at := case when new.status in ('ganado', 'perdido') then now() else null end;
    if new.status <> 'perdido' then new.lost_reason := ''; end if;
    insert into public.lead_activities (lead_id, actor_id, type, detail)
    values (new.id, auth.uid(), 'estado', old.status || ' → ' || new.status);
  end if;
  if new.owner_id is distinct from old.owner_id then
    insert into public.lead_activities (lead_id, actor_id, type, detail)
    values (new.id, auth.uid(), 'asignacion',
      coalesce((select nullif(full_name, '') from public.profiles where id = new.owner_id),
               (select email from public.profiles where id = new.owner_id), 'sin asignar'));
  end if;
  return new;
end $$;
create trigger leads_before_update before update on public.leads
  for each row execute function app.leads_before_update();

create function app.notes_after_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.lead_activities (lead_id, actor_id, type, detail) values (new.lead_id, new.author_id, 'nota', '');
  return new;
end $$;
create trigger notes_after_insert after insert on public.lead_notes
  for each row execute function app.notes_after_insert();

create function app.tasks_after_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.lead_activities (lead_id, actor_id, type, detail)
    values (new.lead_id, new.created_by, 'tarea', left(new.title, 200));
  elsif new.done_at is not null and old.done_at is null then
    insert into public.lead_activities (lead_id, actor_id, type, detail)
    values (new.lead_id, auth.uid(), 'tarea_completada', left(new.title, 200));
  end if;
  return new;
end $$;
create trigger tasks_after_change after insert or update on public.lead_tasks
  for each row execute function app.tasks_after_change();

-- ---------- Intake público (solo service_role) ----------
create function public.create_lead(p jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_email text := lower(btrim(p ->> 'email'));
  v_phone text := regexp_replace(coalesce(p ->> 'phone', ''), '\D', '', 'g');
  v_id uuid;
  v_dup uuid;
  v_existing public.leads;
begin
  select * into v_existing from public.leads where request_key = p ->> 'request_key';
  if found then
    return jsonb_build_object('id', v_existing.id, 'created', false, 'notified', v_existing.notification = 'enviada');
  end if;
  -- Freno de abuso común a todas las instancias del servidor.
  if (select count(*) from public.leads where email_normalized = v_email and created_at > now() - interval '1 hour') >= 5
     or (select count(*) from public.leads where created_at > now() - interval '1 hour') >= 200 then
    return jsonb_build_object('rejected', 'rate_limited');
  end if;
  select id into v_dup from public.leads
   where email_normalized = v_email or (length(v_phone) >= 7 and phone_normalized = v_phone)
   order by created_at limit 1;
  insert into public.leads (
    kind, name, email, email_normalized, phone, phone_normalized, company, service_type, audience, situation, budget,
    question_type, message, origin, landing_page, source_page, referrer_host,
    utm_source, utm_medium, utm_campaign, utm_content, utm_term, consent_version, request_key, possible_duplicate_of
  ) values (
    p ->> 'kind', btrim(p ->> 'name'), btrim(p ->> 'email'), v_email, coalesce(p ->> 'phone', ''), v_phone,
    coalesce(p ->> 'company', ''), coalesce(p ->> 'service_type', ''), coalesce(p ->> 'audience', ''),
    coalesce(p ->> 'situation', ''), coalesce(p ->> 'budget', ''), coalesce(p ->> 'question_type', ''), p ->> 'message',
    coalesce(p ->> 'origin', 'directo'), coalesce(p ->> 'landing_page', ''), coalesce(p ->> 'source_page', ''),
    coalesce(p ->> 'referrer_host', ''), coalesce(p ->> 'utm_source', ''), coalesce(p ->> 'utm_medium', ''),
    coalesce(p ->> 'utm_campaign', ''), coalesce(p ->> 'utm_content', ''), coalesce(p ->> 'utm_term', ''),
    p ->> 'consent_version', p ->> 'request_key', v_dup
  ) on conflict (request_key) do nothing returning id into v_id;
  if v_id is null then -- carrera: otro request con la misma clave ganó
    select * into v_existing from public.leads where request_key = p ->> 'request_key';
    return jsonb_build_object('id', v_existing.id, 'created', false, 'notified', v_existing.notification = 'enviada');
  end if;
  insert into public.lead_activities (lead_id, type, detail)
  values (v_id, 'creado', left(coalesce(p ->> 'origin', 'directo'), 200));
  return jsonb_build_object('id', v_id, 'created', true, 'notified', false, 'duplicate', v_dup is not null);
end $$;

create function public.set_lead_notification(p jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  update public.leads set notification = p ->> 'value' where id = (p ->> 'id')::uuid;
  return jsonb_build_object('ok', true);
end $$;

create function public.count_event(p jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.conversion_events (day, event, page, count)
  values (current_date, p ->> 'event', coalesce(nullif(p ->> 'page', ''), '/'), 1)
  on conflict (day, event, page) do update set count = public.conversion_events.count + 1;
  return jsonb_build_object('ok', true);
end $$;

-- ---------- API del CRM (security invoker: RLS decide qué filas ve cada usuario) ----------
create function app.escape_like(v text) returns text language sql immutable set search_path = '' as $$
  select replace(replace(replace(v, '\', '\\'), '%', '\%'), '_', '\_')
$$;

create function public.crm_list_leads(p jsonb) returns jsonb
language plpgsql stable security invoker set search_path = '' as $$
declare
  v_limit int := least(greatest(coalesce((p ->> 'limit')::int, 25), 1), 100);
  v_offset int := greatest(coalesce((p ->> 'offset')::int, 0), 0);
  v_q text := nullif(btrim(coalesce(p ->> 'q', '')), '');
  v_like text;
  v_digits text;
  v_result jsonb;
begin
  v_like := case when v_q is null then null else '%' || app.escape_like(v_q) || '%' end;
  v_digits := case when v_q is null then null else nullif(regexp_replace(v_q, '\D', '', 'g'), '') end;
  with f as (
    select l.* from public.leads l
    where (v_q is null or l.name ilike v_like or l.email ilike v_like or l.company ilike v_like
           or (v_digits is not null and length(v_digits) >= 4 and l.phone_normalized like '%' || v_digits || '%'))
      and (nullif(p ->> 'status', '') is null or l.status = p ->> 'status')
      and (nullif(p ->> 'service', '') is null or l.service_type = p ->> 'service')
      and (nullif(p ->> 'origin', '') is null or l.origin = p ->> 'origin' or l.origin like app.escape_like(p ->> 'origin') || ':%')
      and (nullif(p ->> 'owner', '') is null
           or (p ->> 'owner' = 'none' and l.owner_id is null)
           or (p ->> 'owner' = 'me' and l.owner_id = auth.uid())
           or (p ->> 'owner' ~ '^[0-9a-f-]{36}$' and l.owner_id = (p ->> 'owner')::uuid))
      and (nullif(p ->> 'from', '') is null or l.created_at >= (p ->> 'from')::date)
      and (nullif(p ->> 'to', '') is null or l.created_at < (p ->> 'to')::date + 1)
      and (coalesce(p ->> 'duplicates', '') <> 'true' or l.possible_duplicate_of is not null)
  ), page as (
    select * from f order by created_at desc limit v_limit offset v_offset
  )
  select jsonb_build_object(
    'total', (select count(*) from f),
    'rows', coalesce((select jsonb_agg(jsonb_build_object(
        'id', pg.id, 'created_at', pg.created_at, 'name', pg.name, 'email', pg.email, 'phone', pg.phone,
        'company', pg.company, 'service_type', pg.service_type, 'status', pg.status, 'origin', pg.origin,
        'owner_id', pg.owner_id, 'owner_name', coalesce(nullif(pr.full_name, ''), pr.email),
        'possible_duplicate_of', pg.possible_duplicate_of, 'kind', pg.kind,
        'open_tasks', (select count(*) from public.lead_tasks t where t.lead_id = pg.id and t.done_at is null)
      ) order by pg.created_at desc)
      from page pg left join public.profiles pr on pr.id = pg.owner_id), '[]'::jsonb)
  ) into v_result;
  return v_result;
end $$;

create function public.crm_get_lead(p jsonb) returns jsonb
language plpgsql stable security invoker set search_path = '' as $$
declare v_lead public.leads;
begin
  select * into v_lead from public.leads where id = (p ->> 'id')::uuid;
  if not found then return null; end if;
  return jsonb_build_object(
    'lead', to_jsonb(v_lead) - 'email_normalized' - 'phone_normalized' - 'request_key',
    'owner_name', (select coalesce(nullif(full_name, ''), email) from public.profiles where id = v_lead.owner_id),
    'notes', coalesce((select jsonb_agg(jsonb_build_object('id', n.id, 'body', n.body, 'created_at', n.created_at,
        'author', (select coalesce(nullif(full_name, ''), email) from public.profiles where id = n.author_id)) order by n.created_at desc)
        from public.lead_notes n where n.lead_id = v_lead.id), '[]'::jsonb),
    'tasks', coalesce((select jsonb_agg(jsonb_build_object('id', t.id, 'title', t.title, 'due_at', t.due_at, 'done_at', t.done_at,
        'assignee', (select coalesce(nullif(full_name, ''), email) from public.profiles where id = t.assignee_id)) order by (t.done_at is not null), t.due_at nulls last, t.created_at)
        from public.lead_tasks t where t.lead_id = v_lead.id), '[]'::jsonb),
    'activities', coalesce((select jsonb_agg(jsonb_build_object('id', a.id, 'type', a.type, 'detail', a.detail, 'created_at', a.created_at,
        'actor', (select coalesce(nullif(full_name, ''), email) from public.profiles where id = a.actor_id)) order by a.created_at desc)
        from public.lead_activities a where a.lead_id = v_lead.id), '[]'::jsonb),
    'related', coalesce((select jsonb_agg(jsonb_build_object('id', r.id, 'name', r.name, 'status', r.status, 'created_at', r.created_at) order by r.created_at desc)
        from public.leads r where r.id <> v_lead.id
          and (r.email_normalized = v_lead.email_normalized
               or (length(v_lead.phone_normalized) >= 7 and r.phone_normalized = v_lead.phone_normalized))), '[]'::jsonb)
  );
end $$;

create function public.crm_set_status(p jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare v_n int;
begin
  update public.leads set status = p ->> 'status', lost_reason = left(coalesce(p ->> 'lost_reason', ''), 300)
   where id = (p ->> 'id')::uuid;
  get diagnostics v_n = row_count;
  if v_n = 0 then raise exception 'not_found'; end if;
  return jsonb_build_object('ok', true);
end $$;

create function public.crm_add_note(p jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare v_id uuid;
begin
  insert into public.lead_notes (lead_id, author_id, body)
  values ((p ->> 'id')::uuid, auth.uid(), btrim(p ->> 'body')) returning id into v_id;
  return jsonb_build_object('id', v_id);
end $$;

create function public.crm_add_task(p jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare v_id uuid;
begin
  insert into public.lead_tasks (lead_id, title, due_at, assignee_id, created_by)
  values ((p ->> 'id')::uuid, btrim(p ->> 'title'), nullif(p ->> 'due_at', '')::timestamptz,
          coalesce(nullif(p ->> 'assignee_id', '')::uuid, auth.uid()), auth.uid()) returning id into v_id;
  return jsonb_build_object('id', v_id);
end $$;

create function public.crm_set_task_done(p jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare v_n int;
begin
  update public.lead_tasks set done_at = case when (p ->> 'done')::boolean then now() else null end
   where id = (p ->> 'task_id')::uuid;
  get diagnostics v_n = row_count;
  if v_n = 0 then raise exception 'not_found'; end if;
  return jsonb_build_object('ok', true);
end $$;

create function public.crm_open_tasks(p jsonb) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select coalesce(jsonb_agg(x order by (x ->> 'due_at') nulls last), '[]'::jsonb) from (
    select jsonb_build_object('id', t.id, 'title', t.title, 'due_at', t.due_at, 'lead_id', t.lead_id, 'lead_name', l.name,
             'overdue', t.due_at is not null and t.due_at < now(),
             'assignee', (select coalesce(nullif(full_name, ''), email) from public.profiles where id = t.assignee_id)) as x
    from public.lead_tasks t join public.leads l on l.id = t.lead_id
    where t.done_at is null
      and (coalesce(p ->> 'mine', '') <> 'true' or t.assignee_id = auth.uid())
    order by t.due_at nulls last limit 50
  ) s
$$;

create function public.crm_staff(p jsonb) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select coalesce(jsonb_agg(jsonb_build_object('id', id, 'name', coalesce(nullif(full_name, ''), email), 'role', role) order by full_name, email), '[]'::jsonb)
  from public.profiles where active
$$;

create function public.crm_metrics(p jsonb) returns jsonb
language plpgsql stable security invoker set search_path = '' as $$
declare
  v_from date := coalesce(nullif(p ->> 'from', '')::date, current_date - 29);
  v_to date := coalesce(nullif(p ->> 'to', '')::date, current_date);
  v_total int; v_won int; v_lost int;
begin
  select count(*), count(*) filter (where status = 'ganado'), count(*) filter (where status = 'perdido')
    into v_total, v_won, v_lost
    from public.leads where created_at >= v_from and created_at < v_to + 1;
  return jsonb_build_object(
    'from', v_from, 'to', v_to, 'total', v_total, 'won', v_won, 'lost', v_lost,
    'conversion_rate', case when v_total = 0 then null else round(v_won * 100.0 / v_total, 1) end,
    'by_status', coalesce((select jsonb_object_agg(status, n) from (
        select status, count(*) n from public.leads where created_at >= v_from and created_at < v_to + 1 group by status) s), '{}'::jsonb),
    'by_service', coalesce((select jsonb_agg(jsonb_build_object('label', coalesce(nullif(service_type, ''), 'Consulta general'), 'count', n) order by n desc) from (
        select service_type, count(*) n from public.leads where created_at >= v_from and created_at < v_to + 1 group by service_type) s), '[]'::jsonb),
    'by_origin', coalesce((select jsonb_agg(jsonb_build_object('label', origin, 'count', n) order by n desc) from (
        select origin, count(*) n from public.leads where created_at >= v_from and created_at < v_to + 1 group by origin) s), '[]'::jsonb),
    'by_day', coalesce((select jsonb_agg(jsonb_build_object('day', d, 'count', n) order by d) from (
        select created_at::date d, count(*) n from public.leads where created_at >= v_from and created_at < v_to + 1 group by 1) s), '[]'::jsonb),
    'unassigned', (select count(*) from public.leads where owner_id is null and status not in ('ganado', 'perdido', 'archivado')),
    'overdue_tasks', (select count(*) from public.lead_tasks where done_at is null and due_at < now()),
    'duplicates', (select count(*) from public.leads where possible_duplicate_of is not null and created_at >= v_from and created_at < v_to + 1),
    'events', coalesce((select jsonb_object_agg(event, n) from (
        select event, sum(count)::int n from public.conversion_events where day between v_from and v_to group by event) s), '{}'::jsonb)
  );
end $$;

create function public.crm_me(p jsonb) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select (select jsonb_build_object('id', id, 'email', email, 'name', coalesce(nullif(full_name, ''), email), 'role', role)
            from public.profiles where id = auth.uid() and active)
$$;

-- Acciones solo de administrador: security definer con verificación explícita.
create function public.crm_assign(p jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_owner uuid := nullif(p ->> 'owner_id', '')::uuid;
begin
  if not app.is_admin() then raise exception 'forbidden'; end if;
  if v_owner is not null and not exists (select 1 from public.profiles where id = v_owner and active) then
    raise exception 'invalid_owner';
  end if;
  update public.leads set owner_id = v_owner where id = (p ->> 'id')::uuid;
  if not found then raise exception 'not_found'; end if;
  insert into public.audit_log (actor_id, action, detail)
  values (auth.uid(), 'lead_assign', jsonb_build_object('lead_id', p ->> 'id', 'owner_id', v_owner));
  return jsonb_build_object('ok', true);
end $$;

create function public.crm_export(p jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_rows jsonb; v_n int;
begin
  if not app.is_admin() then raise exception 'forbidden'; end if;
  select coalesce(jsonb_agg(to_jsonb(l) - 'email_normalized' - 'phone_normalized' - 'request_key' order by l.created_at desc), '[]'::jsonb), count(*)
    into v_rows, v_n
    from (select * from public.leads
           where (nullif(p ->> 'status', '') is null or status = p ->> 'status')
             and (nullif(p ->> 'from', '') is null or created_at >= (p ->> 'from')::date)
             and (nullif(p ->> 'to', '') is null or created_at < (p ->> 'to')::date + 1)
           order by created_at desc limit 5000) l;
  insert into public.audit_log (actor_id, action, detail)
  values (auth.uid(), 'csv_export', jsonb_build_object('rows', v_n, 'status', p ->> 'status', 'from', p ->> 'from', 'to', p ->> 'to'));
  return v_rows;
end $$;

-- ---------- Permisos de ejecución ----------
revoke execute on all functions in schema app from public, anon;
grant usage on schema app to authenticated, service_role;
grant execute on all functions in schema app to authenticated, service_role;

revoke execute on function
  public.create_lead(jsonb), public.set_lead_notification(jsonb), public.count_event(jsonb),
  public.crm_list_leads(jsonb), public.crm_get_lead(jsonb), public.crm_set_status(jsonb), public.crm_add_note(jsonb),
  public.crm_add_task(jsonb), public.crm_set_task_done(jsonb), public.crm_open_tasks(jsonb), public.crm_staff(jsonb),
  public.crm_metrics(jsonb), public.crm_assign(jsonb), public.crm_export(jsonb), public.crm_me(jsonb)
  from public, anon, authenticated;

grant execute on function public.create_lead(jsonb), public.set_lead_notification(jsonb), public.count_event(jsonb) to service_role;
grant execute on function
  public.crm_list_leads(jsonb), public.crm_get_lead(jsonb), public.crm_set_status(jsonb), public.crm_add_note(jsonb),
  public.crm_add_task(jsonb), public.crm_set_task_done(jsonb), public.crm_open_tasks(jsonb), public.crm_staff(jsonb),
  public.crm_metrics(jsonb), public.crm_assign(jsonb), public.crm_export(jsonb), public.crm_me(jsonb)
  to authenticated;
