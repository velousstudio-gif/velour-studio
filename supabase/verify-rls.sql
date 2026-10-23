-- Verificación completa de la migración en Supabase. NO deja datos: termina siempre con una excepción,
-- que revierte todo. Resultado esperado: "ERROR: PRUEBAS_OK (...)". Cualquier otro mensaje indica la prueba que falló.
do $$
declare
  a uuid := gen_random_uuid(); c1 uuid := gen_random_uuid(); c2 uuid := gen_random_uuid(); x uuid := gen_random_uuid();
  r jsonb; l1 uuid; l2 uuid; n int; ok boolean;
begin
  insert into auth.users (id, email, aud, role) values
    (a, 'admin.prueba@velour.test', 'authenticated', 'authenticated'),
    (c1, 'colab1.prueba@velour.test', 'authenticated', 'authenticated'),
    (c2, 'colab2.prueba@velour.test', 'authenticated', 'authenticated'),
    (x, 'sinperfil.prueba@velour.test', 'authenticated', 'authenticated');
  insert into public.profiles (id, email, full_name, role) values
    (a, 'admin.prueba@velour.test', 'Admin Prueba', 'admin'),
    (c1, 'colab1.prueba@velour.test', 'Colab Uno', 'colaborador'),
    (c2, 'colab2.prueba@velour.test', 'Colab Dos', 'colaborador');

  -- 1. Intake con service_role: alta, idempotencia, duplicados, eventos
  execute 'set local role service_role';
  r := public.create_lead('{"kind":"question","name":"Lead Uno","email":"Uno@Velour.test","phone":"+54 9 11 5555-0001","message":"mensaje de prueba","question_type":"x","consent_version":"v","request_key":"prueba-k1","origin":"directo"}');
  l1 := (r ->> 'id')::uuid; assert (r ->> 'created')::boolean, '1a alta de lead';
  r := public.create_lead('{"kind":"question","name":"Lead Uno","email":"uno@velour.test","message":"mensaje de prueba","consent_version":"v","request_key":"prueba-k1"}');
  assert not (r ->> 'created')::boolean, '1b idempotencia por request_key';
  r := public.create_lead('{"kind":"project","name":"Lead Dos","email":"uno@velour.test","message":"otro mensaje","consent_version":"v","request_key":"prueba-k2","origin":"campaña:ig"}');
  l2 := (r ->> 'id')::uuid; assert (r ->> 'duplicate')::boolean, '1c detección de duplicado por email';
  perform public.count_event('{"event":"cta_click","page":"/"}');
  ok := false; begin perform public.count_event('{"event":"inventado","page":"/"}'); exception when check_violation then ok := true; end;
  assert ok, '1d evento inválido rechazado';
  reset role;

  -- 2. Visitante anónimo: sin acceso a nada
  execute 'set local role anon';
  ok := false; begin perform public.create_lead('{}'); exception when insufficient_privilege then ok := true; end; assert ok, '2a anon ejecuta create_lead';
  ok := false; begin perform count(*) from public.leads; exception when insufficient_privilege then ok := true; end; assert ok, '2b anon lee leads';
  ok := false; begin perform public.crm_list_leads('{}'); exception when insufficient_privilege then ok := true; end; assert ok, '2c anon usa API del CRM';
  reset role;

  -- 3. Administrador
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  ok := false; begin perform public.create_lead('{}'); exception when insufficient_privilege then ok := true; end; assert ok, '3a usuario ejecuta intake';
  assert (public.crm_me('{}') ->> 'role') = 'admin', '3b crm_me admin';
  assert (public.crm_list_leads('{}') ->> 'total')::int = 2, '3c admin ve todos';
  assert (public.crm_list_leads('{"q":"0001"}') ->> 'total')::int = 1, '3d búsqueda por teléfono';
  assert (public.crm_list_leads('{"q":"lead dos"}') ->> 'total')::int = 1, '3e búsqueda por nombre';
  assert (public.crm_list_leads('{"duplicates":"true"}') ->> 'total')::int = 1, '3f filtro duplicados';
  assert (public.crm_list_leads('{"origin":"campaña"}') ->> 'total')::int = 1, '3g filtro origen';
  perform public.crm_set_status(json_build_object('id', l1, 'status', 'contactado')::jsonb);
  ok := false; begin perform public.crm_set_status(json_build_object('id', l1, 'status', 'inventado')::jsonb); exception when check_violation then ok := true; end;
  assert ok, '3h estado inválido rechazado';
  perform public.crm_add_note(json_build_object('id', l1, 'body', 'nota de prueba')::jsonb);
  r := public.crm_add_task(json_build_object('id', l1, 'title', 'tarea de prueba')::jsonb);
  perform public.crm_set_task_done(json_build_object('task_id', r ->> 'id', 'done', true)::jsonb);
  perform public.crm_assign(json_build_object('id', l1, 'owner_id', c1)::jsonb);
  r := public.crm_get_lead(json_build_object('id', l1)::jsonb);
  assert (select count(distinct e ->> 'type') from jsonb_array_elements(r -> 'activities') e) = 6, '3i historial completo (creado, estado, nota, tarea, tarea_completada, asignación)';
  assert exists (select 1 from jsonb_array_elements(r -> 'activities') e where e ->> 'type' = 'estado' and e ->> 'actor' = 'Admin Prueba'), '3j historial atribuido';
  assert jsonb_array_length(public.crm_export('{}')) = 2, '3k exportación admin';
  assert (select count(*) from public.audit_log) = 2, '3l auditoría de asignación y exportación';
  ok := false; begin update public.leads set email = 'otro@velour.test' where id = l1; exception when insufficient_privilege then ok := true; end;
  assert ok, '3m datos del lead inmutables';
  ok := false; begin delete from public.leads where id = l1; exception when insufficient_privilege then ok := true; end;
  assert ok, '3n no se pueden borrar leads';
  assert (select count(*) from public.conversion_events) = 1, '3o admin ve eventos';
  reset role;

  -- 4. Colaborador 1 (tiene asignado solo el lead 1)
  perform set_config('request.jwt.claims', json_build_object('sub', c1, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  assert (public.crm_list_leads('{}') ->> 'total')::int = 1, '4a colaborador ve solo lo asignado';
  assert public.crm_get_lead(json_build_object('id', l2)::jsonb) is null, '4b no abre leads ajenos';
  ok := false; begin perform public.crm_set_status(json_build_object('id', l2, 'status', 'contactado')::jsonb); exception when others then ok := sqlerrm = 'not_found'; end;
  assert ok, '4c no cambia estado de leads ajenos';
  ok := false; begin perform public.crm_add_note(json_build_object('id', l2, 'body', 'x')::jsonb); exception when insufficient_privilege then ok := true; end;
  assert ok, '4d no agrega notas a leads ajenos';
  ok := false; begin perform public.crm_export('{}'); exception when others then ok := sqlerrm = 'forbidden'; end; assert ok, '4e no exporta';
  ok := false; begin perform public.crm_assign(json_build_object('id', l2, 'owner_id', c1)::jsonb); exception when others then ok := sqlerrm = 'forbidden'; end; assert ok, '4f no asigna';
  update public.leads set owner_id = c1 where id = l2; get diagnostics n = row_count; assert n = 0, '4g no se apropia de leads por SQL';
  ok := false; begin update public.leads set owner_id = c2 where id = l1; exception when insufficient_privilege then ok := true; end; assert ok, '4h no reasigna su lead';
  assert (select count(*) from public.conversion_events) = 0, '4i no ve eventos';
  assert (select count(*) from public.audit_log) = 0, '4j no ve auditoría';
  assert (select count(*) from public.profiles) = 1, '4k solo ve su perfil';
  perform public.crm_set_status(json_build_object('id', l1, 'status', 'calificado')::jsonb);
  reset role;

  -- 5. Colaborador sin asignaciones y usuario de Auth sin perfil
  perform set_config('request.jwt.claims', json_build_object('sub', c2, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  assert (public.crm_list_leads('{}') ->> 'total')::int = 0, '5a colaborador sin asignación no ve nada';
  reset role;
  perform set_config('request.jwt.claims', json_build_object('sub', x, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  assert public.crm_me('{}') is null, '5b sin perfil no es usuario del CRM';
  assert (public.crm_list_leads('{}') ->> 'total')::int = 0, '5c sin perfil no ve leads';
  ok := false; begin perform public.crm_export('{}'); exception when others then ok := sqlerrm = 'forbidden'; end; assert ok, '5d sin perfil no exporta';
  reset role;

  -- 6. Freno de abuso: 5 por hora por email
  execute 'set local role service_role';
  for n in 3..5 loop
    perform public.create_lead(json_build_object('kind', 'question', 'name', 'Abuso', 'email', 'uno@velour.test', 'message', 'm', 'consent_version', 'v', 'request_key', 'prueba-k' || n)::jsonb);
  end loop;
  assert (public.create_lead('{"kind":"question","name":"Abuso","email":"uno@velour.test","message":"m","consent_version":"v","request_key":"prueba-k9"}') ->> 'rejected') = 'rate_limited', '6a freno de abuso';
  reset role;

  raise exception 'PRUEBAS_OK (36 verificaciones; todo revertido, no quedan datos)';
end $$;
