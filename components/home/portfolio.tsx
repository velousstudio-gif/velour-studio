import { ArrowUpRight } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { homeContent } from '@/content/home-content';
import { ProjectVisual } from '../project-visual';
import { MotionLink as Link } from '../motion';

export function Portfolio() {
  const copy = homeContent.portfolio;
  return <section id="proyectos" className="portfolio section-space"><div className="container"><div className="section-heading"><div><span className="eyebrow">{copy.label}</span><h2>{copy.title}<br /><em>{copy.accent}</em></h2></div><p>{copy.projects.some(item => siteContent.projects.find(project => project.slug === item.slug)?.status === 'demo') ? siteContent.agency.work.demo : siteContent.agency.work.real}</p></div>
    <div className="portfolio-cases">{copy.projects.map((item, index) => {
      const project = siteContent.projects.find(project => project.slug === item.slug);
      if (!project) return null;
      return <article className="portfolio-case" key={project.slug}><Link href={`/proyectos/${project.slug}`} className="case-image" aria-label={`${copy.view}: ${project.name}`}><div className="case-image-inner"><ProjectVisual project={project} /></div><span className="case-image-cta">{copy.view}<ArrowUpRight size={17} aria-hidden="true" /></span></Link><div className="case-copy"><div className="case-index"><span>0{index + 1} / {project.category}</span><span>{project.year}</span></div><span className="case-name">{project.name}</span><h3>{item.title}</h3><p>{project.description}</p><span className="case-sector">{siteContent.agency.work.sector}: {project.sector}</span><ul className="tech-tags" aria-label={siteContent.agency.work.stack}>{project.tech.map(tag => <li key={tag}>{tag}</li>)}</ul>{project.status === 'demo' && <small className="demo-note">{copy.demo}</small>}<Link href={`/proyectos/${project.slug}`} className="text-link">{copy.view}<ArrowUpRight size={16} aria-hidden="true" /></Link></div></article>;
    })}</div><div className="portfolio-outro"><p>{copy.outro}</p><Link href={siteContent.links.form} className="text-link">{copy.cta}<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
  </div></section>;
}
