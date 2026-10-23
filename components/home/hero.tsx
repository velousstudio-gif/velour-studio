import { ArrowUpRight, Check } from 'lucide-react';
import { homeContent as copy } from '@/content/home-content';
import { siteContent } from '@/content/site-content';
import { visibleClientWorks } from '@/lib/portfolio-preview';
import { MotionLink as Link } from '../motion';
import { HeroShowcase } from './hero-showcase';

/** Portada: fondo oscuro, mensaje directo, dos acciones y trabajos reales a la vista. */
export function Hero() {
  const works = visibleClientWorks().filter(work => work.screenshot);
  return <section id="inicio" className="vx-hero" aria-labelledby="hero-title">
    <div className="vx-hero-glow" aria-hidden="true" />
    <div className="container vx-hero-inner">
      <div className="vx-hero-copy">
        <p className="vx-kicker hero-enter" style={{ animationDelay: '.05s' }}><span aria-hidden="true" />{copy.hero.eyebrow}</p>
        <h1 id="hero-title"><span className="hero-line"><span>{copy.hero.title}</span></span> <em className="hero-line"><span>{copy.hero.accent}</span></em></h1>
        <p className="vx-hero-lead hero-enter" style={{ animationDelay: '.45s' }}>{copy.hero.description}</p>
        <div className="vx-hero-actions hero-enter" style={{ animationDelay: '.6s' }}>
          <Link className="vx-btn vx-btn-gold" href={siteContent.links.form}>{copy.hero.primary}<ArrowUpRight size={18} aria-hidden="true" /></Link>
          <Link className="vx-btn vx-btn-ghost" href={siteContent.links.works}>{copy.hero.secondary}<ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
        <ul className="vx-hero-trust hero-enter" style={{ animationDelay: '.75s' }} aria-label="Nuestra forma de trabajar">{copy.trust.map(item => <li key={item}><Check size={14} aria-hidden="true" />{item}</li>)}</ul>
      </div>
      {works.length > 0 && <HeroShowcase works={works.map(({ slug, name, sector, url, screenshot }) => ({ slug, name, sector, url, screenshot: screenshot! }))} />}
    </div>
    {works.length > 0 && <div className="container vx-clients"><span>{copy.hero.clientsLabel}</span><ul>{works.map(work => <li key={work.slug}><Link href={`/trabajos/${work.slug}`}>{work.name}</Link></li>)}</ul></div>}
  </section>;
}
