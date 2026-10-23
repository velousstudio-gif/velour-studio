import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { getDict, localePath, type Locale } from '@/content/i18n';
import { contact } from '@/lib/content';
import { Logo } from '@/components/brand-logo';

/** Página de confirmación: sirve también para medir conversiones de anuncios (Meta / Google). */
export function VslThanksView({ locale }: { locale: Locale }) {
  const vsl = getDict(locale).ui.vsl;
  return <main className="ix-home vsl-page vsl-thanks ix-dark" id="main"><div className="container">
    <Logo />
    <CheckCircle2 size={64} strokeWidth={1.4} className="vsl-thanks-icon" aria-hidden="true" />
    <h1>{vsl.thanks.title}</h1>
    <p>{vsl.thanks.text}</p>
    <div className="ix-actions">{contact.whatsappHref && <a className="ix-btn ix-btn-gold" href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">{vsl.thanks.whatsapp}<ArrowUpRight size={17} aria-hidden="true" /></a>}<Link className="ix-btn ix-btn-line" href={localePath(locale, '/')}>{vsl.thanks.back}</Link></div>
  </div></main>;
}
