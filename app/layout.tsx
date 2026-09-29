import type { Metadata } from 'next';
import { businessConfig } from '@/content/site-content';
import { configuredValue } from '@/lib/contact-links';
import { isPublicSite, siteTitle, siteDescription, siteUrl } from '@/lib/site-config';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: '%s | Velour Studio' },
  description: siteDescription,
  publisher: configuredValue(businessConfig.legalBusinessName) || undefined,
  openGraph: { url: siteUrl, title: siteTitle, description: siteDescription, locale: 'es_AR', type: 'website', siteName: 'Velour Studio' },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: { url: '/brand/favicon.png', type: 'image/png', sizes: '1254x1254' },
    shortcut: '/brand/favicon.png',
  },
  robots: { index: isPublicSite, follow: true },
};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="es" data-scroll-behavior="smooth"><body>{children}</body></html>}
