import type { Metadata } from 'next';
import Home from '@/components/home/home';

export const metadata: Metadata = {
  title: { absolute: 'Velour Studio | Web design, online stores & custom software' },
  description: 'We design websites, online stores and custom software so your business looks professional, gets more clients and sells more easily.',
  alternates: { canonical: '/en', languages: { es: '/', en: '/en' } },
  openGraph: { locale: 'en_US', url: '/en', title: 'Velour Studio | Web design, online stores & custom software', description: 'Websites and systems that grow your business.' },
};

export default function HomeEn() { return <Home locale="en" />; }
