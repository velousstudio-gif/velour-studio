'use client';

import { useEffect, type RefObject } from 'react';

/** One pointer listener and an on-demand RAF. No React updates per pixel. */
export function usePointerPosition(ref: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;
    let frame = 0;
    let x = innerWidth / 2, y = innerHeight / 2;
    let targetX = x, targetY = y;
    const render = () => {
      x += (targetX - x) * .08; y += (targetY - y) * .08;
      document.documentElement.style.setProperty('--mouse-x', x + 'px');
      document.documentElement.style.setProperty('--mouse-y', y + 'px');
      node.style.setProperty('--pointer-x', String(x / innerWidth - .5));
      node.style.setProperty('--pointer-y', String(y / innerHeight - .5));
      document.documentElement.style.setProperty('--pointer-x', String(x / innerWidth - .5));
      document.documentElement.style.setProperty('--pointer-y', String(y / innerHeight - .5));
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .15 ? requestAnimationFrame(render) : 0;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      targetX = event.clientX; targetY = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);
    };
    const over = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-cursor], [data-aura]') : null;
      node.dataset.intense = target ? 'true' : 'false';
      const tone = target?.closest<HTMLElement>('[data-project-tone]')?.dataset.projectTone;
      document.documentElement.dataset.projectTone = tone || '';
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.style.removeProperty('--mouse-x');
      document.documentElement.style.removeProperty('--mouse-y');
      document.documentElement.style.removeProperty('--pointer-x');
      document.documentElement.style.removeProperty('--pointer-y');
      delete document.documentElement.dataset.projectTone;
    };
  }, [enabled, ref]);
}
