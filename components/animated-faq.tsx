'use client';

import { useId, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { editorialEase, useMotionPreferences } from './motion';
import { refreshMotionLayout } from '@/lib/motion';

/** Native disclosure stays open until its exit finishes. Rapid toggles reverse smoothly. */
export function AnimatedFAQ({ question, children, index, expanded, closing, onToggle, onClosed }: {
  question: string; children: ReactNode; index: number; expanded: boolean; closing: boolean; onToggle: () => void; onClosed: () => void;
}) {
  const { reduced } = useMotionPreferences();
  const id = useId();
  return <motion.details open={expanded || closing} data-expanded={expanded} className="motion-reveal animated-faq"
    initial={reduced ? false : { opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }}
    transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : (index % 3) * .045, ease: editorialEase }}>
    <summary aria-expanded={expanded} aria-controls={id} onClick={event => {
      event.preventDefault();
      onToggle();
    }}>{question}<motion.span className="faq-icon" aria-hidden="true" animate={{ rotate: expanded ? 45 : 0 }} transition={{ duration: reduced ? 0 : .35 }}><Plus size={18} /></motion.span></summary>
    <motion.div id={id} className="faq-content" inert={!expanded && closing} initial={false}
      animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0, y: expanded ? 0 : -4, clipPath: expanded ? 'inset(0% 0 0 0)' : 'inset(0 0 100% 0)' }}
      transition={{ duration: reduced ? 0 : .35, ease: editorialEase }} onAnimationComplete={() => { if (!expanded) onClosed(); refreshMotionLayout(); }}>{children}</motion.div>
  </motion.details>;
}
