import type { Metadata } from 'next';
import { VslPageView } from '@/components/pages/vsl-page';

export const metadata: Metadata = {
  title: 'A website that brings in clients',
  description: 'We design websites, online stores and systems that turn visits into inquiries.',
  alternates: { canonical: '/en/vsl', languages: { es: '/vsl', en: '/en/vsl' } },
  robots: { index: false, follow: true },
};

export default function VslPageEn() { return <VslPageView locale="en" />; }
