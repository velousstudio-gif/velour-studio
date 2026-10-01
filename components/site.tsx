'use client';

import { MotionLink as Link, AnimatedButton, editorialEase, useMotionPreferences } from './motion';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { animate, stagger, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { Logo } from './brand-logo';
export { Logo } from './brand-logo';
export { FooterExperience as Footer } from './sections/footer-experience';
const copy = siteContent.agency;
const home = siteContent.copy.home;

export function Header() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [down, setDown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { reduced } = useMotionPreferences();
  const { scrollY } = useScroll();
  const lastScroll = useRef(0);
  useMotionValueEvent(scrollY, 'change', current => {
    setCompact(current > 60);
    if (Math.abs(current - lastScroll.current) < 8) return;
    setDown(current > 60 && current > lastScroll.current);
    lastScroll.current = current;
  });
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  useEffect(() => {
    const modal = dialog.current;
    if (!open || !modal) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = toggle.current;
    closing.current = false;
    modal.showModal();
    document.body.style.overflow = 'hidden';
    const entrance = animate(modal, { opacity: [0, 1] }, { duration: reduced ? 0 : .3 });
    const menuLinks = animate(modal.querySelectorAll('nav a'), { opacity: [0, 1], y: [reduced ? 0 : 30, 0] }, { duration: reduced ? 0 : .4, delay: reduced ? 0 : stagger(.06), ease: editorialEase });
    const media = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (media.matches) setOpen(false); };
    media.addEventListener('change', closeOnDesktop);
    return () => {
      modal.close();
      entrance.stop(); menuLinks.stop();
      document.body.style.overflow = previousOverflow;
      media.removeEventListener('change', closeOnDesktop);
      trigger?.focus();
    };
  }, [open, reduced]);
  async function closeMenu(href?: string) {
    if (closing.current) return;
    closing.current = true;
    if (dialog.current && !reduced) await Promise.all([
      animate(dialog.current.querySelectorAll('nav a'), { opacity: 0, y: 20 }, { duration: .2, delay: stagger(.03, { from: 'last' }), ease: editorialEase }),
      animate(dialog.current, { opacity: 0 }, { duration: .3, delay: .08 }),
    ]);
    setOpen(false);
    if (href) requestAnimationFrame(() => {
      const url = new URL(href, location.href);
      const target = url.pathname === pathname && url.hash ? document.getElementById(url.hash.slice(1)) : null;
      if (target) {
        history.pushState(null, '', url.hash);
        target.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
        const hadTabindex = target.hasAttribute('tabindex');
        if (!hadTabindex) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        if (!hadTabindex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      } else router.push(href);
    });
  }
  const links = siteContent.navigation.map(([label, id]) => <Link href={siteContent.links[id as keyof typeof siteContent.links]} key={id}><span className="nav-mask"><span>{label}</span><span aria-hidden="true">{label}</span></span></Link>);
  return <header data-home-header={pathname === '/' || undefined} className={`site-header${compact && !open ? ' is-compact' : ''}${down && !open ? ' is-scrolling-down' : ''}`}><div className="container header-inner">
    <Logo intro={pathname === '/'} /><nav aria-label={copy.nav.label} className="navigation">{links}</nav>
    <div className="header-actions"><Link className="header-contact" href={siteContent.links.contact}>{copy.nav.contact}</Link><Link className="header-project" href={siteContent.links.form}>{home.hablemos}<span className="round-arrow"><ArrowUpRight size={17} aria-hidden="true" /></span></Link><button ref={toggle} className="menu-toggle" aria-controls="mobile-navigation" aria-expanded={open} aria-label={copy.nav.open} onClick={() => setOpen(true)}><Menu /></button></div>
    <dialog ref={dialog} id="mobile-navigation" data-lenis-prevent className="mobile-menu" aria-label={copy.nav.label} onCancel={event => { event.preventDefault(); void closeMenu(); }} onClose={() => setOpen(false)}>
      <div className="mobile-menu-top"><span>{copy.companyName}</span><button className="menu-close" aria-label={copy.nav.close} onClick={() => void closeMenu()}><X /></button></div>
      <nav aria-label={copy.nav.label}>{[...siteContent.navigation.map(([label,id]) => ({label, href:siteContent.links[id as keyof typeof siteContent.links]})), {label:copy.nav.contact,href:siteContent.links.contact}].map(({label,href}) => <a href={href} key={label} onClick={event => { event.preventDefault(); void closeMenu(href); }}>{label}<ArrowUpRight size={20} aria-hidden="true" /></a>)}</nav>
      <AnimatedButton className="button-dark" href={siteContent.links.form} onClick={event => { event.preventDefault(); void closeMenu(siteContent.links.form); }}>{home.hablemos}<ArrowUpRight size={18} /></AnimatedButton><span className="mobile-menu-colophon">{home.independent_by_design}</span>
    </dialog>
  </div></header>;
}
