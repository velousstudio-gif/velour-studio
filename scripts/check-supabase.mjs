// Verificación de solo lectura contra TU proyecto Supabase real. Uso:  npm run check:supabase
// No crea ni borra datos. Lee SUPABASE_* de .env.local.
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
try { for (const l of readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch {}
const { SUPABASE_URL: url, SUPABASE_PUBLISHABLE_KEY: pub, SUPABASE_SECRET_KEY: sec } = process.env;
let bad = 0; const ok = (m) => console.log('  OK  ', m); const no = (m) => { bad++; console.log('  FALLA', m); };
if (!/^https:\/\/[\w-]+\.supabase\.co\/?$/.test(url || '')) no('SUPABASE_URL ausente o con formato inválido'); else ok('SUPABASE_URL');
if (!pub) no('Falta SUPABASE_PUBLISHABLE_KEY'); if (!sec) no('Falta SUPABASE_SECRET_KEY');
if (bad) process.exit(1);
const opt = { auth: { persistSession: false }, global: { fetch: (i, n) => fetch(i, { ...n, signal: AbortSignal.timeout(10000) }) } };
const anon = createClient(url, pub, opt), svc = createClient(url, sec, opt);
// 1) El proyecto responde (si está pausado, falla aquí)
const a = await anon.from('leads').select('id').limit(1);
if (a.error && /paus|timeout|fetch|abort/i.test(a.error.message)) no('Proyecto inaccesible o pausado: ' + a.error.message); else ok('Proyecto responde');
// 2) Sin sesión no se ve ningún dato (RLS/permisos)
if ((a.data?.length ?? 0) === 0) ok('Visitante anónimo no puede leer leads'); else no('¡Un anónimo pudo leer leads!');
for (const fn of ['create_lead', 'crm_export', 'crm_assign', 'count_event', 'crm_restore']) {
  const r = await anon.rpc(fn, { p: {} }); if (r.error) ok(`anónimo no puede ejecutar ${fn}`); else no(`¡anónimo ejecutó ${fn}!`);
}
// 3) Migración aplicada: la clave de servicio ve la función de intake (payload inválido => error de validación, no "función inexistente")
const s = await svc.rpc('count_event', { p: { event: 'nope', page: '/' } });
if (s.error && /Could not find the function|does not exist/i.test(s.error.message)) no('Migración NO aplicada: ' + s.error.message); else ok('Migración aplicada (funciones presentes)');
// 3b) Migración de respaldo aplicada: crm_restore existe (rechaza un archivo inválido) y anónimos no pueden respaldar
const rb = await svc.rpc('crm_restore', { p: { format: 'x' } });
if (rb.error && /invalid_backup/.test(rb.error.message)) ok('Migración de respaldo aplicada'); else no('Falta la migración 20261023000000_crm_backup.sql');
const ab = await anon.rpc('crm_backup', { p: {} });
if (ab.error) ok('anónimo no puede descargar respaldos'); else no('¡anónimo descargó un respaldo!');
// 4) Hay al menos un administrador activo
const p = await svc.from('profiles').select('id,role,active').eq('role', 'admin').eq('active', true);
if (p.error) no('No se pudo leer profiles: ' + p.error.message); else if (p.data.length) ok(`${p.data.length} administrador(es) activo(s)`); else no('Falta el perfil admin (ejecutá seed-admin)');
console.log(bad ? `\n${bad} problema(s).` : '\nTodo correcto.'); process.exit(bad ? 1 : 0);
