'use client';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { experienceContent as content, siteContent } from '@/content/site-content';
import { loadScrollMotion } from '@/lib/motion';
import { useMotionPreferences } from '../motion';

export function TechnologyMarquee() {
  const ref = useRef<HTMLElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const [paused, setPaused] = useState(false);
  const { reduced } = useMotionPreferences();
  useEffect(() => {
    if (reduced || !ref.current) return;
    const node = ref.current;
    let cancelled = false;
    let context: gsap.Context | undefined;
    const sync = () => tween.current?.paused(node.dataset.visible !== 'true' || node.dataset.paused === 'true' || document.hidden);
    const observer = new IntersectionObserver(([entry]) => { node.dataset.visible = String(entry.isIntersecting); sync(); });
    observer.observe(node);
    void loadScrollMotion().then(({ gsap }) => {
      if (cancelled) return;
      context = gsap.context(() => { tween.current = gsap.to('.x-tech-track', { xPercent: -50, duration: 42, repeat: -1, ease: 'none' }); }, node);
      sync();
    });
    document.addEventListener('visibilitychange', sync);
    return () => { cancelled = true; observer.disconnect(); context?.revert(); tween.current = null; document.removeEventListener('visibilitychange', sync); };
  }, [reduced]);
  useEffect(() => { tween.current?.paused(paused || ref.current?.dataset.visible !== 'true' || document.hidden); }, [paused]);
  return <section ref={ref} className="x-technology x-section" data-theme="light" data-ambient="warm" data-paused={paused} aria-label={content.technology.title}><div className="x-container x-tech-label"><h2>{content.technology.title}</h2><span>{content.technology.note}</span><button type="button" aria-label={paused ? siteContent.agency.technology.play : siteContent.agency.technology.pause} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={13} /> : <Pause size={13} />}</button></div><div className="x-tech-window" onPointerEnter={() => tween.current?.timeScale(.25)} onPointerLeave={() => tween.current?.timeScale(1)}><div className="x-tech-track">{[0, 1].map(set => <ul key={set} aria-hidden={set === 1 || undefined}>{content.technology.brands.map(([name, slug]) => <li key={slug}><span className="tech-symbol" style={{ maskImage: 'url(/technology/' + slug + '.svg)' }} aria-hidden="true" /><span>{name}</span></li>)}</ul>)}</div></div></section>;
}
