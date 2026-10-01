import { notFound } from 'next/navigation';
import { MotionLink as Link, AnimatedButton } from '@/components/motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { projects } from '@/lib/content';
import { externalUrl } from '@/lib/contact-links';
import { ProjectVisual } from '@/components/project-visual';
import { Header, Footer } from '@/components/site';

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  return { title: project?.name || 'Proyecto', description: project?.description, alternates: { canonical: '/proyectos/' + slug }, openGraph: { title: (project?.name || 'Proyecto') + ' | Velour Studio', description: project?.description, url: '/proyectos/' + slug, type: 'website', locale: 'es_AR', siteName: 'Velour Studio' } };
}
export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  const copy = siteContent.agency.work;
  const evidence = project.result ? externalUrl(project.result.evidenceUrl) : '';
  return <><Header /><main className="container detail-page" id="inicio">
    <Link className="text-link" href={siteContent.links.works}><ArrowLeft size={16} />{siteContent.copy.projectPage.volver_a_proyectos}</Link>
    <h1>{project.name}</h1><div className="eyebrow">{project.category.toUpperCase()} / {project.year}{project.status === 'demo' && siteContent.copy.projectPage.concepto_de_demostracion}</div>
    <ProjectVisual project={project} eager /><p>{project.detail}</p>
    {project.status === 'demo' && <p>{siteContent.copy.projectPage.este_proyecto_es_una_muestra_conceptual_del}</p>}
    <div className="case-sector">{copy.sector} / {project.sector}</div>
    <div className="case-study-body"><section><h2>{copy.problem}</h2><p>{project.problem}</p></section><section><h2>{copy.solution}</h2><p>{project.solution}</p></section>
      {project.status === 'real' && project.result && evidence && <section><h2>{copy.result}</h2><p>{project.result.text}</p><a className="underlined-link" href={evidence} target="_blank" rel="noopener noreferrer">{copy.result}<ArrowUpRight size={16} /></a></section>}
    </div>
    <div className="tech-tags" aria-label={copy.stack}>{project.tech.map(tag => <span key={tag}>{tag}</span>)}</div>
    <AnimatedButton className="primary" href={siteContent.links.form}>{siteContent.copy.projectPage.quiero_una_solucion_asi}<ArrowUpRight size={17} /></AnimatedButton>
  </main><Footer /></>;
}
