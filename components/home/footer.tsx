import { ArrowUpRight } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { homeContent, localeConfig } from '@/content/home-content';
import { contact } from '@/lib/content';
import { Logo } from '../brand-logo';
import { MotionLink as Link } from '../motion';

export function Footer() {
  const copy = homeContent.footer;
  return <footer className="site-footer"><div className="container"><div className="footer-grid"><div className="footer-brand" id="nosotros"><Logo /><p>{copy.description}</p></div><div><h2>{copy.servicesLabel}</h2><nav aria-label="Servicios del estudio">{copy.services.map(([label, key]) => <Link key={label} href={siteContent.links[key as keyof typeof siteContent.links]}>{label}</Link>)}</nav></div><div><h2>{copy.companyLabel}</h2><nav aria-label="Empresa">{copy.company.map(([label, key]) => <Link key={label} href={siteContent.links[key as keyof typeof siteContent.links]}>{label}</Link>)}</nav></div><div className="footer-contact"><h2>{copy.contactLabel}</h2><nav aria-label="Contacto y redes">{contact.whatsappHref && <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp<ArrowUpRight size={14} /></a>}{contact.emailHref && <a href={contact.emailHref}>{contact.email}<ArrowUpRight size={14} /></a>}{contact.instagram && <a href={contact.instagram} target="_blank" rel="noopener noreferrer">Instagram<ArrowUpRight size={14} /></a>}{contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn<ArrowUpRight size={14} /></a>}<Link href={siteContent.links.form}>{copy.quote}<ArrowUpRight size={14} /></Link></nav>{contact.address && <p>{contact.address}</p>}</div></div><div className="footer-bottom"><span>{copy.copyright}</span><div><Link href={siteContent.links.terms}>Términos</Link><Link href={siteContent.links.privacy}>Privacidad</Link></div><div className="language-options" aria-label="Idioma"><span lang="es" aria-current={localeConfig.current === 'es'}>ES</span><span aria-hidden="true">/</span><button type="button" disabled title={copy.languagePending}>EN</button></div></div></div></footer>;
}
