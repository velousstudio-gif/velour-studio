import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { homeContent } from '@/content/home-content';
import { siteContent } from '@/content/site-content';
import { contact } from '@/lib/content';
import { visibleClientWorks } from '@/lib/portfolio-preview';
import { MotionLink as Link } from '../motion';

/** Portada oscura centrada: mensaje directo, dos acciones y los clientes reales debajo. */
export function Hero() {
  const copy = homeContent.hero;
  const works = visibleClientWorks().filter(work => work.screenshot);
  return <section id="inicio" className="ix-hero" aria-labelledby="hero-title">
    <div className="ix-hero-bg" aria-hidden="true">{works.slice(0, 4).map((work, i) => <div key={work.slug} className="ix-hero-tile" data-i={i}><Image src={work.screenshot!} alt="" fill sizes="50vw" priority={i < 2} /></div>)}</div>
    <div className="ix-hero-deco" aria-hidden="true"><span className="ix-deco-tl"><i />{copy.decoA}</span><span className="ix-deco-tr"><i />{copy.decoB}</span><span className="ix-deco-side">{copy.side}</span><span className="ix-deco-bl">{copy.decoC}<i /></span><span className="ix-deco-br">{copy.decoD}<i /></span></div>
    <div className="container ix-hero-inner">
      <p className="ix-kicker hero-enter" style={{ animationDelay: '.05s' }}><span aria-hidden="true" />{copy.eyebrow}</p>
      <h1 id="hero-title"><span className="hero-line"><span>{copy.title}</span></span><span className="hero-line ix-hero-line2"><span>{copy.accent}</span></span></h1>
      <p className="ix-hero-lead hero-enter" style={{ animationDelay: '.45s' }}><strong>{copy.leadStrong}</strong> {copy.lead}</p>
      <div className="ix-actions hero-enter" style={{ animationDelay: '.6s' }}>
        <Link className="ix-btn ix-btn-gold" href={siteContent.links.form}>{copy.primary}<ArrowUpRight size={17} aria-hidden="true" /></Link>
        {contact.whatsappHref ? <a className="ix-btn ix-btn-line" href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">{copy.whatsapp}<ArrowUpRight size={17} aria-hidden="true" /></a> : <Link className="ix-btn ix-btn-line" href={siteContent.links.works}>{copy.secondary}</Link>}
      </div>
      {works.length > 0 && <ul className="ix-hero-clients hero-enter" style={{ animationDelay: '.75s' }} aria-label={copy.clientsLabel}>{works.map(work => <li key={work.slug}><Link href={`/trabajos/${work.slug}`}>{work.name}</Link></li>)}</ul>}
    </div>
  </section>;
}
