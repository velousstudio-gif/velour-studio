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
import './agency.css';
import 'lenis/dist/lenis.css';
import './motion.css';
import './experience.css';
import { MotionProvider } from '@/components/motion';
import { InteractiveBackground } from '@/components/experience/interactive-background';
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
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="es" data-scroll-behavior="smooth"><body><MotionProvider><InteractiveBackground />{children}</MotionProvider><noscript><style>{`.motion-reveal,.motion-intro{opacity:1!important;transform:none!important}.image-mask{clip-path:none!important}.image-reveal-inner{transform:none!important}.text-source{opacity:1!important}.text-masks{display:none!important}.faq-content{height:auto!important;opacity:1!important;transform:none!important;clip-path:none!important}[data-hero]{opacity:1!important;transform:none!important}.service-shopify-scene{display:none!important}`}</style></noscript></body></html>}
