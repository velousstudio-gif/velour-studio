'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { useDict, useLocalePath } from './locale';
import { currentAttribution, track } from '@/lib/funnel';

/**
 * Formulario corto del VSL. Usa el mismo endpoint que el resto del sitio (/api/contact):
 * el lead entra al CRM con la página de llegada (/vsl) y las UTM del anuncio, y avisa por email.
 */
export function VslForm() {
  const router = useRouter();
  const options = siteContent.diagnosticOptions;
  const { ui } = useDict();
  const lp = useLocalePath();
  const vsl = ui.vsl;
  const labels = ui.options;
  const en = labels.projectTypes[0] === 'Website';
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const started = useRef(false);
  const lock = useRef(false);
  const attempt = useRef<{ body: string; key: string } | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const message = (values.message || '').trim();
    const data = { ...values, kind: 'project', message: message.length >= 10 ? message : vsl.form.defaultMessage, tracking: currentAttribution() };
    const body = JSON.stringify(data);
    lock.current = true; setStatus('loading');
    try {
      if (attempt.current?.body !== body) attempt.current = { body, key: crypto.randomUUID() };
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': attempt.current.key }, body, signal: AbortSignal.timeout(20000) });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw new Error('failed');
      track('lead_submit_success');
      router.push(lp('/vsl/gracias'));
    } catch {
      track('lead_submit_error'); setStatus('error'); lock.current = false;
    }
  }

  return <form className="vsl-form" onSubmit={submit} onFocus={() => { if (!started.current) { started.current = true; track('form_start'); } }} aria-busy={status === 'loading'}>
    <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
    <fieldset disabled={status === 'loading'}>
      <label><span>{en ? 'Name *' : 'Nombre *'}</span><input name="name" required maxLength={100} autoComplete="name" placeholder={en ? 'Your name' : 'Tu nombre'} /></label>
      <label><span>{en ? 'WhatsApp / phone *' : 'WhatsApp *'}</span><input name="phone" required maxLength={40} type="tel" autoComplete="tel" placeholder={en ? '+1 …' : '+54 9 …'} /></label>
      <label className="vsl-span"><span>Email *</span><input name="email" required type="email" maxLength={200} autoComplete="email" placeholder={en ? 'you@company.com' : 'vos@tuempresa.com'} /></label>
      <label><span>{ui.agency.diagnostic.need} *</span><select name="project" required defaultValue=""><option value="" disabled>{ui.agency.diagnostic.selectionPlaceholder}</option>{options.projectTypes.map((value, i) => <option key={value} value={value}>{labels.projectTypes[i] ?? value}</option>)}</select></label>
      <label><span>{ui.agency.diagnostic.audience} *</span><select name="audience" required defaultValue=""><option value="" disabled>{ui.agency.diagnostic.selectionPlaceholder}</option>{options.audiences.map((value, i) => <option key={value} value={value}>{labels.audiences[i] ?? value}</option>)}</select></label>
      <label><span>{ui.agency.diagnostic.situation} *</span><select name="situation" required defaultValue=""><option value="" disabled>{ui.agency.diagnostic.selectionPlaceholder}</option>{options.situations.map((value, i) => <option key={value} value={value}>{labels.situations[i] ?? value}</option>)}</select></label>
      <label><span>{ui.agency.diagnostic.budget}</span><select name="budget" defaultValue=""><option value="">{en ? 'Prefer not to say' : 'Prefiero no decir'}</option>{options.budgets.map((value, i) => <option key={value} value={value}>{labels.budgets[i] ?? value}</option>)}</select></label>
      <label className="vsl-span"><span>{en ? 'Anything else? (optional)' : 'Contanos algo más (opcional)'}</span><textarea name="message" rows={3} maxLength={5000} placeholder={en ? 'What would you like to achieve?' : '¿Qué te gustaría lograr?'} /></label>
    </fieldset>
    <button type="submit" className="ix-btn ix-btn-gold ix-btn-glow vsl-submit" disabled={status === 'loading'}>{status === 'loading' ? (en ? 'SENDING…' : 'ENVIANDO…') : vsl.form.submit}<ArrowUpRight size={17} aria-hidden="true" /></button>
    <p className="vsl-form-note" role="status" aria-live="polite">{status === 'error' ? ui.messages.failure : vsl.form.note}</p>
    <p className="vsl-form-legal">{ui.form.al_enviar_aceptas_nuestra}<Link href="/privacidad">{ui.form.politica_de_privacidad}</Link></p>
  </form>;
}
