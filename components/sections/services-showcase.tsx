'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import { experienceContent as content, siteContent } from '@/content/site-content';
import { loadScrollMotion, refreshMotionLayout } from '@/lib/motion';
import { AnimatedButton, TextReveal, useMotionPreferences } from '../motion';
import { ProjectMockup } from '../mockup';
import { ContextualCursor } from '../experience/contextual-cursor';

export function ServiceVisual({ kind }: { kind: string }) {
  if (kind === 'automation' || kind === 'development') return <div className={'service-system-art ' + kind} aria-hidden="true"><span>VELOUR / DIGITAL SYSTEMS</span><div className="system-orbit orbit-a" /><div className="system-orbit orbit-b" /><div className="system-node node-a">{kind === 'automation' ? 'INPUT' : 'IDEA'}</div><div className="system-node node-b">{kind === 'automation' ? 'FLOW' : 'BUILD'}</div><div className="system-node node-c">{kind === 'automation' ? 'CONNECT' : 'CREATE'}</div><strong>{kind === 'automation' ? 'Todo\nconectado.' : 'Hecho\na medida.'}</strong><small>DISEÑO + TECNOLOGÍA</small></div>;
  return <ProjectMockup kind={kind} />;
}

export function ServicesShowcase() {
  const { ambient, reduced } = useMotionPreferences();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const explored = useRef(false);
  const px = useMotionValue(0), py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 90, damping: 25 }), y = useSpring(py, { stiffness: 90, damping: 25 });
  const current = hovered ?? active;
  const data = content.services;
  useLayoutEffect(() => {
    if (!ambient || expanded !== null || explored.current) return;
    let cancelled = false;
    let media: gsap.MatchMedia | undefined;
    let pinned: { isActive: boolean } | undefined;
    let element: HTMLElement | null = null;
    void loadScrollMotion().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !root.current) return;
      const node = root.current;
      element = node;
      media = gsap.matchMedia();
      media.add({ desktop: '(min-width: 1280px) and (min-height: 850px)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
        if (!context.conditions?.desktop || context.conditions.reduce) return;
        const stage = node.querySelector<HTMLElement>('.services-stage')!;
        if (stage.offsetHeight > innerHeight - 100) return;
        pinned = ScrollTrigger.create({ trigger: stage, pin: stage, pinSpacer: stage.parentElement!, start: 'top 92px', end: () => '+=' + innerHeight * 2.2, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: self => setActive(Math.min(4, Math.floor(self.progress * 5))) });
      }, node);
      refreshMotionLayout();
    });
    return () => {
      cancelled = true;
      const stage = element?.isConnected ? element.querySelector<HTMLElement>('.services-stage') : null;
      const before = pinned?.isActive && stage ? stage.getBoundingClientRect().top : null;
      media?.revert();
      // Keep the rows in place when expansion releases a currently active pin.
      if (before !== null && stage) window.scrollBy({ top: stage.getBoundingClientRect().top - before, behavior: 'instant' });
      refreshMotionLayout();
    };
  }, [ambient, expanded]);
  return <section className="x-services x-section" id="servicios" data-theme="light" data-ambient="warm" ref={root}><div className="x-container"><div className="services-pin-shell"><div className="services-stage">
    <div className="x-section-heading"><span className="x-kicker">{data.label}</span><div><TextReveal>{data.title} <em>{data.accent}</em></TextReveal><p>{data.description}</p></div><span className="x-count">01—05</span></div>
    <div className="services-layout"><div className="service-lines" onPointerLeave={() => setHovered(null)} onPointerMove={event => {
      if (!ambient) return;
      px.set(Math.min(innerWidth - 365, event.clientX + 75)); py.set(Math.max(90, Math.min(innerHeight - 260, event.clientY - 120)));
    }}>{data.items.map((item, index) => <div key={item.id} id={item.id} className={'x-service-row' + (current === index ? ' is-current' : '')} onPointerEnter={() => { if (ambient) setHovered(index); }}>
      <button className="service-trigger" aria-expanded={expanded === index} aria-controls={'service-detail-' + item.id} onFocus={() => setActive(index)} onClick={() => { explored.current = true; setExpanded(expanded === index ? null : index); setHovered(null); setActive(index); }}><span className="service-index">0{index + 1}</span><span className="service-name">{item.name}</span><Plus size={23} className={expanded === index ? 'is-open' : ''} /></button>
      <motion.div id={'service-detail-' + item.id} className="service-detail" inert={expanded !== index} initial={false} animate={{ height: expanded === index ? 'auto' : 0, opacity: expanded === index ? 1 : 0 }} transition={{ duration: reduced ? 0 : .4 }} onAnimationComplete={refreshMotionLayout}><div><p>{item.description}</p><p>{item.details}</p><ul>{item.deliverables.map(line => <li key={line}>{line}</li>)}</ul><div className="service-technologies">{item.technologies.map(tech => <span key={tech}>{tech}</span>)}</div><AnimatedButton href={siteContent.links.form} className="button-dark">{data.cta}<ArrowUpRight size={16} /></AnimatedButton></div></motion.div>
    </div>)}</div><div className="services-preview" aria-hidden="true"><ContextualCursor label="EXPLORAR"><div className="service-visuals">{data.items.map((item, index) => <motion.div className="service-visual" key={item.id} initial={false} animate={{ opacity: current === index ? 1 : 0, y: current === index ? 0 : 25, scale: current === index ? 1 : .96 }} transition={{ duration: reduced ? 0 : .6 }}><ServiceVisual kind={item.kind} /></motion.div>)}</div></ContextualCursor><div className="service-preview-caption"><span>0{current + 1} / {data.visual}</span><p>{data.items[current].subtitle}</p></div></div></div>
    {ambient && createPortal(<motion.div className="service-hover-image" aria-hidden="true" style={{ x, y }} initial={false} animate={{ opacity: hovered !== null && expanded === null ? 1 : 0, scale: hovered !== null ? 1 : .9, rotate: hovered !== null ? -4 : 0 }} transition={{ duration: .3 }}><ServiceVisual kind={data.items[current].kind} /></motion.div>, document.body)}
  </div></div></div></section>;
}
