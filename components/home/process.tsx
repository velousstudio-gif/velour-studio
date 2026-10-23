import { Check } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { homeContent } from '@/content/home-content';
import { Reveal } from '../motion';

/** Cómo trabajamos: cinco pasos con lo que recibís en cada uno. */
export function Process() {
  const copy = homeContent.process;
  return <section id="proceso" className="ix-light" aria-labelledby="process-title"><div className="container">
    <div className="ix-heading-center"><span className="ix-label">{copy.label}</span><h2 id="process-title">{copy.title} <span className="ix-gold">{copy.accent}</span></h2><p>{copy.description}</p></div>
    <ol className="ix-steps">{siteContent.process.map((step, index) => <li key={step.title}><Reveal className="ix-step" delay={index * .06}>
      <div className="ix-step-top"><span className="ix-step-number">0{index + 1}</span><span className="ix-step-timing">{step.timing}</span></div>
      <h3>{step.title}</h3><p>{step.description}</p>
      {step.deliverables.length > 0 && <ul aria-label={siteContent.agency.process.deliverables}>{step.deliverables.map(item => <li key={item}><Check size={13} aria-hidden="true" />{item}</li>)}</ul>}
      {step.approval && <span className="ix-step-approval">{siteContent.agency.process.approval}</span>}
    </Reveal></li>)}</ol>
  </div></section>;
}
