import { LocaleProvider } from '@/components/locale';

/** Todas las páginas bajo /en usan textos en inglés. */
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <LocaleProvider locale="en">{children}</LocaleProvider>;
}
