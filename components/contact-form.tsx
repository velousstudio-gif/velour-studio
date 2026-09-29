'use client';
import { siteContent } from '@/content/site-content';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, LoaderCircle, CheckCircle2 } from 'lucide-react';
import { contact } from '@/lib/content';

export default function ContactForm({ enabled = false }: { enabled?: boolean }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plan = new URLSearchParams(window.location.search).get('plan');
    if (plan && formRef.current) {
      const field = formRef.current.elements.namedItem('message') as HTMLTextAreaElement;
      field.value = `Me interesa el plan ${plan.slice(0, 150)}. `;
    }
  }, []);

  useEffect(() => {
    if (status === 'success' || status === 'error') statusRef.current?.focus();
  }, [status]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'loading') return;
    const form = event.currentTarget;
    for (const key of ['name', 'message']) {
      const field = form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement;
      const minimum = key === 'message' ? 10 : 1;
      field.setCustomValidity(field.value.trim().length < minimum
        ? (key === 'message' ? siteContent.form.messages.messageTooShort : siteContent.form.messages.nameRequired) : '');
    }
    if (!form.reportValidity()) return;
    if (!enabled) {
      setStatus('error');
      setMessage(siteContent.form.messages.unavailable);
      return;
    }
    setStatus('loading');
    setMessage('');
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || siteContent.form.messages.failure);
      setStatus('success');
      setMessage(siteContent.form.messages.success);
      form.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error && error.name !== 'TimeoutError'
        ? error.message : siteContent.form.messages.timeout);
    }
  }

  return <form ref={formRef} onSubmit={submit} className="contact-form" aria-busy={status === 'loading'}>
    {!enabled && <p className="form-availability">{siteContent.copy.form.el_envio_de_consultas_estara_disponible_proximamente}{contact.email && <>{siteContent.copy.form.mientras_tanto}<a href={contact.emailHref}>{siteContent.copy.form.escribinos_por_email}</a>{siteContent.copy.form.symbol}</>}</p>}
    <p className="form-help">{siteContent.copy.form.los_campos_con_son_obligatorios}</p>
    <div className="form-grid">
      <label>{siteContent.copy.form.nombre}<span>{siteContent.copy.form.symbol_2}</span><input name="name" autoComplete="name" placeholder={siteContent.copy.form.tu_nombre} required maxLength={100} onInput={event => event.currentTarget.setCustomValidity('')} /></label>
      <label>{siteContent.copy.form.empresa}<input name="company" autoComplete="organization" placeholder={siteContent.copy.form.nombre_de_tu_negocio} maxLength={150} /></label>
      <label>{siteContent.copy.form.email}<span>{siteContent.copy.form.symbol_2}</span><input name="email" type="email" autoComplete="email" placeholder={siteContent.copy.form.vos_tuempresa_com} required maxLength={254} /></label>
      <label>{siteContent.copy.form.whatsapp}<input name="phone" type="tel" autoComplete="tel" placeholder={siteContent.copy.form.text_54_9} maxLength={40} /></label>
      <label>{siteContent.copy.form.tipo_de_proyecto}<span>{siteContent.copy.form.symbol_2}</span><select name="project" required defaultValue=""><option value="" disabled>{siteContent.copy.form.selecciona_una_opcion}</option>{siteContent.form.projectTypes.map(type => <option key={type}>{type}</option>)}</select></label>
      <label>{siteContent.copy.form.presupuesto}<select name="budget" defaultValue=""><option value="">{siteContent.copy.form.sin_definir}</option>{siteContent.form.budgets.map(budget => <option key={budget}>{budget}</option>)}</select></label>
    </div>
    <label>{siteContent.copy.form.mensaje}<span>{siteContent.copy.form.symbol_2}</span><textarea name="message" placeholder={siteContent.copy.form.contanos_un_poco_sobre_tu_proyecto} rows={4} required minLength={10} maxLength={5000} aria-describedby="message-help" onInput={event => event.currentTarget.setCustomValidity('')} /></label>
    <p className="form-help" id="message-help">{siteContent.copy.form.al_menos_10_caracteres}</p>
    <div className="honeypot" aria-hidden="true"><label>{siteContent.copy.form.no_completar}<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="form-bottom">
      <p>{siteContent.copy.form.al_enviar_aceptas_nuestra}<Link href={siteContent.links.privacy}>{siteContent.copy.form.politica_de_privacidad}</Link></p>
      <button className="button primary" disabled={status === 'loading'} type="submit">{status === 'loading' ? <>{siteContent.copy.form.enviando}<LoaderCircle aria-hidden="true" className="spin" size={17} /></> : <>{siteContent.copy.form.enviar_proyecto}<ArrowUpRight aria-hidden="true" size={17} /></>}</button>
    </div>
    <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true" className={`form-status ${status}`}>{status === 'success' && <CheckCircle2 aria-hidden="true" size={18} />} {message}</div>
  </form>;
}
