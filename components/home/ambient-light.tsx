'use client';

import { useEffect, useRef } from 'react';
import { useMotionPreferences } from '../motion';

/** The only pointer-driven effect. It sleeps as soon as its position settles. */
export function AmbientLight() {
  const ref = useRef<HTMLDivElement>(null);
  const { ambient } = useMotionPreferences();
  useEffect(() => {
    const node = ref.current;
    if (!ambient || !node) return;
    let frame = 0;
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let targetX = x, targetY = y;
    const tick = () => {
      x += (targetX - x) * .09; y += (targetY - y) * .09;
      node.style.transform = `translate3d(${x - 600}px, ${y - 600}px, 0)`;
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .5 ? requestAnimationFrame(tick) : 0;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      targetX = event.clientX; targetY = event.clientY;
      node.style.opacity = '1';
      if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const hide = () => { node.style.opacity = '0'; cancelAnimationFrame(frame); frame = 0; };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    document.addEventListener('visibilitychange', hide);
    return () => { hide(); window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', hide); document.removeEventListener('visibilitychange', hide); };
  }, [ambient]);
  return <div className="ambient-layer" aria-hidden="true"><div ref={ref} className="ambient-light" hidden={!ambient} /></div>;
}
