'use client';

import { ArrowUpRight } from 'lucide-react';
import { experienceContent as content, siteContent } from '@/content/site-content';
import { contact } from '@/lib/content';
import { AnimatedButton, TextReveal } from '../motion';
import { ContextualCursor } from '../experience/contextual-cursor';

export function ConversionCTA() {
  return <section className="x-cta x-section" data-theme="dark" data-ambient="cta"><div className="cta-abstract-shape" aria-hidden="true"><div className="cta-shape-scroll"><i /><i /></div></div><div className="x-container"><span className="x-kicker">{content.cta.label}</span><div className="cta-type-layout"><div className="cta-question"><TextReveal>{content.cta.question[0]}<br />{content.cta.question[1]}</TextReveal></div><div className="cta-answer"><TextReveal>{content.cta.answer[0]}<br /><em>{content.cta.answer[1]}</em></TextReveal></div></div><div className="experience-cta-bottom"><p>{siteContent.agency.cta.description}</p><div><ContextualCursor label="IR"><AnimatedButton className="primary" href={siteContent.links.form} magnetic>{content.cta.primary}<ArrowUpRight size={20} /></AnimatedButton></ContextualCursor>{contact.whatsappHref && <a className="underlined-link" href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">{siteContent.agency.cta.secondary}<ArrowUpRight size={17} /></a>}</div></div><ul className="experience-cta-notes">{siteContent.agency.cta.notes.map(note => <li key={note}>{note}</li>)}</ul></div></section>;
}
