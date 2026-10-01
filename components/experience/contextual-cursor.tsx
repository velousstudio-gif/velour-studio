'use client';

import { useState, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useMotionPreferences } from '../motion';

export function ContextualCursor({ children, label = 'VER', className = '' }: { children: ReactNode; label?: string; className?: string }) {
  const { ambient } = useMotionPreferences();
  const [inside, setInside] = useState(false);
  const [pressed, setPressed] = useState(false);
  const px = useMotionValue(0), py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 170, damping: 26 }), y = useSpring(py, { stiffness: 170, damping: 26 });
  return <div className={'contextual-area ' + className} data-cursor={label} onPointerMove={event => {
    if (!ambient || event.pointerType === 'touch') return;
    const box = event.currentTarget.getBoundingClientRect();
    px.set(event.clientX - box.left - 43); py.set(event.clientY - box.top - 43);
  }} onPointerEnter={event => { if (ambient && event.pointerType !== 'touch') { const box = event.currentTarget.getBoundingClientRect(); px.jump(event.clientX - box.left - 43); py.jump(event.clientY - box.top - 43); setInside(true); } }}
    onPointerLeave={() => { setInside(false); setPressed(false); }} onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)}>
    {children}{ambient && <motion.span className="contextual-cursor" aria-hidden="true" style={{ x, y }} initial={false} animate={{ opacity: inside ? 1 : 0, scale: inside ? pressed ? .85 : 1 : 0 }} transition={{ duration: .2 }}>{label}<ArrowUpRight size={24} /></motion.span>}
  </div>;
}
