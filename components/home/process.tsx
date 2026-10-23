import { Check } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { homeContent } from '@/content/home-content';
import { Reveal } from '../motion';

/** Cómo trabajamos: cinco pasos en una sola fila, con lo que recibís en cada uno. */
export function Process() {
  const copy = homeContent.process;
  return <section id="proceso" className="vx-process section-space" aria-labelledby="process-title"><div className="container">
    <div className="vx-heading"><span className="vx-label">{copy.label}</span><h2 id="process-title">{copy.title} <em>{copy.accent}</em></h2><p>{copy.description}</p></div>
    <ol className="vx-steps">{siteContent.process.map((step, index) => <li key={step.title}><Reveal className="vx-step" delay={index * .06}>
      <div className="vx-step-top"><span className="vx-step-number">0{index + 1}</span><span className="vx-step-timing">{step.timing}</span></div>
      <h3>{step.title}</h3><p>{step.description}</p>
      {step.deliverables.length > 0 && <ul aria-label={siteContent.agency.process.deliverables}>{step.deliverables.map(item => <li key={item}><Check size={12} aria-hidden="true" />{item}</li>)}</ul>}
      {step.approval && <span className="vx-step-approval">{siteContent.agency.process.approval}</span>}
    </Reveal></li>)}</ol>
  </div></section>;
}
