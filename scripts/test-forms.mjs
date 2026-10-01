import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';
import { Resend } from 'resend';
import ts from 'typescript';

// Exercise the actual endpoint AND installed Resend SDK with a fake HTTP transport.
// No local credentials are loaded and no network requests or emails are sent.
process.env.NODE_ENV = 'production';
const cache = new Map();
const env = {};
const calls = [];
const logs = [];
let providerResponse = () => Response.json({ id: 'test-message' });
globalThis.fetch = async (url, init) => {
  assert.equal(url, 'https://api.resend.com/emails');
  calls.push({ url, ...init });
  return providerResponse();
};
function load(filename) {
  const file = path.resolve(filename);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const context = { exports, URL, process: { env },
    console: { error: (...args) => logs.push(args), info: (...args) => logs.push(args) },
    require(specifier) {
      if (specifier === 'server-only') return {};
      if (specifier === 'next/server') return { NextResponse: Response };
      if (specifier === 'node:crypto') return { randomUUID };
      if (specifier === 'resend') return { Resend };
      return load((specifier.startsWith('@/') ? path.join(process.cwd(), specifier.slice(2)) : path.resolve(path.dirname(file), specifier)) + '.ts');
    },
  };
  vm.runInNewContext(source, context, { filename: file });
  return exports;
}
const { POST } = load('app/api/contact/route.ts');
const { siteContent } = load('content/site-content.ts');
const { contactLinks } = load('lib/contact-links.ts');
const project = { kind: 'project', name: 'Prueba local', email: 'qa@example.com', company: 'Empresa de prueba', phone: '+54 9 000 000 0000', project: siteContent.diagnosticOptions.projectTypes[0], audience: siteContent.diagnosticOptions.audiences[0], situation: siteContent.diagnosticOptions.situations[0], budget: siteContent.diagnosticOptions.budgets[1], message: 'Consulta de prueba local sin envío real. <script>inert</script>', website: '' };
const question = { kind: 'question', name: 'Prueba local', email: 'qa@example.com', message: '¿Cómo definimos el alcance del proyecto?' };
async function request(data, headers = {}) {
  return POST(new Request('http://localhost:3000/api/contact', { method: 'POST', headers: { origin: 'http://localhost:3000', 'content-type': 'application/json', ...headers }, body: JSON.stringify(data) }));
}
for (const input of [project, question]) {
  const missing = await request(input);
  assert.equal(missing.status, 503);
  assert.equal((await missing.json()).error, siteContent.form.messages.failure);
}
assert.equal(calls.length, 0);
assert.ok(JSON.stringify(logs).includes('FROM_EMAIL'));
assert.ok(JSON.stringify(logs).includes('CONTACT_EMAIL'));
for (const bad of [{ ...project, name: '   ' }, { ...project, name: 'x'.repeat(101) }, { ...project, email: 'bad' }, { ...project, email: 'a@example.com\r\nBcc: other@example.com' }, { ...project, message: 'corto' }, { ...project, message: 'x'.repeat(5001) }, { ...project, company: {} }, { ...project, phone: 'x'.repeat(41) }, { ...project, audience: 'injected' }, { ...project, situation: '' }, { ...project, project: 'injected' }, { ...project, budget: 'injected' }, { ...project, website: 'spam' }, { ...question, kind: 'unknown' }, [], null]) {
  assert.equal((await request(bad)).status, 400);
}
assert.equal((await request(project, { origin: 'https://other.example' })).status, 403);
assert.equal((await request(project, { 'content-type': 'text/plain' })).status, 415);
assert.equal((await request({ ...project, message: 'x'.repeat(17000) })).status, 413);
assert.equal((await request(project, { 'idempotency-key': 'invalid' })).status, 400);
assert.equal((await POST(new Request('http://localhost:3000/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{broken' }))).status, 400);
Object.assign(env, { RESEND_API_KEY: 're_local_fake_key', FROM_EMAIL: 'sender@example.com', CONTACT_EMAIL: 'recipient@example.com' });
for (const input of [project, question]) {
  const key = randomUUID();
  const response = await request(input, { 'idempotency-key': key });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  const payload = JSON.parse(calls.at(-1).body);
  assert.equal(payload.reply_to, input.email);
  assert.deepEqual(payload.to, ['recipient@example.com']);
  assert.equal(payload.from, 'sender@example.com');
  assert.equal(payload.subject, 'Nueva solicitud de proyecto — Velour Studio');
  for (const label of ['Nombre:', 'Empresa:', 'Email:', 'WhatsApp:', 'Tipo de proyecto:', 'Presupuesto:', 'Mensaje:']) assert.ok(payload.text.includes(label));
  assert.ok(payload.text.includes(input.message));
  assert.equal(payload.html, undefined);
  if (input.kind === 'project') for (const field of ['company', 'phone', 'project', 'budget', 'situation', 'audience']) assert.ok(payload.text.includes(input[field]));
  assert.equal(new Headers(calls.at(-1).headers).get('idempotency-key'), `velour-contact/${key}`);
}
env.FROM_EMAIL = 'Velour Studio <sender@example.com>';
assert.equal((await request(project)).status, 200);
assert.equal(JSON.parse(calls.at(-1).body).from, env.FROM_EMAIL);
for (const sender of ['', 'not-an-email', 'Velour Studio <bad>', 'sender@example.com\r\nBcc: other@example.com']) {
  env.FROM_EMAIL = sender;
  assert.equal((await request(project)).status, 503);
}
env.FROM_EMAIL = 'sender@example.com';
env.CONTACT_EMAIL = '';
assert.equal((await request(project)).status, 503);
env.CONTACT_EMAIL = 'recipient@example.com';
for (const status of [403, 429, 500]) {
  providerResponse = () => Response.json({ name: 'validation_error', statusCode: status, message: 'private-provider-error ' + env.RESEND_API_KEY }, { status });
  const failure = await request(question);
  assert.equal(failure.status, 502);
  assert.deepEqual(await failure.json(), { error: siteContent.form.messages.failure });
}
assert.ok(JSON.stringify(logs).includes('Resend rechazó'));
assert.ok(JSON.stringify(logs).includes('private-provider-error'));
assert.ok(!JSON.stringify(logs).includes(env.RESEND_API_KEY));
providerResponse = () => Response.json({});
assert.equal((await request(project)).status, 502);
providerResponse = () => { throw new Error('Connection lost'); };
assert.equal((await request(question)).status, 502);
const links = contactLinks(siteContent.contact);
assert.equal(links.emailHref, 'mailto:velousstudio@gmail.com');
const whatsapp = new URL(links.whatsappHref);
assert.equal(whatsapp.origin + whatsapp.pathname, 'https://wa.me/5493585329272');
assert.equal(whatsapp.searchParams.get('text'), siteContent.contact.whatsappMessage);
assert.equal(links.instagram, ''); assert.equal(links.linkedin, '');
console.log('OK: endpoint, validación, variables exactas, SDK Resend real con HTTP simulado, campos/asunto/replyTo, idempotencia, errores y logs sin claves. No se enviaron emails.');
