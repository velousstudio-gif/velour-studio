import { ArrowUpRight } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { getDict, localePath, type Locale } from '@/content/i18n';
import { contact } from '@/lib/content';
import { Logo } from '../brand-logo';
import { MotionLink as Link } from '../motion';
import { LanguageSwitch } from '../locale';

export function Footer({ locale = 'es' }: { locale?: Locale }) {
  const copy = getDict(locale).home.footer;
  const href = (key: string) => localePath(locale, siteContent.links[key as keyof typeof siteContent.links]);
  const en = locale === 'en';
  return <footer className="site-footer"><div className="container"><div className="footer-grid">
    <div className="footer-brand" id="nosotros"><Logo /><p>{copy.description}</p></div>
    <div><h2>{copy.servicesLabel}</h2><nav aria-label={en ? 'Studio services' : 'Servicios del estudio'}>{copy.services.map(([label, key]) => <Link key={label} href={href(key)}>{label}</Link>)}</nav></div>
    <div><h2>{copy.companyLabel}</h2><nav aria-label={en ? 'Company' : 'Empresa'}>{copy.company.map(([label, key]) => <Link key={label} href={href(key)}>{label}</Link>)}<Link href={localePath(locale, '/conceptos')}>{en ? 'Design concepts' : 'Conceptos'}</Link></nav></div>
    <div className="footer-contact"><h2>{copy.contactLabel}</h2><nav aria-label={en ? 'Contact' : 'Contacto'}>{contact.whatsappHref && <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp<ArrowUpRight size={14} /></a>}{contact.emailHref && <a href={contact.emailHref}>{contact.email}<ArrowUpRight size={14} /></a>}{contact.instagram && <a href={contact.instagram} target="_blank" rel="noopener noreferrer">Instagram<ArrowUpRight size={14} /></a>}{contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn<ArrowUpRight size={14} /></a>}<Link href={href('form')}>{copy.quote}<ArrowUpRight size={14} /></Link></nav>{contact.address && <p>{contact.address}</p>}</div>
  </div><div className="footer-bottom"><span>{copy.copyright}</span><div><Link href={siteContent.links.terms}>{en ? 'Terms' : 'Términos'}</Link><Link href={siteContent.links.privacy}>{en ? 'Privacy' : 'Privacidad'}</Link></div><LanguageSwitch className="language-options" /></div></div></footer>;
}
