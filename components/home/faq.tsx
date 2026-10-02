'use client';

import { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { homeContent } from '@/content/home-content';
import { siteContent } from '@/content/site-content';
import { faqs } from '@/lib/content';
import { AnimatedFAQ } from '../animated-faq';
import { MotionLink as Link } from '../motion';

export function FAQ() {
  const [active, setActive] = useState<string | null>(null);
  const [closing, setClosing] = useState<string | null>(null);
  const copy = homeContent.faq;
  return <section id="faq" className="faq-section section-space"><div className="container faq-grid"><div><span className="eyebrow">{copy.label}</span><h2>{copy.title}<br /><em>{copy.accent}</em></h2><p>{copy.description}</p><Link className="text-link" href={siteContent.links.questions}>{siteContent.agency.faq.link}<ArrowDown size={17} aria-hidden="true" /></Link></div><div className="faqs">{faqs.map(faq => <AnimatedFAQ key={faq.id} question={faq.question} expanded={active === faq.id} closing={closing === faq.id} onToggle={() => { setClosing(active); setActive(active === faq.id ? null : faq.id); }} onClosed={() => setClosing(value => value === faq.id ? null : value)}><p>{faq.answer}</p>{faq.id === 'payment' && <dl className="payment-options">{siteContent.paymentOptions.filter(option => option.enabled).map(option => <div key={option.label}><dt>{option.label}</dt><dd>{option.description}</dd></div>)}</dl>}</AnimatedFAQ>)}</div></div></section>;
}
