import Image from 'next/image';
import { ArrowUpRight, Check } from 'lucide-react';
import { homeContent as copy } from '@/content/home-content';
import { siteContent } from '@/content/site-content';
import { contact } from '@/lib/content';
import { Header } from '../site';
import { MotionLink as Link } from '../motion';
import { QuestionForm, ProjectDiagnostic } from '../contact-form';
import { WhatsAppFloat } from '../whatsapp-float';
import { Hero } from './hero';
import { TechnologyMarquee } from './technology-marquee';
import { Services } from './services';
import { Solutions } from './solutions';
import { Process } from './process';
import { Portfolio } from './portfolio';
import { FAQ } from './faq';
import { Footer } from './footer';

export default function Home() {
  return <><a href="#main" className="skip-link">Saltar al contenido</a><Header /><main id="main" className="vx-home">
    <Hero />
    <Services />
    <Portfolio />
    <Solutions />
    <Process />
    <section className="vx-cta section-space" aria-labelledby="cta-title"><div className="vx-hero-glow" aria-hidden="true" /><div className="container"><span className="vx-label">{copy.cta.label}</span><h2 id="cta-title">{copy.cta.title} <em>{copy.cta.accent}</em></h2><p>{copy.cta.description}</p><div className="vx-center-actions"><Link className="vx-btn vx-btn-gold" href={siteContent.links.form}>{copy.cta.primary}<ArrowUpRight size={18} aria-hidden="true" /></Link>{contact.whatsappHref && <a className="vx-btn vx-btn-ghost" href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">{copy.cta.secondary}<ArrowUpRight size={18} aria-hidden="true" /></a>}</div><ul className="vx-cta-notes">{copy.cta.notes.map(note => <li key={note}><Check size={14} aria-hidden="true" />{note}</li>)}</ul></div></section>
    <section id="contacto" className="diagnostic-section section-space"><div className="container form-section-grid" id="project-form"><div className="form-intro"><span className="eyebrow">{siteContent.agency.diagnostic.label}</span><h2>{copy.diagnostic.title}<br /><em>{copy.diagnostic.accent}</em></h2><p>{copy.diagnostic.description}</p><div className="direct-contact"><span className="eyebrow">{siteContent.agency.diagnostic.direct}</span>{contact.whatsappHref && <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer"><span>WhatsApp<small>{contact.whatsappDisplay}</small></span><ArrowUpRight size={18} /></a>}{contact.emailHref && <a href={contact.emailHref}><span>Email<small>{contact.email}</small></span><ArrowUpRight size={18} /></a>}</div></div><ProjectDiagnostic /></div></section>
    <FAQ />
    <section id="preguntas" className="questions-section section-space"><div className="container form-section-grid"><div className="form-intro"><span className="eyebrow">{copy.question.label}</span><h2>{copy.question.title}<br /><em>{copy.question.accent}</em></h2><p>{copy.question.description}</p><div className="question-monogram" aria-hidden="true"><Image className="monogram-on-light" src="/brand/monogram-dark.png" alt="" fill sizes="240px" /><Image className="monogram-on-dark" src="/brand/monogram-light.png" alt="" fill sizes="240px" /></div></div><QuestionForm /></div></section>
    <TechnologyMarquee />
  </main><Footer /><WhatsAppFloat /></>;
}
