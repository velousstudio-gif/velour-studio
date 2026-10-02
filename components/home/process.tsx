'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { homeContent } from '@/content/home-content';

export function Process() {
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const nodes = list.current?.querySelectorAll('li[data-step]');
    if (!nodes) return;
    const observer = new IntersectionObserver(entries => {
      const entry = entries.filter(item => item.isIntersecting).sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
      if (entry) setActive(Number((entry.target as HTMLElement).dataset.step));
    }, { rootMargin: '-18% 0px -48% 0px', threshold: 0 });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  const copy = homeContent.process;
  return <section id="proceso" className="process-section section-space"><div className="container">
    <div className="section-heading"><div><span className="eyebrow">{copy.label}</span><h2>{copy.title}<br /><em>{copy.accent}</em></h2></div><p>{copy.description}</p></div>
    <div className="process-grid"><figure className="process-art"><div className="process-image"><Image src={siteContent.media.hero.src} alt={siteContent.media.hero.alt} fill sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1024px) 44vw, 560px" /><div className="process-art-type"><span>VELOUR STUDIO</span><p>{copy.visualTitle}<br /><em>{copy.visualAccent}</em></p><small>{copy.caption}</small></div></div><figcaption>{copy.visualNote}<span>{siteContent.agency.process.note}</span></figcaption></figure>
      <ol ref={list} className="process-steps">{siteContent.process.map((step, index) => <li data-step={index} data-active={active === index} key={step.title}><span className="process-number">0{index + 1}</span><div><div className="process-meta"><h3>{step.title}</h3><span>{step.timing}</span></div><p>{step.description}</p>{step.deliverables.length > 0 && <ul className="deliverables" aria-label={siteContent.agency.process.deliverables}>{step.deliverables.map(item => <li key={item}><Check size={12} aria-hidden="true" />{item}</li>)}</ul>}{step.approval && <span className="approval-badge">{siteContent.agency.process.approval}</span>}</div></li>)}</ol>
    </div>
  </div></section>;
}
