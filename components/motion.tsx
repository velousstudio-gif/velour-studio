'use client';

import Link from 'next/link';
import { createContext, useContext, useMemo, useSyncExternalStore, type ComponentProps, type ReactNode } from 'react';
import { MotionConfig, motion, type HTMLMotionProps } from 'framer-motion';

export const editorialEase = [.22, 1, .36, 1] as const;
const reducedQuery = '(prefers-reduced-motion: reduce)';
const desktopQuery = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
const subscribe = (query: string) => (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};
const subscribeReduced = subscribe(reducedQuery);
const subscribeDesktop = subscribe(desktopQuery);
const Preferences = createContext({ reduced: false, ambient: false });
export const useMotionPreferences = () => useContext(Preferences);

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(reducedQuery).matches, () => false);
  const desktop = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(desktopQuery).matches, () => false);
  const preferences = useMemo(() => ({ reduced, ambient: desktop && !reduced }), [reduced, desktop]);
  return <Preferences.Provider value={preferences}><MotionConfig reducedMotion={reduced ? 'always' : 'never'} transition={{ ease: editorialEase }}>{children}</MotionConfig></Preferences.Provider>;
}

export function MotionLink(props: ComponentProps<typeof Link>) {
  const { reduced } = useMotionPreferences();
  return <Link {...props} onNavigate={event => {
    props.onNavigate?.(event);
    if (typeof props.href !== 'string') return;
    const url = new URL(props.href, window.location.href);
    if (url.pathname !== window.location.pathname || !url.hash) return;
    const target = document.getElementById(url.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    if (url.href !== window.location.href) window.history.pushState(null, '', url.href);
    target.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
  }} />;
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { reduced } = useMotionPreferences();
  return <motion.div data-reveal className={`motion-reveal ${className}`} initial={reduced ? false : { opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: reduced ? 0 : .55, delay: reduced ? 0 : delay, ease: editorialEase }}>{children}</motion.div>;
}

export function ImageReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { reduced } = useMotionPreferences();
  return <motion.div data-image-reveal className={`image-reveal ${className}`} initial={reduced ? false : { clipPath: 'inset(10% 0 0 0)', opacity: 0, scale: 1.04 }} whileInView={{ clipPath: 'inset(0% 0 0 0)', opacity: 1, scale: 1 }} viewport={{ once: true, amount: .15 }} transition={{ duration: reduced ? 0 : .7, ease: editorialEase }}>{children}</motion.div>;
}

type ButtonProps = { children: ReactNode; className?: string } & ({ href: string } & HTMLMotionProps<'a'> | { href?: never } & HTMLMotionProps<'button'>);
const MotionAnchor = motion.create(MotionLink);
export function AnimatedButton({ className = '', ...props }: ButtonProps) {
  if (props.href !== undefined) return <MotionAnchor {...props} className={`button ${className}`} />;
  return <motion.button {...props} className={`button ${className}`} />;
}
