'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { homeContent } from '@/content/home-content';
import { contact } from '@/lib/content';
import { MotionLink as Link } from './motion';
import { Logo } from './brand-logo';
import { ThemeSelector } from './theme-selector';
export { Logo } from './brand-logo';
export { Footer } from './home/footer';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    const modal = dialog.current;
    if (!open || !modal) return;
    const overflow = document.body.style.overflow;
    const trigger = toggle.current;
    modal.showModal(); document.body.style.overflow = 'hidden';
    const media = window.matchMedia('(min-width: 1101px)');
    const closeOnDesktop = () => { if (media.matches) setOpen(false); };
    media.addEventListener('change', closeOnDesktop);
    return () => { modal.close(); document.body.style.overflow = overflow; media.removeEventListener('change', closeOnDesktop); trigger?.focus(); };
  }, [open]);
  const links = siteContent.navigation.map(([label, key]) => ({ label, href: siteContent.links[key as keyof typeof siteContent.links] }));
  return <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}><div className="container header-inner">
    <Logo /><nav className="navigation" aria-label={siteContent.agency.nav.label}>{links.map(link => <Link key={link.label} href={link.href}>{link.label}</Link>)}</nav>
    <div className="header-actions">{contact.whatsappHref && <a className="header-direct" href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>}<Link className="header-direct" href={siteContent.links.contact}>Contacto</Link><ThemeSelector placement="header" /><Link className="button header-quote" href={siteContent.links.form}><span>{homeContent.quote}</span><ArrowUpRight size={16} aria-hidden="true" /></Link><button ref={toggle} className="menu-toggle" aria-label={siteContent.agency.nav.open} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><Menu size={24} /></button></div>
    <dialog ref={dialog} id="mobile-navigation" className="mobile-menu" aria-label={siteContent.agency.nav.label} onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
      <div className="mobile-menu-top"><Logo /><button className="menu-close" aria-label={siteContent.agency.nav.close} onClick={() => setOpen(false)}><X /></button></div>
      <nav aria-label="Navegación móvil">{[...links, { label: 'Contacto', href: siteContent.links.contact }].map(link => <Link key={link.label} href={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={22} aria-hidden="true" /></Link>)}</nav>
      <div className="mobile-theme-row"><span className="eyebrow">Apariencia</span><ThemeSelector placement="menu" /></div>
      <Link className="button" href={siteContent.links.form} onClick={() => setOpen(false)}>{homeContent.quote}<ArrowUpRight size={18} aria-hidden="true" /></Link>
      <div className="mobile-direct">{contact.emailHref && <a href={contact.emailHref}>{contact.email}</a>}{contact.whatsappHref && <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp · {contact.whatsappDisplay}</a>}</div>
    </dialog>
  </div></header>;
}
