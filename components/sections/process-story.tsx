'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { experienceContent as content, siteContent } from '@/content/site-content';
import { loadScrollMotion, motionSettings } from '@/lib/motion';
import { TextReveal, useMotionPreferences } from '../motion';

export function ProcessStory() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { reduced } = useMotionPreferences();
  useLayoutEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let media: gsap.MatchMedia | undefined;
    void loadScrollMotion().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !root.current) return;
      const node = root.current;
      media = gsap.matchMedia();
      media.add({ desktop: motionSettings.desktop, mobile: '(max-width: 1023px), (hover: none), (pointer: coarse)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
        if (context.conditions?.reduce) return;
        const track = node.querySelector('.story-steps')!;
        const steps = Array.from(node.querySelectorAll<HTMLElement>('.story-step'));
        const rail = gsap.quickSetter(node.querySelector('.story-progress i'), 'scaleY');
        let thresholds: number[] = [];
        ScrollTrigger.create({ trigger: track, start: 'top 48%', end: 'bottom 55%', onRefresh: () => { thresholds = steps.map(step => step.getBoundingClientRect().top + scrollY - innerHeight * .48); }, onUpdate: self => {
          let current = 0;
          thresholds.forEach((value, index) => { if (self.scroll() >= value) current = index; });
          setActive(current); rail(self.progress);
        } });
      }, node);
    });
    return () => { cancelled = true; media?.revert(); };
  }, [reduced]);
  return <section id="proceso" className="x-process x-section" data-theme="dark" data-ambient="neutral" ref={root}><div className="x-container process-story-layout"><div className="story-intro"><span className="x-kicker">{content.process.label}</span><TextReveal>{content.process.title}<br /><em>{content.process.accent}</em></TextReveal><p>{siteContent.agency.process.description}</p><div className="story-counter"><span>0{active + 1}</span><i />05</div><small>{siteContent.agency.process.note}</small><div className="story-big-number" aria-hidden="true"><AnimatePresence mode="wait"><motion.span key={active} initial={reduced ? false : { y: 35, opacity: 0, filter: 'blur(4px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} exit={{ y: -35, opacity: 0 }} transition={{ duration: reduced ? 0 : .35 }}>0{active + 1}</motion.span></AnimatePresence></div></div>
    <div className="story-steps"><div className="story-progress" aria-hidden="true"><i /></div>{siteContent.process.map((step, index) => <article className={'story-step' + (active === index ? ' is-active' : '')} key={step.title}><div className="story-step-top"><span>0{index + 1}</span><small>{step.timing}</small></div><h3>{content.process.names[index]}</h3><p>{step.description}</p>{step.deliverables.length > 0 && <ul>{step.deliverables.map(item => <li key={item}>{item}</li>)}</ul>}{step.approval && <span className="story-approval">{siteContent.agency.process.approval} ↗</span>}</article>)}</div>
  </div></section>;
}
