import type { Metadata } from 'next';
import { ConceptsPageView } from '@/components/pages/concepts-page';
import { concepts } from '@/content/concepts';

export const metadata: Metadata = {
  title: 'Conceptos de diseño',
  description: `${concepts.length} conceptos de diseño web por rubro creados por Velour Studio con marcas ficticias, para inspirar tu proyecto.`,
  alternates: { canonical: '/conceptos', languages: { es: '/conceptos', en: '/en/conceptos' } },
};

export default function ConceptsPage() { return <ConceptsPageView locale="es" />; }
