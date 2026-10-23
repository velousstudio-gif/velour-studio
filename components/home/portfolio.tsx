import { ArrowUpRight } from 'lucide-react';
import { homeContent } from '@/content/home-content';
import { siteContent } from '@/content/site-content';
import { isPreviewOnly } from '@/content/portfolio';
import { visibleClientWorks } from '@/lib/portfolio-preview';
import { ClientWorkVisual } from '../client-work-visual';
import { ServiceLink } from '../service-link';
import { Reveal, MotionLink as Link } from '../motion';

/** Trabajos para clientes: captura real, qué es y qué hizo Velour. Sin métricas ni resultados inventados. */
export function Portfolio() {
  const copy = homeContent.portfolio;
  const works = visibleClientWorks();
  if (works.length === 0) return null;
  return <section id="proyectos" className="vx-work section-space" aria-labelledby="work-title"><div className="container">
    <div className="vx-heading"><span className="vx-label">{copy.label}</span><h2 id="work-title">{copy.title} <em>{copy.accent}</em></h2><p>{copy.clientIntro}</p></div>
    {works.some(isPreviewOnly) && <p className="preview-badge">VISTA PREVIA LOCAL · PENDIENTES DE AUTORIZACIÓN · NO SE PUBLICAN</p>}
    <ul className="vx-work-grid">{works.map((work, index) => <li key={work.slug}><Reveal className="vx-work-card" delay={(index % 2) * .08}>
      <Link href={`/trabajos/${work.slug}`} className="vx-work-media" aria-label={`${copy.view}: ${work.name}`}><ClientWorkVisual work={work} /></Link>
      <div className="vx-work-copy">
        <span className="vx-work-meta">{work.category} · {work.sector}{isPreviewOnly(work) && <b className="preview-flag">PENDIENTE</b>}</span>
        <h3>{work.name}</h3><p>{work.summary}</p>
        <div className="vx-work-actions"><Link href={`/trabajos/${work.slug}`} className="vx-card-link">{copy.view}<ArrowUpRight size={15} aria-hidden="true" /></Link><ServiceLink service={work.service} className="vx-card-link vx-card-link-muted">QUIERO ALGO ASÍ<ArrowUpRight size={15} aria-hidden="true" /></ServiceLink></div>
      </div>
    </Reveal></li>)}</ul>
    <div className="vx-inline-cta"><p>{copy.outro}</p><Link href={siteContent.links.form} className="vx-btn vx-btn-dark">{copy.cta}<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
  </div></section>;
}
