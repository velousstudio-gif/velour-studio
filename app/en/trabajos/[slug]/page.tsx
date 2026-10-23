import type { Metadata } from 'next';
import { clientWorks } from '@/content/portfolio';
import { WorkPageView, findWork } from '@/components/pages/work-page';

export function generateStaticParams() { return clientWorks.filter(work => work.authorized).map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const work = findWork(slug, 'en');
  if (!work) return { title: 'Project', robots: { index: false } };
  return {
    title: work.name, description: work.summary,
    alternates: { canonical: `/en/trabajos/${slug}`, languages: { es: `/trabajos/${slug}`, en: `/en/trabajos/${slug}` } },
    openGraph: { title: `${work.name} | Velour Studio`, description: work.summary, url: `/en/trabajos/${slug}`, type: 'website', locale: 'en_US', siteName: 'Velour Studio' },
  };
}

export default async function ClientWorkPageEn({ params }: { params: Promise<{ slug: string }> }) {
  return <WorkPageView slug={(await params).slug} locale="en" />;
}
