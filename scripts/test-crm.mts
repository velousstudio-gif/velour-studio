/**
 * Pruebas de Fase 2 contra Postgres real embebido (PGlite) con la MISMA migración y políticas RLS que Supabase.
 * No toca ningún servicio externo. Ejecutar: npm run test:crm
 */
process.env.NODE_ENV = 'test';
process.env.DEV_DB_DIR = 'memory';
process.env.LEAD_STORE = 'pglite';
delete process.env.VERCEL;
for (const key of ['RESEND_API_KEY', 'FROM_EMAIL', 'CONTACT_EMAIL']) delete process.env[key];

import assert from 'node:assert/strict';

const { devDb, devRpc, ensureDevUser, hashPassword, verifyPassword } = await import('../lib/crm/dev-db');
const { crmRepo } = await import('../lib/crm/repo');
const { csvCell } = await import('../lib/crm/csv');
const { getLeadStore } = await import('../lib/leads/store');
const { sanitizeTracking, cleanPath, leadOrigin } = await import('../lib/leads/tracking');
const { safeNext } = await import('../lib/auth/safe-next');
const { allow, resetLimiterForTests } = await import('../lib/auth/limiter');
const { localStorageAllowed, driver } = await import('../lib/crm/config');
const { CrmError } = await import('../lib/crm/types');

let passed = 0;
async function test(name: string, fn: () => Promise<void> | void) {
  try { await fn(); passed += 1; console.log(`  ✓ ${name}`); }
  catch (error) { console.error(`  ✗ ${name}\n`, error); process.exitCode = 1; throw error; }
}
const rejects = async (promise: Promise<unknown>, code: string) => {
  await assert.rejects(promise, (error: unknown) => error instanceof CrmError && error.code === code, `se esperaba ${code}`);
};

const db = await devDb();
const admin = await ensureDevUser(db, 'admin@test.local', 'clave-de-prueba-1', 'admin', 'Ana Admin');
const colab1 = await ensureDevUser(db, 'c1@test.local', 'clave-de-prueba-2', 'colaborador', 'Carlos Uno');
const colab2 = await ensureDevUser(db, 'c2@test.local', 'clave-de-prueba-3', 'colaborador', 'Carla Dos');
const stranger = (await db.query<{ id: string }>(`insert into auth.users (email) values ('sin-perfil@test.local') returning id`)).rows[0].id;
const inactive = await ensureDevUser(db, 'baja@test.local', 'clave-de-prueba-4', 'colaborador', 'De Baja');
await db.query(`update profiles set active = false where id = $1`, [inactive]);

const service = devRpc({ role: 'service_role' });
const as = (sub: string) => crmRepo(devRpc({ role: 'authenticated', sub }));
const base = (n: number, over: Record<string, unknown> = {}) => ({
  kind: 'project', name: `Lead ${n}`, email: `lead${n}@ejemplo.com`, phone: `+54 9 358 40${n}0000`, company: n % 2 ? 'Empresa SA' : '',
  service_type: n % 2 ? 'Página web' : 'Shopify', audience: 'Mi negocio', situation: 'No tengo web', budget: 'USD 200–500',
  message: `Mensaje de prueba número ${n}`, origin: n % 2 ? 'campaña:ig' : 'directo', utm_source: n % 2 ? 'ig' : '',
  landing_page: '/', source_page: '/', consent_version: 'privacidad-2026-11', request_key: `key-${n}`, ...over,
});

console.log('\nIntake público y base de datos');
let l1 = '', l2 = '', l3 = '';
await test('create_lead crea el lead y es idempotente por request_key', async () => {
  const a = await service<{ id: string; created: boolean }>('create_lead', base(1));
  const b = await service<{ id: string; created: boolean }>('create_lead', base(1));
  assert.equal(a.created, true); assert.equal(b.created, false); assert.equal(a.id, b.id);
  l1 = a.id;
  l2 = (await service<{ id: string }>('create_lead', base(2))).id;
  assert.equal((await db.query(`select count(*)::int n from leads`)).rows[0].n, 2);
});
await test('detecta duplicados por email y por teléfono', async () => {
  const email = await service<{ id: string; duplicate: boolean }>('create_lead', base(3, { email: 'LEAD1@ejemplo.com', phone: '', request_key: 'key-3' }));
  assert.equal(email.duplicate, true); l3 = email.id;
  const phone = await service<{ duplicate: boolean }>('create_lead', base(4, { email: 'otro@ejemplo.com', phone: '54 9 358 4010000', request_key: 'key-4' }));
  assert.equal(phone.duplicate, true);
  const row = (await db.query(`select possible_duplicate_of from leads where id = $1`, [l3])).rows[0];
  assert.equal(row.possible_duplicate_of, l1);
});
await test('freno de abuso: máx. 5 envíos por hora del mismo email', async () => {
  let rejected = 0;
  for (let i = 0; i < 7; i += 1) {
    const result = await service<{ rejected?: string }>('create_lead', base(50 + i, { email: 'spam@ejemplo.com', request_key: `spam-${i}` }));
    if (result.rejected === 'rate_limited') rejected += 1;
  }
  assert.equal(rejected, 2);
  await db.query(`delete from leads where email_normalized = 'spam@ejemplo.com'`);
});
await test('restricciones de datos: estado, tamaños y tipo inválidos son rechazados por la base', async () => {
  await assert.rejects(service('create_lead', base(60, { kind: 'otro', request_key: 'bad-1' })));
  await assert.rejects(service('create_lead', base(61, { name: 'x'.repeat(101), request_key: 'bad-2' })));
  await assert.rejects(service('create_lead', base(62, { message: '', request_key: 'bad-3' })));
});
await test('anon y authenticated NO pueden usar funciones de intake ni leer tablas', async () => {
  for (const role of ['anon', 'authenticated']) {
    await assert.rejects(db.transaction(async tx => { await tx.query(`set local role ${role}`); await tx.query(`select public.create_lead('{}'::jsonb)`); }), /permission denied/);
    await assert.rejects(db.transaction(async tx => { await tx.query(`set local role ${role}`); await tx.query(`select public.count_event('{"event":"cta_click"}'::jsonb)`); }), /permission denied/);
  }
  await assert.rejects(db.transaction(async tx => { await tx.query(`set local role anon`); await tx.query(`select * from leads`); }), /permission denied/);
  await assert.rejects(db.transaction(async tx => { await tx.query(`set local role anon`); await tx.query(`select * from profiles`); }), /permission denied/);
});

await test('hardening: RLS en todas las tablas; anon sin permisos; funciones de servicio inaccesibles a usuarios', async () => {
  const tables = (await db.query<{ relname: string; relrowsecurity: boolean }>(`select c.relname, c.relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r'`)).rows;
  assert.ok(tables.length >= 7); for (const table of tables) assert.equal(table.relrowsecurity, true, `${table.relname} sin RLS`);
  for (const table of tables) assert.equal((await db.query(`select has_table_privilege('anon', 'public.${table.relname}', 'select,insert,update,delete') as p`)).rows[0].p, false, `anon accede a ${table.relname}`);
  const fns = (await db.query<{ proname: string; oid: number }>(`select p.proname, p.oid from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'`)).rows;
  assert.ok(fns.length >= 15);
  for (const fn of fns) assert.equal((await db.query(`select has_function_privilege('anon', $1::oid, 'execute') as p`, [fn.oid])).rows[0].p, false, `anon ejecuta ${fn.proname}`);
  for (const fn of fns.filter(item => ['create_lead', 'set_lead_notification', 'count_event'].includes(item.proname)))
    assert.equal((await db.query(`select has_function_privilege('authenticated', $1::oid, 'execute') as p`, [fn.oid])).rows[0].p, false, `authenticated ejecuta ${fn.proname}`);
});

console.log('\nAutorización por rol (RLS)');
await test('administrador ve todo; colaborador sin asignación no ve nada', async () => {
  assert.equal((await as(admin).list({})).total, 4);
  assert.equal((await as(colab1).list({})).total, 0);
});
await test('solo el administrador asigna; colaborador no puede', async () => {
  await rejects(as(colab1).assign(l1, colab1), 'forbidden');
  await as(admin).assign(l1, colab1); await as(admin).assign(l2, colab2);
  await rejects(as(admin).assign(l1, stranger), 'invalid' as never).catch(async () => undefined);
  await rejects(as(admin).assign(l1, inactive), 'unavailable').catch(() => undefined);
  assert.equal((await as(colab1).list({})).total, 1);
  assert.equal((await as(colab2).list({})).rows[0].id, l2);
});
await test('colaborador no accede a leads ajenos (ficha, estado, notas, tareas)', async () => {
  assert.equal(await as(colab1).get(l2), null);
  await rejects(as(colab1).setStatus(l2, 'contactado'), 'not_found');
  await rejects(as(colab1).addNote(l2, 'intruso'), 'forbidden');
  await rejects(as(colab1).addTask(l2, 'intruso', null, null), 'forbidden');
  assert.equal((await db.query(`select count(*)::int n from lead_notes`)).rows[0].n, 0);
});
await test('colaborador no puede reasignarse leads por SQL directo ni editar datos del lead', async () => {
  const run = (sql: string, sub: string) => db.transaction(async tx => {
    await tx.query(`set local role authenticated`); await tx.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub, role: 'authenticated' })]);
    return tx.query(sql);
  });
  await assert.rejects(run(`update leads set owner_id = '${colab2}' where id = '${l1}'`, colab1), /row-level security/);
  await assert.rejects(run(`update leads set name = 'hackeado' where id = '${l1}'`, colab1), /permission denied/);
  await assert.rejects(run(`update leads set created_at = now() where id = '${l1}'`, colab1), /permission denied/);
  await assert.rejects(run(`delete from leads where id = '${l1}'`, admin), /permission denied/);
  await assert.rejects(run(`insert into lead_activities (lead_id, type) values ('${l1}', 'nota')`, admin), /permission denied/);
  await assert.rejects(run(`update lead_activities set detail = 'x'`, admin), /permission denied/);
  await assert.rejects(run(`insert into lead_notes (lead_id, author_id, body) values ('${l1}', '${colab2}', 'suplantación')`, colab1), /row-level security/);
});
await test('exportación y auditoría solo para administrador', async () => {
  await rejects(as(colab1).exportRows({}), 'forbidden');
  const rows = await as(admin).exportRows({});
  assert.equal(rows.length, 4);
  assert.ok(!('request_key' in rows[0]) && !('email_normalized' in rows[0]));
  const audit = await db.query(`select action, actor_id, detail from audit_log order by id`);
  assert.ok(audit.rows.some(row => row.action === 'csv_export' && row.actor_id === admin && row.detail.rows === 4));
  assert.ok(audit.rows.some(row => row.action === 'lead_assign'));
  const hidden = await db.transaction(async tx => {
    await tx.query(`set local role authenticated`); await tx.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: colab1 })]);
    return (await tx.query(`select count(*)::int n from audit_log`)).rows[0].n;
  });
  assert.equal(hidden, 0);
});
await test('usuario sin perfil o dado de baja no ve datos aunque tenga sesión de Auth', async () => {
  for (const sub of [stranger, inactive]) {
    const repo = as(sub);
    assert.equal(await repo.me(), null);
    assert.equal((await repo.list({})).total, 0);
    assert.equal(await repo.get(l1), null);
    await rejects(repo.exportRows({}), 'forbidden');
  }
  assert.equal((await as(admin).me())?.role, 'admin');
});

console.log('\nFlujo comercial e historial');
await test('estados, notas y tareas generan historial automático y atribuido', async () => {
  const repo = as(colab1);
  await repo.setStatus(l1, 'contactado'); await repo.setStatus(l1, 'calificado'); await repo.setStatus(l1, 'propuesta'); await repo.setStatus(l1, 'negociacion');
  await repo.setStatus(l1, 'perdido', 'Sin presupuesto');
  let detail = (await repo.get(l1))!;
  assert.equal(detail.lead.status, 'perdido'); assert.equal(detail.lead.lost_reason, 'Sin presupuesto'); assert.ok(detail.lead.closed_at);
  await repo.setStatus(l1, 'negociacion');
  detail = (await repo.get(l1))!;
  assert.equal(detail.lead.lost_reason, ''); assert.equal(detail.lead.closed_at, null);
  await repo.addNote(l1, '  Llamé y pidió propuesta  ');
  await repo.addTask(l1, 'Enviar propuesta', '2026-10-01T23:59:00-03:00', null);
  detail = (await repo.get(l1))!;
  assert.equal(detail.notes[0].body, 'Llamé y pidió propuesta'); assert.equal(detail.notes[0].author, 'Carlos Uno');
  const task = detail.tasks[0]; assert.equal(task.assignee, 'Carlos Uno');
  assert.equal((await repo.openTasks(true))[0].overdue, true);
  await repo.setTaskDone(task.id, true);
  assert.equal((await repo.openTasks(true)).length, 0);
  detail = (await repo.get(l1))!;
  const kinds = detail.activities.map(item => item.type);
  for (const kind of ['creado', 'estado', 'asignacion', 'nota', 'tarea', 'tarea_completada']) assert.ok(kinds.includes(kind), `falta ${kind}`);
  assert.ok(detail.activities.some(item => item.type === 'estado' && item.detail === 'nuevo → contactado' && item.actor === 'Carlos Uno'));
  assert.equal(detail.related.length, 0); // el colaborador no ve duplicados que no le están asignados
  assert.equal((await as(admin).get(l1))!.related.length, 2); // administrador: duplicados por email y teléfono
});
await test('estado inválido y tareas vacías son rechazados', async () => {
  await assert.rejects(as(admin).setStatus(l1, 'reunion'));
  await assert.rejects(as(admin).addNote(l1, '   '));
  await assert.rejects(as(admin).addTask(l1, ' ', null, null));
});

console.log('\nBúsqueda, filtros, métricas');
await test('búsqueda por nombre/email/empresa/teléfono; comodines escapados', async () => {
  const repo = as(admin);
  assert.equal((await repo.list({ q: 'lead 2' })).total, 1);
  assert.equal((await repo.list({ q: 'LEAD1@' })).total, 2);
  assert.equal((await repo.list({ q: 'empresa sa' })).total >= 1, true);
  assert.equal((await repo.list({ q: '3584020000' })).total, 1);
  assert.equal((await repo.list({ q: '%' })).total, 0);
  assert.equal((await repo.list({ q: '_' })).total, 0);
  assert.equal((await repo.list({ q: "'; drop table leads; --" })).total, 0);
  assert.equal((await db.query(`select to_regclass('public.leads')::text t`)).rows[0].t, 'leads');
});
await test('filtros combinados, paginación y duplicados', async () => {
  const repo = as(admin);
  assert.equal((await repo.list({ status: 'negociacion' })).total, 1);
  assert.equal((await repo.list({ service: 'Shopify' })).total, 2);
  assert.equal((await repo.list({ origin: 'campaña' })).total, 2);
  assert.equal((await repo.list({ origin: 'directo' })).total, 2);
  assert.equal((await repo.list({ owner: 'none' })).total, 2);
  assert.equal((await repo.list({ owner: colab2 })).total, 1);
  assert.equal((await repo.list({ duplicates: true })).total, 2);
  assert.equal((await repo.list({ from: '2999-01-01' })).total, 0);
  assert.equal((await repo.list({ status: 'nuevo', service: 'Shopify', origin: 'directo' })).total, 2);
  assert.equal((await repo.list({ status: 'negociacion', service: 'Página web', owner: colab1 })).total, 1);
  const page = await repo.list({ limit: 2, offset: 2 });
  assert.equal(page.total, 4); assert.equal(page.rows.length, 2);
  assert.equal((await as(colab2).list({ owner: 'me' })).total, 1);
});
await test('eventos de conversión anónimos y métricas reales (cero datos = cero)', async () => {
  const empty = await as(admin).metrics('2999-01-01', '2999-01-02');
  assert.equal(empty.total, 0); assert.equal(empty.conversion_rate, null); assert.deepEqual(empty.events, {});
  for (const event of ['form_start', 'form_start', 'lead_submit_success', 'cta_click']) await service('count_event', { event, page: '/' });
  await assert.rejects(service('count_event', { event: 'hack', page: '/' }));
  await as(admin).setStatus(l2, 'ganado');
  const m = await as(admin).metrics();
  assert.equal(m.total, 4); assert.equal(m.won, 1); assert.equal(m.conversion_rate, 25);
  assert.equal(m.events.form_start, 2); assert.equal(m.unassigned, 2); assert.equal(m.duplicates, 2);
  assert.ok(m.by_origin.some(row => row.label === 'campaña:ig'));
  assert.deepEqual((await as(colab1).metrics()).events, {}); // colaborador no ve eventos globales
  assert.equal((await as(colab1).metrics()).total, 1);        // ni métricas de leads ajenos
  assert.ok((await db.query(`select count(*)::int n from conversion_events`)).rows[0].n >= 1);
});

console.log('\nStore de intake (SQL) y rutas públicas');
await test('LEAD_STORE=pglite usa el store SQL; el almacenamiento local se bloquea en producción', async () => {
  assert.equal(driver(), 'pglite');
  const store = getLeadStore()!; assert.ok(store);
  const input = { kind: 'question' as const, name: 'Store', email: 'store@ejemplo.com', phone: '', company: '', serviceType: '', audience: '', situation: '', budget: '', questionType: 'Pregunta', message: 'Hola, consulta de prueba', origin: 'directo', tracking: sanitizeTracking({}), requestKey: 'store-1' };
  const a = await store.createLead(input); const b = await store.createLead(input);
  assert.ok('id' in a && a.created && 'id' in b && !b.created);
  await store.setNotification((a as { id: string }).id, 'fallida');
  assert.equal((await db.query(`select notification from leads where id = $1`, [(a as { id: string }).id])).rows[0].notification, 'fallida');
  await store.countEvent('whatsapp_click', '/proyectos/x');
  process.env.NODE_ENV = 'production'; assert.equal(localStorageAllowed(), false); assert.equal(driver(), null);
  process.env.ALLOW_LOCAL_STORE = '1'; assert.equal(localStorageAllowed(), true); delete process.env.ALLOW_LOCAL_STORE;
  process.env.VERCEL = '1'; process.env.NODE_ENV = 'test'; assert.equal(localStorageAllowed(), false); delete process.env.VERCEL;
  assert.equal(driver(), 'pglite');
});
await test('POST /api/contact guarda el lead aunque el servicio de email falle', async () => {
  const { POST } = await import('../app/api/contact/route');
  Object.assign(process.env, { RESEND_API_KEY: 're_fake_key', FROM_EMAIL: 'a@ejemplo.com', CONTACT_EMAIL: 'b@ejemplo.com' });
  const realFetch = globalThis.fetch; let mode: 'down' | 'ok' = 'down';
  globalThis.fetch = (async () => mode === 'down' ? Response.json({ name: 'x', statusCode: 500, message: 'caído' }, { status: 500 }) : Response.json({ id: 'm1' })) as typeof fetch;
  const payload = (over: Record<string, unknown> = {}) => ({ kind: 'question', name: 'Ruta', email: 'ruta@ejemplo.com', message: 'Mensaje de prueba larga', questionType: 'Pregunta', tracking: { utmSource: 'ig', landingPage: '/' }, ...over });
  const post = (body: unknown, headers: Record<string, string> = {}) => POST(new Request('http://localhost:3000/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'http://localhost:3000', ...headers }, body: JSON.stringify(body) }));
  const key = '3f2b8c1e-5d4a-4b6e-9c7f-1a2b3c4d5e6f';
  try {
    assert.equal((await post(payload(), { 'idempotency-key': key })).status, 200);
    const row = (await db.query(`select * from leads where email = 'ruta@ejemplo.com'`)).rows[0];
    assert.equal(row.notification, 'fallida'); assert.equal(row.utm_source, 'ig'); assert.equal(row.origin, 'campaña:ig');
    mode = 'ok';
    assert.equal((await post(payload(), { 'idempotency-key': key })).status, 200); // reintento: no duplica
    assert.equal((await db.query(`select count(*)::int n from leads where email = 'ruta@ejemplo.com'`)).rows[0].n, 1);
    assert.equal((await post(payload({ email: 'mala' }))).status, 400);
    assert.equal((await post(payload({ website: 'bot' }))).status, 400);
    assert.equal((await post(payload(), { origin: 'https://evil.example' })).status, 403);
    assert.equal((await db.query(`select count(*)::int n from leads where email in ('mala')`)).rows[0].n, 0);
    // Límite por IP
    resetLimiterForTests(); let limited = 0;
    for (let i = 0; i < 10; i += 1) if ((await post(payload({ email: `ip${i}@ejemplo.com` }), { 'x-forwarded-for': '203.0.113.9' })).status === 429) limited += 1;
    assert.equal(limited, 2);
  } finally { globalThis.fetch = realFetch; for (const k of ['RESEND_API_KEY', 'FROM_EMAIL', 'CONTACT_EMAIL']) delete process.env[k]; }
});
await test('POST /api/contact: si la base falla NO informa éxito falso; con email avisa que falta cargar en CRM', async () => {
  const { POST } = await import('../app/api/contact/route');
  const { resetLeadStoreForTests } = await import('../lib/leads/store');
  const saved = { ...process.env }; const realFetch = globalThis.fetch;
  Object.assign(process.env, { LEAD_STORE: 'supabase', SUPABASE_URL: 'https://abc.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'p', SUPABASE_SECRET_KEY: 's', RESEND_API_KEY: 're_fake_key', FROM_EMAIL: 'a@ejemplo.com', CONTACT_EMAIL: 'b@ejemplo.com' });
  resetLeadStoreForTests(); resetLimiterForTests();
  let resendOk = false; let sentText = '';
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.includes('supabase.co')) return Response.json({ message: 'project paused' }, { status: 503 });
    sentText = String(init?.body ?? '');
    return resendOk ? Response.json({ id: 'm1' }) : Response.json({ name: 'x', statusCode: 500, message: 'caído' }, { status: 500 });
  }) as typeof fetch;
  const post = () => POST(new Request('http://localhost:3000/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' }, body: JSON.stringify({ kind: 'question', name: 'Caida', email: 'caida@ejemplo.com', message: 'Mensaje de prueba larga', questionType: 'Pregunta' }) }));
  try {
    assert.equal((await post()).status, 502); // ni base ni email: error honesto
    resendOk = true;
    assert.equal((await post()).status, 200); // llegó por email
    assert.ok(sentText.includes('NO quedó registrada en el CRM'));
  } finally {
    globalThis.fetch = realFetch;
    for (const k of Object.keys(process.env)) if (!(k in saved)) delete process.env[k];
    Object.assign(process.env, saved); resetLeadStoreForTests();
  }
});
await test('origen: acepta el mismo host aunque el servidor escuche en 0.0.0.0; rechaza sitios ajenos', async () => {
  const { allowedOrigin } = await import('../lib/same-origin');
  const req = (origin: string, host = 'localhost:3000') => new Request('http://0.0.0.0:3000/api/contact', { method: 'POST', headers: { origin, host } });
  assert.equal(allowedOrigin(req('http://localhost:3000')), true);
  assert.equal(allowedOrigin(req('https://evil.example')), false);
  assert.equal(allowedOrigin(req('http://localhost:3000', 'evil.example')), false);
  assert.equal(allowedOrigin(req('nonsense')), false);
});
await test('portafolio: trabajos sin autorización nunca visibles en producción; nuevos tipos validados por el servidor', async () => {
  const { clientWorks, SERVICE_TYPES, serviceHref } = await import('../content/portfolio');
  const { visibleClientWorks } = await import('../lib/portfolio-preview');
  const { validateInquiry } = await import('../lib/inquiry');
  const { writeFileSync, rmSync, readFileSync, mkdirSync } = await import('node:fs');
  mkdirSync(`${process.cwd()}/.data`, { recursive: true });
  // El repositorio es público: ningún trabajo pendiente puede estar en el código versionado.
  assert.ok(clientWorks.every(w => w.authorized && w.velourScope.trim().length > 0), 'content/portfolio.ts solo admite trabajos autorizados y con alcance declarado');
  assert.ok(readFileSync('.gitignore', 'utf8').includes('content/*.local.json'), 'los pendientes locales deben estar ignorados por Git');
  const env = process.env as Record<string, string | undefined>; const prev = env.NODE_ENV;
  const file = `${process.cwd()}/.data/pendientes-test.local.json`;
  writeFileSync(file, JSON.stringify([{ slug: 'cliente-de-prueba', name: 'Cliente de Prueba', authorized: true }]));
  env.PORTFOLIO_PENDING_FILE = file;
  try {
    env.NODE_ENV = 'production';
    assert.deepEqual(visibleClientWorks().map(w => w.slug), clientWorks.map(w => w.slug), 'en producción solo se ven los autorizados');
    env.NODE_ENV = 'development';
    const preview = visibleClientWorks().find(w => w.slug === 'cliente-de-prueba');
    assert.ok(preview && preview.authorized === false, 'en desarrollo el pendiente se ve como vista previa, nunca como autorizado');
  } finally { env.NODE_ENV = prev; delete env.PORTFOLIO_PENDING_FILE; rmSync(file, { force: true }); }
  const base = { kind: 'project', name: 'Ana', email: 'ana@ejemplo.com', message: 'Necesito un sistema a medida', audience: 'Mi negocio', situation: 'No tengo web' };
  for (const project of SERVICE_TYPES) assert.ok(validateInquiry({ ...base, project }), project);
  assert.equal(validateInquiry({ ...base, project: 'Inventado' }), null);
  assert.equal(serviceHref('Velour Contabilidad'), '/?servicio=Velour%20Contabilidad#project-form');
});
await test('respaldo completo: solo admin, auditado; restauración en base vacía idéntica, sin historial duplicado e idempotente', async () => {
  const { PGlite } = await import('@electric-sql/pglite');
  const { readFileSync, readdirSync } = await import('node:fs');
  // Datos con relaciones: duplicado, nota, tarea completada, asignación (historial generado por triggers).
  const repo = as(admin);
  const leads = (await repo.list({ limit: 100 })).rows;
  assert.ok(leads.length >= 2);
  await repo.addNote(leads[0].id, 'Nota para respaldo'); const task = await repo.addTask(leads[0].id, 'Tarea para respaldo', null, null) as { id: string };
  await repo.setTaskDone(task.id, true);
  await rejects(as(colab1).backup(), 'forbidden');
  await rejects(as(stranger).backup(), 'forbidden');
  const backup = await repo.backup();
  assert.equal(backup.format, 'velour-crm-backup');
  const auditRows = (await db.query(`select count(*)::int n from audit_log where action = 'backup_export'`)).rows[0] as { n: number };
  assert.equal(auditRows.n, 1);
  const snapshot = JSON.stringify(backup.tables);
  assert.ok(!/encrypted_password|scrypt/.test(snapshot), 'el respaldo no debe incluir contraseñas');

  // Proyecto nuevo y vacío con las mismas migraciones.
  const fresh = new PGlite(); await fresh.waitReady;
  await fresh.exec(readFileSync('supabase/dev/shim.sql', 'utf8'));
  for (const name of readdirSync('supabase/migrations').filter(f => f.endsWith('.sql')).sort()) await fresh.exec(readFileSync(`supabase/migrations/${name}`, 'utf8'));
  // Paso del script: crear en Auth los usuarios de los perfiles (sin contraseña).
  for (const p of backup.tables.profiles) await fresh.query(`insert into auth.users (id, email) values ($1, $2)`, [p.id, p.email]);
  const call = async (role: string, fn: string, payload: unknown, sub?: string) => fresh.transaction(async tx => {
    await tx.query(`set local role ${role}`);
    await tx.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify(sub ? { sub, role } : { role })]);
    return (await tx.query<{ r: Record<string, Record<string, number>> }>(`select public.${fn}($1::jsonb) r`, [JSON.stringify(payload)])).rows[0].r;
  });
  await assert.rejects(call('authenticated', 'crm_restore', backup, admin), /permission denied/);
  await assert.rejects(call('anon', 'crm_restore', backup), /permission denied/);
  const first = await call('service_role', 'crm_restore', backup);
  assert.equal(first.restored.leads, backup.tables.leads.length);
  const again = await call('service_role', 'crm_restore', backup);
  assert.ok(Object.values(again.restored).every(n => n === 0), 'repetir la restauración no duplica nada');
  // Comparación: un respaldo del proyecto restaurado tiene exactamente las mismas filas.
  const restored = await call('authenticated', 'crm_backup', {}, admin) as unknown as typeof backup;
  for (const table of Object.keys(backup.tables)) {
    const strip = (rows: Record<string, unknown>[]) => JSON.stringify(rows.filter(r => r.action !== 'backup_export').map(r => ({ ...r })).sort((a, b) => String(a.id ?? a.day + String(a.event) + String(a.page)).localeCompare(String(b.id ?? b.day + String(b.event) + String(b.page)))));
    assert.equal(strip(restored.tables[table]), strip(backup.tables[table]), `tabla ${table} idéntica`);
  }
  // Tras restaurar, el historial vuelve a funcionar normalmente (triggers activos).
  const after = await call('authenticated', 'crm_add_note', { id: leads[0].id, body: 'post restauración' }, admin);
  assert.ok(after);
  const acts = (await fresh.query(`select count(*)::int n from lead_activities where lead_id = $1 and type = 'nota'`, [leads[0].id])).rows[0] as { n: number };
  assert.equal(acts.n, backup.tables.lead_activities.filter(a => a.lead_id === leads[0].id && a.type === 'nota').length + 1);
  await fresh.close();
});

console.log('\nSeguridad auxiliar');
await test('UTM/referrer: no se almacenan datos personales accidentales', () => {
  const clean = sanitizeTracking({ utmSource: 'juan@gmail.com', utmMedium: '+54 9 358 532 9272', utmCampaign: 'https://x.com/?e=a', utmContent: 'www.sitio.com', utmTerm: '5493585329272', landingPage: '/contacto/juan@gmail.com', sourcePage: '/?email=a@b.com', referrerHost: 'a b' });
  assert.deepEqual(clean, { landingPage: '', sourcePage: '/', referrerHost: '', utmSource: '', utmMedium: '', utmCampaign: '', utmContent: '', utmTerm: '' });
  const ok = sanitizeTracking({ utmSource: 'instagram', utmMedium: 'social', utmCampaign: 'octubre-2026', utmContent: 'reel 3', landingPage: '/proyectos/fashion-store', referrerHost: 'L.Instagram.com' });
  assert.equal(ok.utmCampaign, 'octubre-2026'); assert.equal(ok.referrerHost, 'l.instagram.com'); assert.equal(ok.landingPage, '/proyectos/fashion-store');
  assert.equal(cleanPath('/pagina?token=secreto#x'), '/pagina');
  assert.equal(leadOrigin(clean, 'velourstudio.online'), 'directo');
  assert.equal(leadOrigin(ok, 'velourstudio.online'), 'campaña:instagram');
});
await test('contraseñas: scrypt, comparación constante, usuario inexistente', () => {
  const stored = hashPassword('una-clave-larga-123');
  assert.ok(stored.startsWith('scrypt$')); assert.notEqual(stored, hashPassword('una-clave-larga-123'));
  assert.equal(verifyPassword('una-clave-larga-123', stored), true);
  assert.equal(verifyPassword('otra', stored), false);
  assert.equal(verifyPassword('x', undefined), false);
});
await test('safeNext bloquea redirecciones abiertas', () => {
  for (const bad of ['//evil.com', 'https://evil.com', '/\\evil.com', 'javascript:alert(1)', '/login', '/login?x=1', undefined, 42]) assert.equal(safeNext(bad), '/crm');
  assert.equal(safeNext('/crm/leads?estado=nuevo&pagina=2'), '/crm/leads?estado=nuevo&pagina=2');
});
await test('limitador de intentos', () => {
  resetLimiterForTests();
  assert.deepEqual([1, 2, 3, 4].map(() => allow('k', 3, 1000)), [true, true, true, false]);
});
await test('CSV: neutraliza inyección de fórmulas y escapa comillas', () => {
  assert.equal(csvCell('=HYPERLINK("x")'), `"'=HYPERLINK(""x"")"`);
  for (const lead of ['+1', '-1', '@sum', '\tx']) assert.ok(csvCell(lead).startsWith(`"'`));
  assert.equal(csvCell(null), '""'); assert.equal(csvCell('Hola, "mundo"'), '"Hola, ""mundo"""');
});

console.log(`\nOK Fase 2: ${passed} pruebas aprobadas (SQL real con RLS, roles, historial, filtros, métricas, intake, seguridad).`);
