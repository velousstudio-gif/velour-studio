import { ArrowUpRight } from 'lucide-react';
import { homeContent } from '@/content/home-content';
import { siteContent } from '@/content/site-content';
import { Reveal, MotionLink as Link } from '../motion';
import { ServiceLink } from '../service-link';

/** Lista numerada de servicios sobre fondo oscuro; cada fila lleva al diagnóstico con el servicio elegido. */
export function Services() {
  const copy = homeContent.serviceList;
  return <section className="ix-dark ix-services" aria-labelledby="services-title"><div className="container ix-services-grid">
    <Reveal className="ix-services-intro">
      <span className="ix-label">{copy.label}</span>
      <h2 id="services-title">{copy.title} <span className="ix-gold">{copy.accent}</span></h2>
      <p>{copy.description}</p>
      <Link className="ix-text-link" href={siteContent.links.works}>{copy.link}<ArrowUpRight size={15} aria-hidden="true" /></Link>
    </Reveal>
    <ol className="ix-service-list">{copy.items.map((item, index) => <li key={item.title} id={item.id}>
      <ServiceLink service={item.service} className="ix-service-row" label={`Cotizar ${item.title}`}>
        <span className="ix-service-num">0{index + 1}</span>
        <span className="ix-service-text"><strong>{item.title}</strong><small>{item.text}</small></span>
        <span className="ix-service-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
      </ServiceLink>
    </li>)}</ol>
  </div></section>;
}
