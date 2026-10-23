// Persistencia tras reinicio: proceso A escribe, proceso B (nuevo) lee. Uso: npm run test:persist
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
if (process.argv[2] === 'child') {
  process.env.NODE_ENV = 'test'; process.env.LEAD_STORE = 'pglite';
  process.env.DEV_ADMIN_EMAIL = 'admin@test.local'; process.env.DEV_ADMIN_PASSWORD = 'clave-de-prueba-123';
  const assert = (await import('node:assert/strict')).default;
  const { devDb, devRpc } = await import('../lib/crm/dev-db');
  const { crmRepo } = await import('../lib/crm/repo');
  const { getLeadStore } = await import('../lib/leads/store');
  const db = await devDb();
  const uid = (await db.query<{ id: string }>(`select id from auth.users where email='admin@test.local'`)).rows[0].id;
  const repo = crmRepo(devRpc({ role: 'authenticated', sub: uid }));
  const phase = process.argv[3];
  if (phase === 'write') {
    const tracking = { landingPage: '', sourcePage: '', referrerHost: '', utmSource: '', utmMedium: '', utmCampaign: '', utmContent: '', utmTerm: '' };
    const r = await getLeadStore()!.createLead({ kind: 'question', name: 'Persistente', email: 'p@ejemplo.com', phone: '', company: '', serviceType: '', audience: '', situation: '', budget: '', questionType: 'x', message: 'mensaje largo de prueba', origin: 'directo', tracking, requestKey: crypto.randomUUID() });
    assert.ok('id' in r);
    const id = (r as { id: string }).id;
    await repo.setStatus(id, 'contactado'); await repo.addNote(id, 'nota persistente'); await repo.addTask(id, 'tarea persistente', null, null);
    console.log('escrito');
  } else {
    const list = await repo.list({});
    assert.equal(list.total, 1);
    const d = JSON.stringify(await repo.get(list.rows[0].id));
    for (const t of ['contactado', 'nota persistente', 'tarea persistente', 'nuevo → contactado']) assert.ok(d.includes(t), `falta ${t}`);
    assert.equal((await repo.me())?.role, 'admin');
    console.log('tras reinicio persisten: lead, estado, nota, tarea, historial y usuario');
  }
  process.exit(0);
}
const dir = mkdtempSync(path.join(tmpdir(), 'velour-persist-'));
const run = (phase: string) => spawnSync(process.execPath, ['--conditions=react-server', '--import', 'tsx', process.argv[1], 'child', phase], { env: { ...process.env, DEV_DB_DIR: dir, DEV_ADMIN_EMAIL: 'admin@test.local', DEV_ADMIN_PASSWORD: 'clave-de-prueba-123' }, encoding: 'utf8' });
for (const phase of ['write', 'read']) { const r = run(phase); console.log(r.stdout.trim() || r.stderr.slice(-800)); if (r.status !== 0) { rmSync(dir, { recursive: true, force: true }); process.exit(1); } }
rmSync(dir, { recursive: true, force: true }); console.log('OK persistencia');
