'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type ComponentProps, type ReactNode } from 'react';
import { MotionConfig, MotionConfigContext, animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform, type HTMLMotionProps } from 'framer-motion';
import { editorialEase, loadScrollMotion, motionSettings } from '@/lib/motion';
import { ScrollEngine } from './motion/scroll-engine';

export { editorialEase };
const desktopQuery = motionSettings.desktop;
const reducedQuery = '(prefers-reduced-motion: reduce)';
const subscribeMedia = (query: string) => (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};
const subscribeDesktop = subscribeMedia(desktopQuery);
const subscribeReduced = subscribeMedia(reducedQuery);
const Preferences = createContext({ reduced: false, ambient: false });
const RouteTransition = createContext<((href: string, scroll: boolean) => void) | null>(null);
export function useReducedMotion() { return useMotionPreferences().reduced; }
export function useMotionPreferences() {
  const preferences = useContext(Preferences);
  const config = useContext(MotionConfigContext);
  const reduced = preferences.reduced || config.reducedMotion === 'always';
  return { reduced, ambient: preferences.ambient && !reduced };
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(reducedQuery).matches, () => false);
  const desktop = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(desktopQuery).matches, () => false);
  const preferences = useMemo(() => ({ reduced, ambient: desktop && !reduced }), [desktop, reduced]);
  const pathname = usePathname();
  const router = useRouter();
  const overlay = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (!pending.current || !overlay.current) return;
    clearTimeout(exitTimer.current);
    const entrance = animate(overlay.current, { y: '-100%' }, { duration: reduced ? 0 : .32, ease: editorialEase });
    void entrance.then(() => { pending.current = false; });
    return () => entrance.stop();
  }, [pathname, reduced]);
  useEffect(() => () => clearTimeout(exitTimer.current), []);
  async function navigate(href: string, scroll: boolean) {
    if (pending.current) return;
    if (reduced || !overlay.current) { router.push(href, { scroll }); return; }
    pending.current = true;
    await animate(overlay.current, { y: ['100%', '0%'] }, { duration: .28, ease: editorialEase });
    router.push(href, { scroll });
    // Failed or cancelled navigations must never leave the document covered.
    exitTimer.current = setTimeout(() => {
      if (overlay.current) void animate(overlay.current, { y: '-100%' }, { duration: .25 });
      pending.current = false;
    }, 1800);
  }
  return <Preferences.Provider value={preferences}><RouteTransition.Provider value={navigate}><MotionConfig reducedMotion={reduced ? 'always' : 'never'} transition={{ ease: editorialEase }}><ScrollEngine enabled={preferences.ambient} reduced={reduced} /><ScrollProgress />{children}<div ref={overlay} className="route-curtain" aria-hidden="true" /></MotionConfig></RouteTransition.Provider></Preferences.Provider>;
}

/** Next's onNavigate preserves new-tab clicks, downloads and external links. */
export function MotionLink(props: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const navigate = useContext(RouteTransition);
  return <Link {...props} onNavigate={event => {
    let cancelled = false;
    props.onNavigate?.({ preventDefault: () => { cancelled = true; event.preventDefault(); } });
    if (cancelled || !navigate || typeof props.href !== 'string' || props.href.startsWith('#') || props.href.split(/[?#]/)[0] === pathname) return;
    event.preventDefault();
    navigate(props.href, props.scroll ?? true);
  }} />;
}

export const MotionAnchor = motion.create(MotionLink);

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const { reduced } = useMotionPreferences();
  return <motion.div aria-hidden="true" className="scroll-progress" style={{ scaleX: reduced ? 0 : scrollYProgress }} />;
}

export function Reveal({ children, className = '', delay = 0, intro = false }: { children: ReactNode; className?: string; delay?: number; intro?: boolean }) {
  const { reduced } = useMotionPreferences();
  return <motion.div className={`motion-reveal ${className}`} initial={reduced ? false : { y: 28, opacity: 0 }}
    {...(intro ? { animate: { y: 0, opacity: 1 } } : { whileInView: { y: 0, opacity: 1 }, viewport: { once: true, amount: .12 } })}
    transition={{ duration: reduced ? 0 : .7, delay: reduced ? 0 : delay, ease: editorialEase }}>{children}</motion.div>;
}

/** The original text determines wrapping and height; temporary masks never affect layout. */
export function TextReveal({ children, as: Tag = 'h2', delay = 0, intro = false }: { children: ReactNode; as?: 'h1' | 'h2'; delay?: number; intro?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { reduced } = useMotionPreferences();
  const visible = useInView(ref, { once: true, amount: .15 });
  const [lines, setLines] = useState<{ height: number; count: number } | null>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || reduced || done) return;
    let cancelled = false;
    let previousWidth = 0;
    const measure = () => {
      if (cancelled) return;
      const width = node.clientWidth;
      if (previousWidth && width !== previousWidth) { setDone(true); return; }
      previousWidth = width;
      const height = parseFloat(getComputedStyle(node).lineHeight);
      setLines({ height, count: Math.max(1, Math.round(node.clientHeight / height)) });
    };
    void document.fonts.ready.then(measure);
    const resize = new ResizeObserver(measure);
    resize.observe(node);
    return () => { cancelled = true; resize.disconnect(); };
  }, [reduced, done]);
  useEffect(() => {
    if (!intro) return;
    const finish = () => setDone(true);
    window.addEventListener('velour:hero-complete', finish);
    return () => window.removeEventListener('velour:hero-complete', finish);
  }, [intro]);
  const masking = !reduced && !done;
  return <Tag ref={ref} className="text-reveal" data-masking={masking}>
    <span className="text-source">{children}</span>
    {masking && lines && <span className="text-masks" aria-hidden="true">{Array.from({ length: lines.count }, (_, index) =>
      <span className="text-line-mask" key={index} style={{ top: index * lines.height - 3, height: lines.height + 6 }}>
        <motion.span className="text-line-motion" initial={intro ? false : { y: '105%' }} animate={!intro && visible ? { y: 0 } : undefined}
          transition={{ duration: .7, delay: delay + Math.min(index, 5) * .08, ease: editorialEase }}
          onAnimationComplete={index === lines.count - 1 ? () => setDone(true) : undefined}>
          <span className="text-line-copy" style={{ top: 3 - index * lines.height }}>{children}</span>
        </motion.span>
      </span>)}</span>}
  </Tag>;
}

export function ImageReveal({ children, className = '', intro = false }: { children: ReactNode; className?: string; intro?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreferences();
  useLayoutEffect(() => {
    if (intro || reduced || !ref.current) return;
    let cancelled = false;
    let context: gsap.Context | undefined;
    const node = ref.current;
    void loadScrollMotion().then(({ gsap }) => {
      if (cancelled) return;
      context = gsap.context(() => {
        const reveal = gsap.timeline({ defaults: { duration: motionSettings.imageDuration, ease: motionSettings.ease },
          // Keep the trigger owned by this context until unmount. Killing it during
          // a deep-link refresh can invalidate sibling ScrollTrigger measurements.
          scrollTrigger: { trigger: node, start: 'top 90%', toggleActions: 'play none none none' },
          onComplete: () => node.classList.add('is-revealed') });
        reveal.fromTo('.image-mask', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }, 0)
          .fromTo('.image-reveal-inner', { scale: 1.07 }, { scale: 1 }, 0);
      }, node);
    }).catch(() => node.classList.add('is-revealed'));
    return () => { cancelled = true; context?.revert(); };
  }, [intro, reduced]);
  return <div ref={ref} className={`image-reveal ${className}`} data-intro-image={intro || undefined}><div className="image-mask"><div className="image-reveal-inner">{children}</div></div></div>;
}

export function ParallaxArtwork({ children }: { children: ReactNode }) {
  return <div className="parallax-frame"><div className="parallax-art"><div className="project-hover">{children}</div></div></div>;
}

type ButtonProps = { children: ReactNode; className?: string; magnetic?: boolean } & (
  { href: string } & HTMLMotionProps<'a'> | { href?: never } & HTMLMotionProps<'button'>
);
export function AnimatedButton({ magnetic = false, className = '', ...props }: ButtonProps) {
  const { ambient, reduced } = useMotionPreferences();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 30 });
  const springY = useSpring(y, { stiffness: 250, damping: 30 });
  const textX = useTransform(springX, value => value / 2);
  const textY = useTransform(springY, value => value / 2);
  const common = {
    className: `button animated-button ${className}`, style: { x: ambient && magnetic ? springX : 0, y: ambient && magnetic ? springY : 0 },
    whileHover: ambient ? { scale: 1.01 } : undefined, whileTap: reduced ? undefined : { scale: .98 },
    transition: { duration: .25, ease: editorialEase },
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
      if (!ambient || !magnetic) return;
      const box = event.currentTarget.getBoundingClientRect();
      x.set(Math.max(-8, Math.min(8, (event.clientX - box.left - box.width / 2) * .065)));
      y.set(Math.max(-8, Math.min(8, (event.clientY - box.top - box.height / 2) * .2)));
    },
    onPointerLeave: () => { x.set(0); y.set(0); },
  };
  const content = magnetic ? <motion.span className="magnetic-content" style={{ x: ambient ? textX : 0, y: ambient ? textY : 0 }}>{props.children}</motion.span> : props.children;
  if (props.href !== undefined) return <MotionAnchor {...props} {...common}>{content}</MotionAnchor>;
  return <motion.button {...props} {...common}>{content}</motion.button>;
}
