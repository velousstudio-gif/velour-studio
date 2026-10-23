import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { MotionLink as Link } from '@/components/motion';
import { Header, Footer } from '@/components/site';
import { ClientWorkVisual } from '@/components/client-work-visual';
import { ServiceLink } from '@/components/service-link';
import { WhatsAppFloat } from '@/components/whatsapp-float';
import { isPreviewOnly, type ClientWork } from '@/content/portfolio';
import { categoryLabel, getDict, localePath, localizeWork, type Locale } from '@/content/i18n';
import { visibleClientWorks } from '@/lib/portfolio-preview';
import { siteContent } from '@/content/site-content';

export const findWork = (slug: string, locale: Locale): ClientWork | undefined => {
  const work = visibleClientWorks().find(item => item.slug === slug);
  return work && localizeWork(locale, work);
};

export function WorkPageView({ slug, locale }: { slug: string; locale: Locale }) {
  const work = findWork(slug, locale);
  if (!work) notFound();
  const t = getDict(locale).ui.work;
  const preview = isPreviewOnly(work);
  return <><Header /><main className="container detail-page work-detail" id="inicio">
    <Link className="text-link" href={localePath(locale, siteContent.links.works)}><ArrowLeft size={16} />{t.back}</Link>
    {preview && <aside className="preview-panel" role="note"><strong>Vista previa local — no se publica.</strong><span>Pendiente de autorización del cliente y confirmación del alcance de Velour. Revisado el {work.checkedAt}.</span><span>{work.reviewNotes}</span></aside>}
    <h1>{work.name}</h1>
    <div className="eyebrow">{categoryLabel(locale, work.category).toUpperCase()} / {work.sector.toUpperCase()} / {work.location.toUpperCase()}</div>
    <ClientWorkVisual work={work} label={t.shot} />
    <p>{work.summary}</p>
    <div className="case-study-body">
      <section><h2>{t.includes}</h2><ul className="work-features">{work.publicFeatures.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section><h2>{t.scope}</h2><p>{work.velourScope || 'Pendiente de confirmar por la dirección antes de publicar.'}</p></section>
    </div>
    <div className="tech-tags" aria-label="Stack">{work.observedTech.map(tag => <span key={tag}>{tag}</span>)}</div>
    <div className="work-actions">
      <ServiceLink service={work.service} className="button">{t.want}<ArrowUpRight size={17} aria-hidden="true" /></ServiceLink>
      <a className="text-link" href={work.url} target="_blank" rel="noopener noreferrer">{t.visit}<ArrowUpRight size={16} aria-hidden="true" /></a>
    </div>
  </main><Footer locale={locale} /><WhatsAppFloat /></>;
}
