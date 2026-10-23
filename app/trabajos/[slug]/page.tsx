import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { MotionLink as Link } from '@/components/motion';
import { Header, Footer } from '@/components/site';
import { ClientWorkVisual } from '@/components/client-work-visual';
import { ServiceLink } from '@/components/service-link';
import { clientWorks, isPreviewOnly } from '@/content/portfolio';
import { visibleClientWorks } from '@/lib/portfolio-preview';
import { siteContent } from '@/content/site-content';

const find = (slug: string) => visibleClientWorks().find(work => work.slug === slug);

/** Solo los trabajos autorizados se generan y entran al sitemap. */
export function generateStaticParams() { return clientWorks.filter(work => work.authorized).map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const work = find((await params).slug);
  if (!work) return { title: 'Trabajo', robots: { index: false } };
  const preview = isPreviewOnly(work);
  return {
    title: work.name, description: work.summary,
    alternates: { canonical: `/trabajos/${work.slug}` },
    robots: preview ? { index: false, follow: false } : undefined,
    openGraph: { title: `${work.name} | Velour Studio`, description: work.summary, url: `/trabajos/${work.slug}`, type: 'website', locale: 'es_AR', siteName: 'Velour Studio' },
  };
}

export default async function ClientWorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const work = find((await params).slug);
  if (!work) notFound();
  const preview = isPreviewOnly(work);
  return <><Header /><main className="container detail-page work-detail" id="inicio">
    <Link className="text-link" href={siteContent.links.works}><ArrowLeft size={16} />{siteContent.copy.projectPage.volver_a_proyectos}</Link>
    {preview && <aside className="preview-panel" role="note"><strong>Vista previa local — no se publica.</strong><span>Pendiente de autorización del cliente y confirmación del alcance de Velour. Revisado el {work.checkedAt}.</span><span>{work.reviewNotes}</span></aside>}
    <h1>{work.name}</h1>
    <div className="eyebrow">{work.category.toUpperCase()} / {work.sector.toUpperCase()} / {work.location.toUpperCase()}</div>
    <ClientWorkVisual work={work} />
    <p>{work.summary}</p>
    <div className="case-study-body">
      <section><h2>Qué incluye el sitio</h2><ul className="work-features">{work.publicFeatures.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section><h2>Alcance de Velour</h2><p>{work.velourScope || 'Pendiente de confirmar por la dirección antes de publicar.'}</p></section>
    </div>
    <div className="tech-tags" aria-label={siteContent.agency.work.stack}>{work.observedTech.map(tag => <span key={tag}>{tag}</span>)}</div>
    <div className="work-actions">
      <ServiceLink service={work.service} className="button">QUIERO UN PROYECTO ASÍ<ArrowUpRight size={17} aria-hidden="true" /></ServiceLink>
      <a className="text-link" href={work.url} target="_blank" rel="noopener noreferrer">VER SITIO PUBLICADO<ArrowUpRight size={16} aria-hidden="true" /></a>
    </div>
  </main><Footer /></>;
}
