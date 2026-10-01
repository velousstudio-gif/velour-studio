'use client';
import { useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { experienceContent as content, siteContent } from '@/content/site-content';
import { contact, faqs } from '@/lib/content';
import { TextReveal, MotionLink } from '../motion';
import { AnimatedFAQ } from '../animated-faq';
import { ProjectDiagnostic, QuestionForm } from '../contact-form';

export function FAQExperience() {
  const [active, setActive] = useState<string | null>(null);
  const [closing, setClosing] = useState<string | null>(null);
  return <section id="faq" className="x-faq x-section" data-theme="light" data-ambient="neutral"><div className="x-container"><div className="x-section-heading"><span className="x-kicker">{content.faq.label}</span><TextReveal>{content.faq.title}<br /><em>{content.faq.accent}</em></TextReveal><p>{siteContent.agency.faq.description}</p></div><div className="experience-faqs faqs">{faqs.map(({ id, question, answer }, index) => <AnimatedFAQ key={id} question={question} index={index} expanded={active === id} closing={closing === id} onToggle={() => { setClosing(active); setActive(active === id ? null : id); }} onClosed={() => setClosing(value => value === id ? null : value)}><p>{answer}</p>{id === 'payment' && <dl className="payment-options">{siteContent.paymentOptions.map(option => <div key={option.label}><dt>{option.label}</dt><dd>{option.description}</dd></div>)}</dl>}</AnimatedFAQ>)}</div><MotionLink href={siteContent.links.questions} className="underlined-link faq-question-link">{siteContent.agency.faq.link}<ArrowDown size={16} /></MotionLink></div></section>;
}
export function ContactSections({ enabled }: { enabled: boolean }) {
  return <><section id="preguntas" className="x-question x-section" data-theme="light" data-ambient="neutral"><div className="x-container question-experience-layout"><div><span className="x-kicker">{siteContent.agency.question.label}</span><TextReveal>{siteContent.agency.question.title}</TextReveal><p>{siteContent.agency.question.description}</p></div><QuestionForm enabled={enabled} /></div></section>
    <section id="contacto" className="x-diagnostic x-section" data-theme="light" data-ambient="warm"><div className="x-container"><div id="project-form" className="diagnostic-experience-layout"><div className="diagnostic-editorial"><span className="x-kicker">{content.diagnostic.label}</span><TextReveal>{content.diagnostic.title}<br /><em>{content.diagnostic.accent}</em></TextReveal><p>{siteContent.agency.diagnostic.description}</p><div className="experience-direct"><span>{content.diagnostic.direct}</span>{contact.emailHref && <a href={contact.emailHref}>{contact.email}<ArrowUpRight size={16} /></a>}{contact.whatsappHref && <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp · {contact.whatsappDisplay}<ArrowUpRight size={16} /></a>}</div></div><ProjectDiagnostic enabled={enabled} /></div></div></section></>;
}
