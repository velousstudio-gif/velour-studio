import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { homeContent } from '@/content/home-content';
import { siteContent } from '@/content/site-content';
import { concepts } from '@/content/concepts';
import { contact } from '@/lib/content';
import { visibleClientWorks } from '@/lib/portfolio-preview';
import { MotionLink as Link } from '../motion';
import { ConceptScreen } from '../concept-screen';
import { Spotlight } from '../fx';

/**
 * Portada oscura centrada. Detrás: un plano 3D inclinado con columnas de pantallas que se desplazan
 * (trabajos reales + conceptos), trazos de luz sobre la grilla y un foco dorado que sigue al cursor.
 */
export function Hero() {
  const copy = homeContent.hero;
  const works = visibleClientWorks().filter(work => work.screenshot);
  const pool = concepts.slice(0, 20);
  const columns = [0, 1, 2, 3, 4].map(c => {
    const items: React.ReactNode[] = [];
    for (let i = 0; i < 4; i++) {
      const k = c * 4 + i;
      const work = works[(c + i) % Math.max(works.length, 1)];
      items.push(i === 1 && work ? <div key={`w${k}`} className="ix-stage-tile ix-stage-shot"><Image src={work.screenshot!} alt="" fill sizes="320px" /></div>
        : <div key={`c${k}`} className="ix-stage-tile"><ConceptScreen concept={pool[k % pool.length]} /></div>);
    }
    return items;
  });
  return <section id="inicio" className="ix-hero" aria-labelledby="hero-title"><Spotlight className="ix-hero-spot">
    <div className="ix-stage" aria-hidden="true"><div className="ix-stage-plane">{columns.map((items, c) => <div key={c} className="ix-stage-col" data-col={c}><div className="ix-stage-track">{items}{items}</div></div>)}</div></div>
    <div className="ix-traces" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
    <div className="ix-hero-deco" aria-hidden="true"><span className="ix-deco-tl"><i />{copy.decoA}</span><span className="ix-deco-tr"><i />{copy.decoB}</span><span className="ix-deco-side">{copy.side}</span><span className="ix-deco-bl">{copy.decoC}<i /></span><span className="ix-deco-br">{copy.decoD}<i /></span></div>
    <div className="container ix-hero-inner">
      <p className="ix-kicker hero-enter" style={{ animationDelay: '.05s' }}><span aria-hidden="true" />{copy.eyebrow}</p>
      <h1 id="hero-title"><span className="hero-line"><span>{copy.title}</span></span><span className="hero-line ix-hero-line2"><span>{copy.accent}</span></span></h1>
      <p className="ix-hero-lead hero-enter" style={{ animationDelay: '.45s' }}><strong>{copy.leadStrong}</strong> {copy.lead}</p>
      <div className="ix-actions hero-enter" style={{ animationDelay: '.6s' }}>
        <Link className="ix-btn ix-btn-gold ix-btn-glow" href={siteContent.links.form}>{copy.primary}<ArrowUpRight size={17} aria-hidden="true" /></Link>
        {contact.whatsappHref ? <a className="ix-btn ix-btn-line" href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">{copy.whatsapp}<ArrowUpRight size={17} aria-hidden="true" /></a> : <Link className="ix-btn ix-btn-line" href={siteContent.links.works}>{copy.secondary}</Link>}
      </div>
      {works.length > 0 && <ul className="ix-hero-clients hero-enter" style={{ animationDelay: '.75s' }} aria-label={copy.clientsLabel}>{works.map(work => <li key={work.slug}><Link href={`/trabajos/${work.slug}`}>{work.name}</Link></li>)}</ul>}
      <a className="ix-scroll-cue" href="#servicios" aria-label="Bajar a servicios"><span /></a>
    </div>
  </Spotlight></section>;
}
