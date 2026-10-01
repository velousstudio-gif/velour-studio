'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useMotionPreferences } from '../motion';
import { usePointerPosition } from './use-pointer-position';

export function InteractiveBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { ambient } = useMotionPreferences();
  const pathname = usePathname();
  usePointerPosition(ref, ambient);
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-theme]');
    const observer = new IntersectionObserver(() => {
      // Sampling the visible surface avoids the footer beneath main changing the header.
      const section = document.elementFromPoint(innerWidth / 2, Math.max(90, innerHeight * .09))?.closest<HTMLElement>('[data-theme]');
      document.documentElement.dataset.surface = section?.dataset.theme || 'light';
      document.documentElement.dataset.ambient = section?.dataset.ambient || 'warm';
    }, { rootMargin: '-8% 0px -90% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
    return () => { observer.disconnect(); delete document.documentElement.dataset.surface; delete document.documentElement.dataset.ambient; };
  }, [pathname]);
  return <div ref={ref} className={'interactive-background' + (ambient ? ' pointer-active' : '')} aria-hidden="true"><div className="ambient-base" /><div className="pointer-aura" /><div className="ambient-grain" /></div>;
}
