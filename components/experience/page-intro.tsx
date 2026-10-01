'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import { editorialEase, useMotionPreferences } from '../motion';

export function PageIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreferences();
  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;
    try {
      if (sessionStorage.getItem('velour-intro')) return;
      sessionStorage.setItem('velour-intro', 'seen');
    } catch { return; }
    node.hidden = false;
    const line = animate(node.querySelector('i')!, { scaleX: [0, 1] }, { duration: .38, ease: editorialEase });
    const reveal = animate(node, { clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'] }, { delay: .28, duration: .5, ease: editorialEase });
    void reveal.then(() => { node.hidden = true; });
    return () => { line.stop(); reveal.stop(); node.hidden = true; };
  }, [reduced]);
  return <div className="experience-intro" ref={ref} hidden aria-hidden="true"><span>VELOUR STUDIO</span><div><i /></div></div>;
}
