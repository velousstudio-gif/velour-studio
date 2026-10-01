'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { loadScrollMotion } from '@/lib/motion';
import type Lenis from 'lenis';

export function ScrollEngine({ enabled, reduced = false }: { enabled: boolean; reduced?: boolean }) {
  const pathname = usePathname();
  useEffect(() => {
    let cancelled = false;
    let lenis: Lenis | undefined;
    let disposeMotion = () => {};
    const onAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download') || link.closest('dialog')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      let id: string;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      history.pushState(null, '', url.hash);
      const focusTarget = () => {
        const hadTabindex = target.hasAttribute('tabindex');
        if (!hadTabindex) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        if (!hadTabindex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      };
      if (lenis) lenis.scrollTo(target, { onComplete: focusTarget });
      else { target.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' }); focusTarget(); }
    };
    document.addEventListener('click', onAnchor, true);
    if (enabled) void Promise.all([loadScrollMotion(), import('lenis')]).then(([{ gsap, ScrollTrigger }, { default: LenisEngine }]) => {
      if (cancelled) return;
      const engine = new LenisEngine({ duration: 1.1, lerp: 0, smoothWheel: true, wheelMultiplier: .9, syncTouch: false, stopInertiaOnNavigate: true,
        prevent: node => node.matches('dialog, textarea, select, [data-lenis-prevent]') });
      lenis = engine;
      const tick = (seconds: number) => engine.raf(seconds * 1000);
      const resize = () => engine.resize();
      const unsubscribe = engine.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.addEventListener('refresh', resize);
      disposeMotion = () => {
        ScrollTrigger.removeEventListener('refresh', resize);
        unsubscribe(); gsap.ticker.remove(tick); engine.destroy(); lenis = undefined;
        gsap.ticker.lagSmoothing(500, 33);
      };
    }).catch(() => { /* Native anchor navigation remains available. */ });
    return () => { cancelled = true; document.removeEventListener('click', onAnchor, true); disposeMotion(); };
  }, [enabled, reduced, pathname]);
  return null;
}
