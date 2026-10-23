'use client';

import Link from 'next/link';
import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { getDict, localePath, type Locale } from '@/content/i18n';

const LocaleContext = createContext<Locale>('es');

/** Envuelve las páginas en inglés (/en/...). Fuera de /en el idioma por defecto es español. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => { document.documentElement.lang = previous; };
  }, [locale]);
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);
export const useDict = () => getDict(useLocale());
export const useLocalePath = () => { const locale = useLocale(); return (path: string) => localePath(locale, path); };

/** Equivalente de la página actual en el otro idioma. */
export function switchPath(pathname: string, target: Locale): string {
  const base = pathname === '/en' ? '/' : pathname.startsWith('/en/') ? pathname.slice(3) : pathname;
  return localePath(target, base);
}

/** Selector ES | EN. */
export function LanguageSwitch({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname() || '/';
  return <nav className={`lang-switch ${className}`} aria-label={locale === 'en' ? 'Language' : 'Idioma'}>
    <Link href={switchPath(pathname, 'es')} hrefLang="es" aria-current={locale === 'es' ? 'true' : undefined} lang="es">ES</Link>
    <span aria-hidden="true">/</span>
    <Link href={switchPath(pathname, 'en')} hrefLang="en" aria-current={locale === 'en' ? 'true' : undefined} lang="en">EN</Link>
  </nav>;
}
