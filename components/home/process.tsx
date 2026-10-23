import { Check } from 'lucide-react';
import { getDict, type Locale } from '@/content/i18n';
import { Reveal } from '../motion';

/** Cómo trabajamos: cinco pasos con lo que recibís en cada uno. */
export function Process({ locale = 'es' }: { locale?: Locale }) {
  const { home, ui } = getDict(locale);
  const copy = home.process;
  return <section id="proceso" className="ix-light" aria-labelledby="process-title"><div className="container">
    <Reveal className="ix-heading-center"><span className="ix-label">{copy.label}</span><h2 id="process-title">{copy.title} <span className="ix-gold">{copy.accent}</span></h2><p>{copy.description}</p></Reveal>
    <ol className="ix-steps">{ui.process.map((step, index) => <li key={step.title}><Reveal className="ix-step" delay={index * .06}>
      <div className="ix-step-top"><span className="ix-step-number">0{index + 1}</span><span className="ix-step-timing">{step.timing}</span></div>
      <h3>{step.title}</h3><p>{step.description}</p>
      {step.deliverables.length > 0 && <ul aria-label={ui.agency.process.deliverables}>{step.deliverables.map(item => <li key={item}><Check size={13} aria-hidden="true" />{item}</li>)}</ul>}
      {step.approval && <span className="ix-step-approval">{ui.agency.process.approval}</span>}
    </Reveal></li>)}</ol>
  </div></section>;
}
