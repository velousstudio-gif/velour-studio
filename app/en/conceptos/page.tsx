import type { Metadata } from 'next';
import { ConceptsPageView } from '@/components/pages/concepts-page';
import { concepts } from '@/content/concepts';

export const metadata: Metadata = {
  title: 'Design concepts',
  description: `${concepts.length} web design concepts by industry created by Velour Studio with fictional brands, to inspire your project.`,
  alternates: { canonical: '/en/conceptos', languages: { es: '/conceptos', en: '/en/conceptos' } },
  openGraph: { locale: 'en_US' },
};

export default function ConceptsPageEn() { return <ConceptsPageView locale="en" />; }
