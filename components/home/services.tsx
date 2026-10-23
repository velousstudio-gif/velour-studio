import { ArrowUpRight, Bot, Fingerprint, LayoutTemplate, MonitorSmartphone, ShoppingBag, Workflow } from 'lucide-react';
import { homeContent } from '@/content/home-content';
import { siteContent } from '@/content/site-content';
import { Reveal, MotionLink as Link } from '../motion';
import { ServiceLink } from '../service-link';

const ICONS = { web: MonitorSmartphone, landing: LayoutTemplate, shop: ShoppingBag, brand: Fingerprint, automation: Bot, software: Workflow };

/** Qué hacemos: seis servicios escaneables de un vistazo, cada uno lleva al diagnóstico con el servicio elegido. */
export function Services() {
  const copy = homeContent.serviceGrid;
  return <section id="servicios" className="vx-services section-space" aria-labelledby="services-title"><div className="container">
    <div className="vx-heading vx-heading-center"><span className="vx-label">{copy.label}</span><h2 id="services-title">{copy.title} <em>{copy.accent}</em></h2><p>{copy.description}</p></div>
    <ul className="vx-service-grid">{copy.items.map((item, index) => {
      const Icon = ICONS[item.icon];
      return <li key={item.id} id={item.id}><Reveal className="vx-service-card" delay={(index % 3) * .06}>
        <span className="vx-service-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span>
        <h3>{item.title}</h3><p>{item.description}</p>
        <ul>{item.points.map(point => <li key={point}>{point}</li>)}</ul>
        <ServiceLink service={item.service} className="vx-card-link" label={`Cotizar ${item.title}`}>COTIZAR<ArrowUpRight size={15} aria-hidden="true" /></ServiceLink>
      </Reveal></li>;
    })}</ul>
    <div className="vx-center-actions"><Link className="vx-btn vx-btn-dark" href={siteContent.links.form}>{copy.primary}<ArrowUpRight size={18} aria-hidden="true" /></Link><Link className="vx-btn vx-btn-outline" href={siteContent.links.works}>{copy.secondary}<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
  </div></section>;
}
