'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { homeContent } from '@/content/home-content';
import { siteContent } from '@/content/site-content';

export function TechnologyMarquee() {
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let visible = false;
    const sync = () => { node.dataset.playing = String(visible && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(node); document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, []);
  return <section ref={ref} className="technology" aria-label={homeContent.technology.title} data-paused={paused}>
    <div className="container technology-heading"><h2>{homeContent.technology.title}</h2><button className="marquee-toggle" aria-label={paused ? siteContent.agency.technology.play : siteContent.agency.technology.pause} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} /> : <Pause size={14} />}</button></div>
    <div className="technology-window"><div className="technology-track">{[0, 1].map(set => <ul key={set} aria-hidden={set === 1 || undefined}>{homeContent.technology.brands.map(brand => <li key={brand.name}>{brand.icon ? <span className="technology-icon" style={{ maskImage: `url(/technology/${brand.icon}.svg)` }} aria-hidden="true" /> : <span className="technology-letter" aria-hidden="true">{brand.symbol}</span>}<span>{brand.name}</span></li>)}</ul>)}</div></div>
  </section>;
}
