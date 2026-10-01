'use client';

import { MotionLink as Link, AnimatedButton, editorialEase, useMotionPreferences } from './motion';
import { motion } from 'framer-motion';
import { flushSync } from 'react-dom';
import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, ArrowRight, ArrowLeft, LoaderCircle, CheckCircle2 } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { loadScrollMotion, refreshMotionLayout } from '@/lib/motion';

const labels = siteContent.copy.form;
const copy = siteContent.agency;
const options = siteContent.diagnosticOptions;

export function ProjectDiagnostic() {
  return <InquiryForm kind="project" />;
}
export function QuestionForm() {
  return <InquiryForm kind="question" />;
}

function InquiryForm({ kind }: { kind: 'project' | 'question' }) {
  const diagnostic = kind === 'project';
  const [step, setStep] = useState(1);
  const [changingStep, setChangingStep] = useState(false);
  const { reduced } = useMotionPreferences();
  const formRef = useRef<HTMLFormElement>(null);
  const stepContext = useRef<gsap.Context | null>(null);
  const transitionLock = useRef(false);
  const submitLock = useRef(false);
  const submission = useRef<{ body: string; key: string } | null>(null);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; stepContext.current?.revert(); }; }, []);
  const [selection, setSelection] = useState({ project: '', audience: '', situation: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const statusRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(1);

  useEffect(() => {
    if (!diagnostic) return;
    const plan = new URLSearchParams(window.location.search).get('plan');
    const field = formRef.current?.elements.namedItem('message') as HTMLTextAreaElement | null;
    if (plan && field) field.value = `Me interesa el plan ${plan.slice(0, 150)}. `;
  }, [diagnostic, formRef]);
  useEffect(() => {
    if (previousStep.current !== step) stepRef.current?.focus();
    previousStep.current = step;
  }, [step]);
  useEffect(() => {
    if (status === 'success' || status === 'error') statusRef.current?.focus();
  }, [status]);

  async function changeStep(next: number) {
    if (transitionLock.current) return;
    transitionLock.current = true;
    setChangingStep(true);
    const node = formRef.current;
    const current = node?.querySelector(step === 1 ? '.diagnostic-first' : '.inquiry-details');
    const incoming = node?.querySelector(next === 1 ? '.diagnostic-first' : '.inquiry-details');
    const commit = () => flushSync(() => { setStep(next); setStatus('idle'); setMessage(''); });
    if (node && current && incoming && !reduced) {
      try {
        const { gsap } = await loadScrollMotion();
        if (!alive.current) return;
        stepContext.current?.revert();
        let timeline: gsap.core.Timeline | undefined;
        stepContext.current = gsap.context(() => {
          timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
            .to(current, { opacity: 0, x: next > step ? -40 : 40, duration: .2 })
            .call(commit)
            .fromTo(incoming, { opacity: 0, x: next > step ? 40 : -40 }, { opacity: 1, x: 0, duration: .32, immediateRender: false });
        }, node);
        await timeline;
      } catch { if (alive.current) commit(); }
    } else commit();
    if (!alive.current) return;
    transitionLock.current = false;
    setChangingStep(false);
    refreshMotionLayout();
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current || status === 'success' || transitionLock.current) return;
    const form = event.currentTarget;
    if (diagnostic && step === 1) {
      if (form.reportValidity()) await changeStep(2);
      return;
    }
    for (const key of ['name', 'message']) {
      const field = form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement;
      field.setCustomValidity(field.value.trim().length < (key === 'message' ? 10 : 1)
        ? (key === 'message' ? siteContent.form.messages.messageTooShort : siteContent.form.messages.nameRequired) : '');
    }
    if (!form.reportValidity()) return;
    // Capture values before disabling the fieldset. Lock synchronously, before React renders.
    const data = { ...Object.fromEntries(new FormData(form)), kind, ...(diagnostic ? selection : {}) };
    const body = JSON.stringify(data);
    submitLock.current = true;
    setStatus('loading'); setMessage('');
    try {
      // Reuse the key on an unchanged retry, including an ambiguous network failure.
      if (submission.current?.body !== body) submission.current = { body, key: crypto.randomUUID() };
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': submission.current.key }, body, signal: AbortSignal.timeout(20000) });
      const result = await response.json();
      if (!response.ok || result?.ok !== true) throw new Error('Contact request failed');
      if (!alive.current) return;
      setStatus('success'); setMessage(siteContent.form.messages.success); form.reset();
      submission.current = null;
      // Keep the confirmation visible; visitors can explicitly start another inquiry by returning.
      setSelection({ project: '', audience: '', situation: '' });
    } catch {
      if (!alive.current) return;
      setStatus('error'); setMessage(siteContent.form.messages.failure);
    } finally {
      submitLock.current = false;
    }
  }

  return <form ref={formRef} onSubmit={submit} className={`contact-form ${diagnostic ? 'diagnostic-form' : 'question-form'}`} aria-label={diagnostic ? copy.diagnostic.label : copy.question.title} aria-busy={status === 'loading' || changingStep}>
    {diagnostic && <div className="diagnostic-progress"><h3 ref={stepRef} tabIndex={-1}>{copy.diagnostic.stepLabel} <motion.span key={step} className="step-number" initial={reduced ? false : { y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .3 }}>0{step} / 02</motion.span> <span>— {copy.diagnostic.steps[step - 1]}</span></h3><div className="step-progress-track" aria-hidden="true"><span /><span /><motion.i animate={{ scaleX: step / 2 }} initial={false} transition={{ duration: reduced ? 0 : .4, ease: editorialEase }} /></div></div>}
    <p className="form-help">{labels.los_campos_con_son_obligatorios}</p>
    <div className="form-step-window">
    {diagnostic && <fieldset className="diagnostic-first" hidden={step !== 1} disabled={step !== 1 || changingStep || status === 'loading'}>
      <legend className="sr-only">{copy.diagnostic.steps[0]}</legend>
      <fieldset className="project-options"><legend>{copy.diagnostic.need} <span>*</span></legend><div>{options.projectTypes.map(type => <label className="project-option" key={type}><input type="radio" name="project" value={type} checked={selection.project === type} onChange={() => setSelection({ ...selection, project: type })} required /><span>{type}<ArrowUpRight size={14} /></span></label>)}</div></fieldset>
      <label><span className="field-label">{copy.diagnostic.audience} <b>*</b></span><select name="audience" value={selection.audience} onChange={event => setSelection({ ...selection, audience: event.target.value })} required><option value="" disabled>{copy.diagnostic.selectionPlaceholder}</option>{options.audiences.map(value => <option key={value}>{value}</option>)}</select></label>
      <label><span className="field-label">{copy.diagnostic.situation} <b>*</b></span><select name="situation" aria-describedby={selection.situation.length > 30 ? 'selected-situation' : undefined} value={selection.situation} onChange={event => setSelection({ ...selection, situation: event.target.value })} required><option value="" disabled>{copy.diagnostic.selectionPlaceholder}</option>{options.situations.map(value => <option key={value}>{value}</option>)}</select></label>
      {selection.situation.length > 30 && <p className="selection-detail" id="selected-situation">{selection.situation}</p>}
    </fieldset>}
    <fieldset hidden={diagnostic && step !== 2} disabled={(diagnostic && step !== 2) || changingStep || status === 'loading' || status === 'success'} className="inquiry-details">
      <legend className="sr-only">{copy.diagnostic.steps[1]}</legend>
      <div className="form-grid"><label><span className="field-label">{labels.nombre}<b> *</b></span><input name="name" autoComplete="name" placeholder={labels.tu_nombre} required maxLength={100} onInput={event => event.currentTarget.setCustomValidity('')} /></label>
        {diagnostic && <label><span className="field-label">{labels.empresa}</span><input name="company" autoComplete="organization" placeholder={labels.nombre_de_tu_negocio} maxLength={150} /></label>}
        <label><span className="field-label">{labels.email}<b> *</b></span><input name="email" type="email" autoComplete="email" placeholder={labels.vos_tuempresa_com} required maxLength={254} /></label>
        <label><span className="field-label">{labels.whatsapp}</span><input name="phone" type="tel" autoComplete="tel" placeholder={labels.text_54_9} maxLength={40} /></label>
        {diagnostic && <label className="budget-field"><span className="field-label">{copy.diagnostic.budget}</span><select name="budget" defaultValue=""><option value="">{labels.sin_definir}</option>{options.budgets.map(budget => <option key={budget}>{budget}</option>)}</select></label>}
      </div>
      <label className="message-field"><span className="field-label">{diagnostic ? labels.mensaje : copy.question.field}<b> *</b></span><textarea name="message" placeholder={diagnostic ? labels.contanos_un_poco_sobre_tu_proyecto : copy.question.placeholder} rows={4} required minLength={10} maxLength={5000} aria-describedby={`${kind}-message-help`} onInput={event => event.currentTarget.setCustomValidity('')} /></label><p className="form-help" id={`${kind}-message-help`}>{labels.al_menos_10_caracteres}</p>
    </fieldset>
    </div>
    <div className="honeypot" aria-hidden="true"><label>{labels.no_completar}<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="form-bottom">
      {diagnostic && step === 1 ? <><span className="form-promise">{copy.diagnostic.note}</span><AnimatedButton className="primary" type="submit" disabled={changingStep}>{copy.diagnostic.next}<ArrowRight size={17} /></AnimatedButton></> : <>
        {diagnostic && <button className="form-back" type="button" disabled={status === 'loading' || changingStep} onClick={() => void changeStep(1)}><ArrowLeft size={16} />{copy.diagnostic.back}</button>}
        <AnimatedButton className={diagnostic ? 'primary' : 'button-dark'} disabled={changingStep || status === 'loading' || status === 'success'} type="submit">{status === 'loading' ? <>{labels.enviando}<LoaderCircle aria-hidden="true" className="spin" size={17} /></> : <>{diagnostic ? copy.diagnostic.submit : copy.question.submit}<ArrowUpRight aria-hidden="true" size={17} /></>}</AnimatedButton>
      </>}
    </div>
    {(!diagnostic || step === 2) && <p className="form-privacy">{diagnostic && <>{copy.diagnostic.note} </>}{labels.al_enviar_aceptas_nuestra}<Link href={siteContent.links.privacy}>{labels.politica_de_privacidad}</Link></p>}
    <motion.div initial={false} animate={{ opacity: message ? 1 : 0, y: message || reduced ? 0 : 4 }} transition={{ duration: reduced ? 0 : .25, ease: editorialEase }} ref={statusRef} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true" className={`form-status ${status}`}>{status === 'success' && <CheckCircle2 aria-hidden="true" size={18} />}{message}</motion.div>
  </form>;
}
