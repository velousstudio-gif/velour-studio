'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';
import { loadScrollMotion, motionSettings } from '@/lib/motion';
import { useMotionPreferences } from '../motion';

export function ExperienceScenes({ root }: { root: RefObject<HTMLElement | null> }) {
  const aligned = useRef(false);
  const { reduced } = useMotionPreferences();
  useLayoutEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let media: gsap.MatchMedia | undefined;
    let dispose = () => {};
    void Promise.all([loadScrollMotion(), document.fonts.ready]).then(([{ gsap, ScrollTrigger }]) => {
      const main = root.current;
      if (cancelled || !main) return;
      media = gsap.matchMedia();
      media.add({ desktop: motionSettings.desktop, mobile: '(max-width: 1023px)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
        if (context.conditions?.reduce) return;
        if (context.conditions?.desktop) {
          gsap.timeline({ scrollTrigger: { trigger: '.x-hero', start: 'top top', end: 'bottom 20%', scrub: .4 }, defaults: { ease: 'none' } })
            .to('.x-hero-headline', { scale: .92, opacity: .25 }, 0).to('.x-hero-showcase', { scale: 1.08, y: -25 }, 0).to('.x-hero-bottom', { opacity: 0, y: -20 }, 0);
          main.querySelectorAll<HTMLElement>('.experience-project').forEach(project => {
            gsap.timeline({ scrollTrigger: { trigger: project, start: 'top bottom', end: 'bottom top', scrub: .4 }, defaults: { ease: 'none' } })
              .fromTo(project.querySelector('.project-scroll-layer'), { scale: 1.1, y: 50 }, { scale: 1, y: -30 }, 0)
              .fromTo(project.querySelector('.experience-project-caption'), { y: 45 }, { y: -15 }, 0);
          });
          const giant = main.querySelector('.giant-type');
          if (giant) gsap.timeline({ scrollTrigger: { trigger: giant, start: 'top bottom', end: 'bottom top', scrub: true }, defaults: { ease: 'none' } })
            .fromTo('.giant-line-0,.giant-line-2', { xPercent: -12 }, { xPercent: 5 }, 0).fromTo('.giant-line-1', { xPercent: 4 }, { xPercent: -18 }, 0);
          const cta = main.querySelector('.x-cta');
          if (cta) gsap.timeline({ scrollTrigger: { trigger: cta, start: 'top 75%', end: 'bottom 50%', scrub: .4 }, defaults: { ease: 'none' } })
            .fromTo('.cta-question', { y: 30 }, { y: -20 }, 0).fromTo('.cta-answer', { y: 90, scale: .94 }, { y: 0, scale: 1 }, 0).to('.cta-shape-scroll', { rotation: 20, scale: 1.15 }, 0);
          const footerMark = document.querySelector('.footer-giant-wordmark');
          if (footerMark) gsap.fromTo(footerMark, { y: 55 }, { y: 0, ease: 'none', scrollTrigger: { trigger: '.x-diagnostic', start: 'bottom bottom', end: 'bottom 35%', scrub: .4 } });
        }
      }, main);
      let timer: ReturnType<typeof setTimeout>;
      const refresh = () => { clearTimeout(timer); timer = setTimeout(() => {
        ScrollTrigger.refresh();
        if (!aligned.current) {
          aligned.current = true;
          try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant', block: 'start' }); } catch { /* Invalid hash has no destination. */ }
        }
      }, 150); };
      window.addEventListener('velour:layout', refresh);
      refresh();
      dispose = () => { clearTimeout(timer); window.removeEventListener('velour:layout', refresh); };
    });
    return () => { cancelled = true; dispose(); media?.revert(); };
  }, [root, reduced]);
  return null;
}
