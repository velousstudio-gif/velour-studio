import type { Metadata } from 'next';
import { clientWorks, isPreviewOnly } from '@/content/portfolio';
import { WorkPageView, findWork } from '@/components/pages/work-page';

/** Solo los trabajos autorizados se generan y entran al sitemap. */
export function generateStaticParams() { return clientWorks.filter(work => work.authorized).map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const work = findWork(slug, 'es');
  if (!work) return { title: 'Trabajo', robots: { index: false } };
  return {
    title: work.name, description: work.summary,
    alternates: { canonical: `/trabajos/${slug}`, languages: { es: `/trabajos/${slug}`, en: `/en/trabajos/${slug}` } },
    robots: isPreviewOnly(work) ? { index: false, follow: false } : undefined,
    openGraph: { title: `${work.name} | Velour Studio`, description: work.summary, url: `/trabajos/${slug}`, type: 'website', locale: 'es_AR', siteName: 'Velour Studio' },
  };
}

export default async function ClientWorkPage({ params }: { params: Promise<{ slug: string }> }) {
  return <WorkPageView slug={(await params).slug} locale="es" />;
}
