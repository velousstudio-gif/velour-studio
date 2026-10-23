// Revisa el build de producción ANTES de desplegar (correr después de `npm run build`). Solo lectura.
//  - Ningún trabajo de cliente sin autorización (nombre, URL ni notas internas) en el HTML ni en el JavaScript público.
//  - Ninguna clave secreta ni variable de desarrollo en el JavaScript que recibe el navegador.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const walk = (dir: string): string[] => readdirSync(dir).flatMap(name => {
  const full = path.join(dir, name);
  return statSync(full).isDirectory() ? walk(full) : [full];
});
const read = (files: string[]) => files.map(file => [file, readFileSync(file, 'utf8')] as const);
const html = read(walk('.next/server/app').filter(f => /\.(html|rsc|body)$/.test(f)));
const client = read(walk('.next/static').filter(f => f.endsWith('.js')));
let problems = 0;
const fail = (message: string) => { problems += 1; console.log('  FALLA', message); };

// Los pendientes viven solo en el archivo local (ignorado por Git); si existe, se buscan en el build.
const pendingFile = 'content/clientes-pendientes.local.json';
const pending: { name: string; url: string; reviewNotes: string }[] = existsSync(pendingFile) ? JSON.parse(readFileSync(pendingFile, 'utf8')) : [];
for (const work of pending) {
  const needles = [work.name, new URL(work.url).hostname, work.reviewNotes.slice(0, 40)].filter(Boolean);
  for (const [file, text] of [...html, ...client]) for (const needle of needles) if (text.includes(needle)) fail(`"${needle}" (pendiente de autorización) aparece en ${file}`);
}
for (const [file, text] of client) {
  if (/sb_secret_|SUPABASE_SECRET_KEY|service_role|RESEND_API_KEY|DEV_ADMIN_PASSWORD/.test(text)) fail(`posible secreto o variable privada en ${file}`);
}
if (!html.length) fail('No se encontró el build (.next). Corré `npm run build` primero.');
console.log(problems ? `\n${problems} problema(s): NO desplegar.` : `OK build público: ${html.length} páginas y ${client.length} archivos JS revisados; ${pending.length} trabajos pendientes buscados; sin pendientes ni secretos.`);
process.exit(problems ? 1 : 0);
