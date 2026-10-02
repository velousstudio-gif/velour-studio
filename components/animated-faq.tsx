'use client';

import { useId, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { editorialEase, useMotionPreferences } from './motion';

/** Native disclosure stays open until its exit finishes. Rapid toggles reverse smoothly. */
export function AnimatedFAQ({ question, children, expanded, closing, onToggle, onClosed }: {
  question: string; children: ReactNode; expanded: boolean; closing: boolean; onToggle: () => void; onClosed: () => void;
}) {
  const { reduced } = useMotionPreferences();
  const id = useId();
  return <details open={expanded || closing} data-expanded={expanded} className="animated-faq">
    <summary aria-expanded={expanded} aria-controls={id} onClick={event => {
      event.preventDefault();
      onToggle();
    }}>{question}<motion.span className="faq-icon" aria-hidden="true" animate={{ rotate: expanded ? 45 : 0 }} transition={{ duration: reduced ? 0 : .35 }}><Plus size={18} /></motion.span></summary>
    <motion.div id={id} className="faq-content" inert={!expanded && closing} initial={false}
      animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
      transition={{ duration: reduced ? 0 : .3, ease: editorialEase }} onAnimationComplete={() => { if (!expanded) onClosed(); }}>{children}</motion.div>
  </details>;
}
