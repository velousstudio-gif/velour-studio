// Restaura un respaldo JSON del CRM (descargado desde /crm/respaldo) en un proyecto Supabase.
// Uso (ver supabase/BACKUP.md):
//   1) Crear el archivo .env.restore con RESTORE_SUPABASE_URL y RESTORE_SUPABASE_SECRET_KEY del proyecto DESTINO.
//   2) node scripts/restore-backup.mjs ruta/al/respaldo.json            → simulación: muestra qué haría, no escribe nada.
//   3) node scripts/restore-backup.mjs ruta/al/respaldo.json --confirmar → restaura.
// Seguro de repetir: solo inserta lo que falta, nunca pisa ni borra filas. Los usuarios se crean SIN contraseña
// (cada uno usa "Olvidé mi contraseña"). No muestra claves.
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

try { for (const line of readFileSync('.env.restore', 'utf8').split(/\r?\n/)) { const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch { /* opcional */ }

const [file, flag] = process.argv.slice(2);
const url = process.env.RESTORE_SUPABASE_URL, key = process.env.RESTORE_SUPABASE_SECRET_KEY;
if (!file) { console.error('Indicá el archivo de respaldo .json'); process.exit(1); }
if (!/^https:\/\/[\w-]+\.supabase\.co\/?$/.test(url || '') || !key) { console.error('Faltan RESTORE_SUPABASE_URL / RESTORE_SUPABASE_SECRET_KEY (archivo .env.restore).'); process.exit(1); }

const backup = JSON.parse(readFileSync(file, 'utf8'));
if (backup.format !== 'velour-crm-backup' || backup.version !== 1) { console.error('El archivo no es un respaldo válido de Velour.'); process.exit(1); }
const counts = Object.fromEntries(Object.entries(backup.tables).map(([name, rows]) => [name, rows.length]));
console.log(`Respaldo del ${backup.created_at}\nDestino: ${new URL(url).host}\nFilas en el respaldo:`, counts);
if (flag !== '--confirmar') { console.log('\nSimulación: no se escribió nada. Agregá --confirmar para restaurar.'); process.exit(0); }

const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
let created = 0;
for (const profile of backup.tables.profiles) {
  const { data } = await sb.auth.admin.getUserById(profile.id);
  if (data?.user) continue;
  const { error } = await sb.auth.admin.createUser({ id: profile.id, email: profile.email, email_confirm: true });
  if (error) { console.error(`No se pudo crear el usuario ${profile.email}: ${error.message}`); process.exit(1); }
  created += 1;
}
const { data, error } = await sb.rpc('crm_restore', { p: backup });
if (error) { console.error('Falló la restauración:', error.message); process.exit(1); }
console.log(`Usuarios de Auth creados: ${created}\nFilas restauradas (nuevas):`, data.restored);
console.log('Listo. Verificá con: npm run check:supabase y revisando el CRM.');
