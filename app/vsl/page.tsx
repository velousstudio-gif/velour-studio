import type { Metadata } from 'next';
import { VslPageView } from '@/components/pages/vsl-page';
import { vsl } from '@/content/vsl';

export const metadata: Metadata = {
  title: 'Tu web que trae clientes',
  description: vsl.subtitle,
  alternates: { canonical: '/vsl', languages: { es: '/vsl', en: '/en/vsl' } },
  robots: { index: false, follow: true },
};

export default function VslPage() { return <VslPageView locale="es" />; }
