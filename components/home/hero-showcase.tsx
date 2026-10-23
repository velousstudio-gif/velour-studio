'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Shot = { slug: string; name: string; sector: string; url: string; screenshot: string };

/** Laptop con las portadas reales de los trabajos, rotando cada 4,5 s (se detiene con movimiento reducido o al pasar el mouse). */
export function HeroShowcase({ works }: { works: Shot[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || works.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex(current => (current + 1) % works.length), 4500);
    return () => window.clearInterval(id);
  }, [paused, works.length]);
  const active = works[index];
  return <figure className="vx-showcase hero-enter" style={{ animationDelay: '.35s' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <div className="vx-laptop">
      <div className="vx-laptop-screen">
        <div className="vx-laptop-bar" aria-hidden="true"><span><i /><i /><i /></span><span>{active.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span><span /></div>
        <div className="vx-laptop-view">{works.map((work, i) => <Image key={work.slug} src={work.screenshot} alt={i === index ? `Portada del sitio de ${work.name}` : ''} fill sizes="(max-width: 1100px) 92vw, 620px" priority={i === 0} data-active={i === index} />)}</div>
      </div>
      <div className="vx-laptop-base" aria-hidden="true" />
    </div>
    <figcaption><span><b>{active.name}</b> · {active.sector}</span>
      <span className="vx-dots" role="group" aria-label="Elegir trabajo">{works.map((work, i) => <button key={work.slug} type="button" aria-label={`Ver ${work.name}`} aria-pressed={i === index} onClick={() => { setIndex(i); setPaused(true); }} />)}</span>
    </figcaption>
  </figure>;
}
