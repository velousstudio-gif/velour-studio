'use client';

import { useRef, type ReactNode, type PointerEvent } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useMotionPreferences } from './motion';

/** Inclinación 3D que sigue al mouse (solo escritorio y sin "movimiento reducido"). */
export function Tilt3D({ children, className = '', max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const { ambient } = useMotionPreferences();
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 16 });
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!ambient) return;
    const box = event.currentTarget.getBoundingClientRect();
    ry.set(((event.clientX - box.left) / box.width - .5) * max * 2);
    rx.set(-((event.clientY - box.top) / box.height - .5) * max * 2);
  };
  const reset = () => { rx.set(0); ry.set(0); };
  return <motion.div className={`fx-tilt ${className}`} onPointerMove={move} onPointerLeave={reset} style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}>{children}</motion.div>;
}

/** Al entrar en pantalla el elemento se "levanta" en 3D (rotación X + escala) acompañando el scroll. */
export function ScrollRise3D({ children, className = '', from = 32 }: { children: ReactNode; className?: string; from?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreferences();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : from, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : .86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 60, 0]);
  return <motion.div ref={ref} className={`fx-rise ${className}`} style={{ rotateX, scale, y, transformPerspective: 1400 }}>{children}</motion.div>;
}

/** Parallax vertical suave según el scroll. */
export function Parallax({ children, className = '', distance = 80 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreferences();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [distance, -distance]);
  return <motion.div ref={ref} className={className} style={{ y }}>{children}</motion.div>;
}

/** Luz dorada que sigue al cursor dentro de una sección oscura. */
export function Spotlight({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ambient } = useMotionPreferences();
  return <div className={`fx-spot ${className}`} onPointerMove={event => {
    if (!ambient) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - box.top}px`);
  }}>{children}</div>;
}
