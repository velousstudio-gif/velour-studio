-- Velour Studio — Fase 4: respaldo completo del CRM y restauración.
-- Aditiva: no borra ni modifica datos. Ejecutar una vez después de 20261022000000_crm_init.sql.
--
--  * crm_backup(p): SOLO administrador (verificado en la base). Devuelve todas las tablas del CRM en JSON
--    y deja constancia en audit_log. No incluye contraseñas ni tokens (viven en auth, fuera del respaldo).
--  * crm_restore(p): SOLO service_role (clave secreta, script local). Inserta lo que falte, en orden de dependencias,
--    sin pisar filas existentes y sin generar historial duplicado.

-- Los triggers de historial se omiten únicamente durante una restauración (bandera local a la transacción,
-- que solo crm_restore puede activar: ningún rol de la API puede ejecutar set_config arbitrario).
create or replace function app.restoring() returns boolean
language sql stable set search_path = '' as $$
  select coalesce(current_setting('app.restoring', true), '') = 'on'
$$;

create or replace function app.leads_before_update() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if app.restoring() then return new; end if;
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

create or replace function app.notes_after_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if app.restoring() then return new; end if;
  insert into public.lead_activities (lead_id, actor_id, type, detail) values (new.lead_id, new.author_id, 'nota', '');
  return new;
end $$;

create or replace function app.tasks_after_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if app.restoring() then return new; end if;
  if tg_op = 'INSERT' then
    insert into public.lead_activities (lead_id, actor_id, type, detail)
    values (new.lead_id, new.created_by, 'tarea', left(new.title, 200));
  elsif new.done_at is not null and old.done_at is null then
    insert into public.lead_activities (lead_id, actor_id, type, detail)
    values (new.lead_id, auth.uid(), 'tarea_completada', left(new.title, 200));
  end if;
  return new;
end $$;

create function public.crm_backup(p jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v jsonb;
begin
  if not app.is_admin() then raise exception 'forbidden'; end if;
  select jsonb_build_object(
    'format', 'velour-crm-backup', 'version', 1, 'created_at', now(),
    'tables', jsonb_build_object(
      'profiles',          coalesce((select jsonb_agg(to_jsonb(t) order by t.created_at) from public.profiles t), '[]'::jsonb),
      'leads',             coalesce((select jsonb_agg(to_jsonb(t) order by t.created_at) from public.leads t), '[]'::jsonb),
      'lead_notes',        coalesce((select jsonb_agg(to_jsonb(t) order by t.created_at) from public.lead_notes t), '[]'::jsonb),
      'lead_tasks',        coalesce((select jsonb_agg(to_jsonb(t) order by t.created_at) from public.lead_tasks t), '[]'::jsonb),
      'lead_activities',   coalesce((select jsonb_agg(to_jsonb(t) order by t.created_at) from public.lead_activities t), '[]'::jsonb),
      'conversion_events', coalesce((select jsonb_agg(to_jsonb(t) order by t.day, t.event, t.page) from public.conversion_events t), '[]'::jsonb),
      'audit_log',         coalesce((select jsonb_agg(to_jsonb(t) order by t.id) from public.audit_log t), '[]'::jsonb)
    )) into v;
  insert into public.audit_log (actor_id, action, detail)
  values (auth.uid(), 'backup_export', jsonb_build_object('leads', jsonb_array_length(v -> 'tables' -> 'leads')));
  return v;
end $$;

create function public.crm_restore(p jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare t jsonb := p -> 'tables'; n jsonb := '{}'::jsonb; c int;
begin
  if p ->> 'format' is distinct from 'velour-crm-backup' or (p ->> 'version')::int <> 1 then raise exception 'invalid_backup'; end if;
  perform set_config('app.restoring', 'on', true);

  -- Perfiles: solo de usuarios que ya existen en Auth (el script los crea antes, sin contraseña).
  insert into public.profiles select r.* from jsonb_populate_recordset(null::public.profiles, t -> 'profiles') r
    where exists (select 1 from auth.users u where u.id = r.id) on conflict (id) do nothing;
  get diagnostics c = row_count; n := n || jsonb_build_object('profiles', c);

  -- Leads en dos pasos: primero sin referencia a duplicados, luego se restablece (autorreferencia).
  insert into public.leads select r.* from jsonb_populate_recordset(null::public.leads,
      (select coalesce(jsonb_agg(e - 'possible_duplicate_of'), '[]'::jsonb) from jsonb_array_elements(t -> 'leads') e)) r
    on conflict (id) do nothing;
  get diagnostics c = row_count; n := n || jsonb_build_object('leads', c);
  update public.leads l set possible_duplicate_of = r.possible_duplicate_of
    from jsonb_populate_recordset(null::public.leads, t -> 'leads') r
   where l.id = r.id and l.possible_duplicate_of is null and r.possible_duplicate_of is not null
     and exists (select 1 from public.leads d where d.id = r.possible_duplicate_of);

  insert into public.lead_notes select r.* from jsonb_populate_recordset(null::public.lead_notes, t -> 'lead_notes') r on conflict (id) do nothing;
  get diagnostics c = row_count; n := n || jsonb_build_object('lead_notes', c);
  insert into public.lead_tasks select r.* from jsonb_populate_recordset(null::public.lead_tasks, t -> 'lead_tasks') r on conflict (id) do nothing;
  get diagnostics c = row_count; n := n || jsonb_build_object('lead_tasks', c);
  insert into public.lead_activities select r.* from jsonb_populate_recordset(null::public.lead_activities, t -> 'lead_activities') r on conflict (id) do nothing;
  get diagnostics c = row_count; n := n || jsonb_build_object('lead_activities', c);
  insert into public.conversion_events select r.* from jsonb_populate_recordset(null::public.conversion_events, t -> 'conversion_events') r
    on conflict (day, event, page) do nothing;
  get diagnostics c = row_count; n := n || jsonb_build_object('conversion_events', c);
  insert into public.audit_log overriding system value select r.* from jsonb_populate_recordset(null::public.audit_log, t -> 'audit_log') r
    on conflict (id) do nothing;
  get diagnostics c = row_count; n := n || jsonb_build_object('audit_log', c);
  perform setval(pg_get_serial_sequence('public.audit_log', 'id'), greatest(coalesce((select max(id) from public.audit_log), 0), 1));

  perform set_config('app.restoring', 'off', true);
  return jsonb_build_object('restored', n);
end $$;

revoke execute on function app.restoring() from public, anon;
grant execute on function app.restoring() to authenticated, service_role;
revoke execute on function public.crm_backup(jsonb), public.crm_restore(jsonb) from public, anon, authenticated;
grant execute on function public.crm_backup(jsonb) to authenticated;   -- la función exige rol admin
grant execute on function public.crm_restore(jsonb) to service_role;
