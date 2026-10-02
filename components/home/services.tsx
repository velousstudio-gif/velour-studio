import { ArrowUpRight, Plus } from 'lucide-react';
import { homeContent as copy } from '@/content/home-content';
import { siteContent } from '@/content/site-content';
import { Reveal, ImageReveal, MotionLink as Link } from '../motion';
import { AutomationComposition, WebComposition } from './visuals';

export function Services() {
  return <section id="servicios" className="services" aria-label="Servicios de Velour Studio"><div className="container">
    {copy.services.map(service => <article className="service-section section-space" id={service.id} key={service.id}>
      <Reveal className="service-copy"><div className="eyebrow service-eyebrow"><span>{service.number}</span>{service.label}</div><h2>{service.title}</h2><p className="section-description">{service.description}</p>
        <div className="service-actions"><details className="service-details"><summary>{copy.more}<Plus size={15} aria-hidden="true" /></summary><p>{service.details}</p></details><Link className="button" href={siteContent.links.form}>{copy.quote}<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        <div className="service-includes"><h3>{copy.includes}</h3><dl>{service.capabilities.map(item => <div key={item.id} id={item.id}><dt>{item.title}</dt><dd>{item.description}</dd></div>)}</dl></div>
      </Reveal>
      <figure className="service-visual"><ImageReveal>{service.visual === 'web' ? <WebComposition /> : <AutomationComposition />}</ImageReveal><figcaption>{service.caption}</figcaption></figure>
    </article>)}
    <aside className="branding-note" id="branding"><span className="eyebrow">{copy.branding.label}</span><h3>{copy.branding.title}</h3><p>{copy.branding.description}</p><Link href={siteContent.links.form} className="text-link" aria-label="Cotizar branding"><ArrowUpRight size={25} /></Link></aside>
  </div></section>;
}
