import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the actual TypeScript modules with a fake transport; never send email.
const cache = new Map();
const env = {};
let calls = [];
let providerResponse = () => Response.json({ id: 'test-message' });
function load(filename) {
  const file = path.resolve(filename);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const context = { exports, URL, AbortSignal, process: { env },
    fetch: async (url, init) => { calls.push({ url, ...init }); return providerResponse(); },
    require(specifier) {
      if (specifier === 'server-only') return {};
      if (specifier === 'next/server') return { NextResponse: Response };
      return load((specifier.startsWith('@/') ? path.join(process.cwd(), specifier.slice(2)) : path.resolve(path.dirname(file), specifier)) + '.ts');
    },
  };
  vm.runInNewContext(source, context, { filename: file });
  return exports;
}
const { POST } = load('app/api/contact/route.ts');
const { siteContent } = load('content/site-content.ts');
const { contactLinks } = load('lib/contact-links.ts');
const project = { kind: 'project', name: 'Prueba local', email: 'qa@example.com', company: '', phone: '', project: siteContent.diagnosticOptions.projectTypes[0], audience: siteContent.diagnosticOptions.audiences[0], situation: siteContent.diagnosticOptions.situations[0], budget: siteContent.diagnosticOptions.budgets[1], message: 'Consulta de prueba local sin envío real.', website: '' };
const question = { kind: 'question', name: 'Prueba local', email: 'qa@example.com', message: '¿Cómo definimos el alcance del proyecto?' };
async function request(data, headers = {}) {
  return POST(new Request('http://localhost:3000/api/contact', { method: 'POST', headers: { origin: 'http://localhost:3000', 'content-type': 'application/json', ...headers }, body: JSON.stringify(data) }));
}
assert.equal((await request(project)).status, 503);
assert.equal((await request(question)).status, 503);
assert.equal(calls.length, 0);
for (const bad of [{ ...project, name: '   ' }, { ...project, email: 'bad' }, { ...project, message: 'corto' }, { ...project, audience: 'injected' }, { ...project, situation: '' }, { ...project, project: 'injected' }, { ...project, budget: 'injected' }, { ...project, website: 'spam' }, { ...question, kind: 'unknown' }, [], null]) {
  assert.equal((await request(bad)).status, 400);
}
assert.equal((await request(project, { origin: 'https://other.example' })).status, 403);
assert.equal((await request(project, { 'content-type': 'text/plain' })).status, 415);
assert.equal((await request({ ...project, message: 'x'.repeat(17000) })).status, 413);
Object.assign(env, { RESEND_API_KEY: 're_local_fake_key', RESEND_FROM_EMAIL: 'sender@example.com', FORM_RECIPIENT_EMAIL: 'recipient@example.com' });
for (const input of [project, question]) {
  assert.equal((await request(input)).status, 200);
  const payload = JSON.parse(calls.at(-1).body);
  assert.equal(payload.reply_to, input.email);
  assert.deepEqual(payload.to, ['recipient@example.com']);
  assert.equal(payload.from, 'Velour Studio <sender@example.com>');
  assert.ok(payload.text.includes(input.message));
  if (input.kind === 'project') { assert.ok(payload.text.includes(input.situation)); assert.ok(payload.text.includes(input.audience)); }
  else assert.equal(payload.subject, 'Nueva pregunta — Velour Studio');
}
providerResponse = () => Response.json({ error: 'private-provider-error' }, { status: 429 });
const failure = await request(question);
assert.equal(failure.status, 502);
assert.ok(!(await failure.text()).includes('private-provider-error'));
providerResponse = () => Response.json({});
assert.equal((await request(project)).status, 502);
const links = contactLinks(siteContent.contact);
assert.equal(links.emailHref, 'mailto:velousstudio@gmail.com');
const whatsapp = new URL(links.whatsappHref);
assert.equal(whatsapp.origin + whatsapp.pathname, 'https://wa.me/5493585329272');
assert.equal(whatsapp.searchParams.get('text'), siteContent.contact.whatsappMessage);
assert.equal(links.instagram, ''); assert.equal(links.linkedin, '');
console.log('Formularios: validación, configuración ausente, Resend simulado, errores y enlaces correctos. No se enviaron emails.');
