import { ArrowUpRight } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { homeContent } from '@/content/home-content';
import { isPreviewOnly } from '@/content/portfolio';
import { visibleClientWorks } from '@/lib/portfolio-preview';
import { ProjectVisual } from '../project-visual';
import { ClientWorkVisual } from '../client-work-visual';
import { MotionLink as Link } from '../motion';

export function Portfolio() {
  const copy = homeContent.portfolio;
  const works = visibleClientWorks();
  return <section id="proyectos" className="portfolio section-space"><div className="container"><div className="section-heading"><div><span className="eyebrow">{copy.label}</span><h2>{copy.title}<br /><em>{copy.accent}</em></h2></div><p>{works.some(work => work.authorized) ? copy.clientIntro : copy.projects.some(item => siteContent.projects.find(project => project.slug === item.slug)?.status === 'demo') ? siteContent.agency.work.demo : siteContent.agency.work.real}</p></div>

    {works.length > 0 && <div className="client-works" aria-label="Trabajos para clientes">
      <div className="portfolio-tier"><span className="eyebrow">TRABAJOS PARA CLIENTES</span>{works.some(isPreviewOnly) && <span className="preview-badge">VISTA PREVIA LOCAL · PENDIENTES DE AUTORIZACIÓN · NO SE PUBLICAN</span>}</div>
      <ul className="client-work-grid">{works.map(work => <li key={work.slug}><article className="client-work">
        <Link href={`/trabajos/${work.slug}`} className="client-work-image" aria-label={`${copy.view}: ${work.name}`}><ClientWorkVisual work={work} /><span className="case-image-cta">{copy.view}<ArrowUpRight size={16} aria-hidden="true" /></span></Link>
        <div className="client-work-copy"><div className="case-index"><span>{work.category} / {work.sector}</span>{isPreviewOnly(work) && <span className="preview-flag">PENDIENTE</span>}</div>
          <h3>{work.name}</h3><p>{work.summary}</p>
          <Link href={`/trabajos/${work.slug}`} className="text-link">{copy.view}<ArrowUpRight size={15} aria-hidden="true" /></Link></div>
      </article></li>)}</ul>
    </div>}

    <div className="portfolio-tier"><span className="eyebrow">{copy.conceptsLabel}</span></div>
    <div className="portfolio-cases">{copy.projects.map((item, index) => {
      const project = siteContent.projects.find(project => project.slug === item.slug);
      if (!project) return null;
      return <article className="portfolio-case" key={project.slug}><Link href={`/proyectos/${project.slug}`} className="case-image" aria-label={`${copy.view}: ${project.name}`}><div className="case-image-inner"><ProjectVisual project={project} /></div><span className="case-image-cta">{copy.view}<ArrowUpRight size={17} aria-hidden="true" /></span></Link><div className="case-copy"><div className="case-index"><span>0{index + 1} / {project.category}</span><span>{project.year}</span></div><span className="case-name">{project.name}</span><h3>{item.title}</h3><p>{project.description}</p><span className="case-sector">{siteContent.agency.work.sector}: {project.sector}</span><ul className="tech-tags" aria-label={siteContent.agency.work.stack}>{project.tech.map(tag => <li key={tag}>{tag}</li>)}</ul>{project.status === 'demo' && <small className="demo-note">{copy.demo}</small>}<Link href={`/proyectos/${project.slug}`} className="text-link">{copy.view}<ArrowUpRight size={16} aria-hidden="true" /></Link></div></article>;
    })}</div><div className="portfolio-outro"><p>{copy.outro}</p><Link href={siteContent.links.form} className="text-link">{copy.cta}<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
  </div></section>;
}
