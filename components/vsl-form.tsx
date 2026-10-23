'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { vsl } from '@/content/vsl';
import { currentAttribution, track } from '@/lib/funnel';

/**
 * Formulario corto del VSL. Usa el mismo endpoint que el resto del sitio (/api/contact):
 * el lead entra al CRM con la página de llegada (/vsl) y las UTM del anuncio, y avisa por email.
 */
export function VslForm() {
  const router = useRouter();
  const options = siteContent.diagnosticOptions;
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
      router.push('/vsl/gracias');
    } catch {
      track('lead_submit_error'); setStatus('error'); lock.current = false;
    }
  }

  return <form className="vsl-form" onSubmit={submit} onFocus={() => { if (!started.current) { started.current = true; track('form_start'); } }} aria-busy={status === 'loading'}>
    <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
    <fieldset disabled={status === 'loading'}>
      <label><span>Nombre *</span><input name="name" required maxLength={100} autoComplete="name" placeholder="Tu nombre" /></label>
      <label><span>WhatsApp *</span><input name="phone" required maxLength={40} type="tel" autoComplete="tel" placeholder="+54 9 …" /></label>
      <label className="vsl-span"><span>Email *</span><input name="email" required type="email" maxLength={200} autoComplete="email" placeholder="vos@tuempresa.com" /></label>
      <label><span>¿Qué necesitás? *</span><select name="project" required defaultValue=""><option value="" disabled>Elegí una opción</option>{options.projectTypes.map(value => <option key={value}>{value}</option>)}</select></label>
      <label><span>¿Para quién es? *</span><select name="audience" required defaultValue=""><option value="" disabled>Elegí una opción</option>{options.audiences.map(value => <option key={value}>{value}</option>)}</select></label>
      <label><span>¿Cómo estás hoy? *</span><select name="situation" required defaultValue=""><option value="" disabled>Elegí una opción</option>{options.situations.map(value => <option key={value}>{value}</option>)}</select></label>
      <label><span>Presupuesto aproximado</span><select name="budget" defaultValue=""><option value="">Prefiero no decir</option>{options.budgets.map(value => <option key={value}>{value}</option>)}</select></label>
      <label className="vsl-span"><span>Contanos algo más (opcional)</span><textarea name="message" rows={3} maxLength={5000} placeholder="¿Qué te gustaría lograr?" /></label>
    </fieldset>
    <button type="submit" className="ix-btn ix-btn-gold ix-btn-glow vsl-submit" disabled={status === 'loading'}>{status === 'loading' ? 'ENVIANDO…' : vsl.form.submit}<ArrowUpRight size={17} aria-hidden="true" /></button>
    <p className="vsl-form-note" role="status" aria-live="polite">{status === 'error' ? siteContent.form.messages.failure : vsl.form.note}</p>
    <p className="vsl-form-legal">Al enviar aceptás nuestra <Link href="/privacidad">política de privacidad</Link>.</p>
  </form>;
}
