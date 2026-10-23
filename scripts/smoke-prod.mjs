// Verificación posterior al despliegue (o contra un build local con `next start`). No crea ni modifica datos.
// Uso: node scripts/smoke-prod.mjs https://velourstudio.online
import { existsSync, readFileSync } from 'node:fs';
const pendingFile = 'content/clientes-pendientes.local.json';
const pendingSlugs = existsSync(pendingFile) ? JSON.parse(readFileSync(pendingFile, 'utf8')).map(w => w.slug) : [];
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
let bad = 0;
const ok = m => console.log('  OK   ', m), no = m => { bad += 1; console.log('  FALLA', m); };
const get = (p, init = {}) => fetch(base + p, { redirect: 'manual', ...init, signal: AbortSignal.timeout(15000) });
const check = (cond, m) => (cond ? ok : no)(m);

const home = await get('/');
check(home.status === 200, `home responde (${home.status})`);
const h = home.headers;
check(/max-age=\d+/.test(h.get('strict-transport-security') || '') || base.startsWith('http://'), 'HSTS activo (solo https)');
check(!!h.get('content-security-policy') || !!h.get('x-frame-options'), 'cabeceras de seguridad presentes');
const html = await home.text();
check(html.includes('id="soluciones"') && html.includes('id="project-form"'), 'secciones Soluciones y formulario presentes');
check(!/VISTA PREVIA LOCAL|PENDIENTES DE AUTORIZACI/.test(html), 'sin trabajos pendientes en la home');

for (const p of ['/crm', '/crm/leads', '/crm/respaldo', '/crm/export']) {
  const r = await get(p);
  check([307, 308, 401].includes(r.status) && (r.status === 401 || (r.headers.get('location') || '').includes('/login')), `${p} sin sesión → login/401 (${r.status})`);
}
const login = await get('/login');
check(login.status === 200 && /noindex/.test(login.headers.get('x-robots-tag') || ''), '/login disponible y noindex');
check((await get('/api/contact')).status === 405, '/api/contact rechaza GET');
const foreign = await get('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://sitio-ajeno.example' }, body: '{}' });
check(foreign.status === 403, `/api/contact rechaza otros sitios (${foreign.status})`);
for (const slug of pendingSlugs) check((await get(`/trabajos/${slug}`)).status === 404, `trabajo pendiente /trabajos/${slug} no publicado (404)`);
check((await get('/privacidad')).status === 200, '/privacidad disponible');
const sitemap = await (await get('/sitemap.xml')).text();
check(pendingSlugs.every(slug => !sitemap.includes(`/trabajos/${slug}`)), 'sitemap sin trabajos pendientes');
const robots = await (await get('/robots.txt')).text();
check(/Disallow:\s*\/crm/i.test(robots) && /Disallow:\s*\/login/i.test(robots), 'robots.txt bloquea /crm y /login');
console.log(bad ? `\n${bad} problema(s): evaluar rollback (ver DEPLOY.md).` : '\nTodo correcto.');
process.exit(bad ? 1 : 0);
