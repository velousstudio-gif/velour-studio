'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { ReactNode } from 'react';
import { useMotionPreferences } from '../motion';

export function MouseTilt({ children, className = '', strength = 3, travel = 5 }: { children: ReactNode; className?: string; strength?: number; travel?: number }) {
  const { ambient } = useMotionPreferences();
  const px = useMotionValue(0), py = useMotionValue(0), rx = useMotionValue(0), ry = useMotionValue(0);
  const config = { stiffness: 100, damping: 22, mass: .8 };
  const x = useSpring(px, config), y = useSpring(py, config), rotateX = useSpring(rx, config), rotateY = useSpring(ry, config);
  return <motion.div className={'mouse-tilt ' + className} data-aura style={ambient ? { x, y, rotateX, rotateY, transformPerspective: 1200 } : undefined}
    onPointerMove={event => {
      if (!ambient || event.pointerType === 'touch') return;
      const rect = event.currentTarget.getBoundingClientRect();
      const a = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      const b = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      rx.set(-b * strength); ry.set(a * strength); px.set(a * travel); py.set(b * travel);
    }} onPointerLeave={() => { px.set(0); py.set(0); rx.set(0); ry.set(0); }}>{children}</motion.div>;
}
