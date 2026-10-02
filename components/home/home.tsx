import Image from 'next/image';
import { ArrowUpRight, ArrowDown, Check } from 'lucide-react';
import { homeContent as copy } from '@/content/home-content';
import { siteContent } from '@/content/site-content';
import { contact } from '@/lib/content';
import { Header } from '../site';
import { MotionLink as Link } from '../motion';
import { QuestionForm, ProjectDiagnostic } from '../contact-form';
import { WebComposition } from './visuals';
import { TechnologyMarquee } from './technology-marquee';
import { Services } from './services';
import { Process } from './process';
import { Portfolio } from './portfolio';
import { FAQ } from './faq';
import { Footer } from './footer';

export default function Home() {
  return <><a href="#main" className="skip-link">Saltar al contenido</a><Header /><main id="main">
    <section id="inicio" className="home-hero"><div className="container"><div className="hero-grid"><div className="hero-copy"><p className="eyebrow hero-enter" style={{ animationDelay: '.05s' }}>{copy.hero.eyebrow}</p><h1><span className="hero-line"><span>{copy.hero.title}</span></span><em className="hero-line"><span>{copy.hero.accent}</span></em></h1><p className="hero-description hero-enter" style={{ animationDelay: '.45s' }}>{copy.hero.description}</p><div className="hero-actions hero-enter" style={{ animationDelay: '.6s' }}><Link className="button" href={siteContent.links.form}>{copy.quote}<ArrowUpRight size={17} aria-hidden="true" /></Link><Link className="text-link" href={siteContent.links.works}>{copy.hero.secondary}<ArrowUpRight size={17} aria-hidden="true" /></Link></div></div><figure className="hero-visual"><WebComposition hero /><figcaption>{copy.hero.visualLabel}</figcaption></figure></div><div className="hero-bottomline"><span>{copy.hero.caption}</span><Link href={siteContent.links.services} aria-label="Explorar servicios"><ArrowDown size={18} /></Link></div></div></section>
    <div className="trust-strip"><ul className="container" aria-label="Nuestra forma de trabajar">{copy.trust.map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul></div>
    <TechnologyMarquee /><Services /><Process /><Portfolio />
    <section className="conversation-cta section-space"><div className="container"><span className="eyebrow">{copy.cta.label}</span><h2>{copy.cta.title}<br /><em>{copy.cta.accent}</em></h2><p>{copy.cta.description}</p><div className="cta-actions"><Link className="button" href={siteContent.links.form}>{copy.cta.primary}<ArrowUpRight size={17} aria-hidden="true" /></Link>{contact.whatsappHref && <a className="text-link" href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">{copy.cta.secondary}<ArrowUpRight size={17} aria-hidden="true" /></a>}</div><ul className="cta-notes">{copy.cta.notes.map(note => <li key={note}><Check size={13} aria-hidden="true" />{note}</li>)}</ul></div></section>
    <FAQ />
    <section id="preguntas" className="questions-section section-space"><div className="container form-section-grid"><div className="form-intro"><span className="eyebrow">{copy.question.label}</span><h2>{copy.question.title}<br /><em>{copy.question.accent}</em></h2><p>{copy.question.description}</p><div className="question-monogram" aria-hidden="true"><Image className="monogram-on-light" src="/brand/monogram-dark.png" alt="" fill sizes="240px" /><Image className="monogram-on-dark" src="/brand/monogram-light.png" alt="" fill sizes="240px" /></div></div><QuestionForm /></div></section>
    <section id="contacto" className="diagnostic-section section-space"><div className="container form-section-grid" id="project-form"><div className="form-intro"><span className="eyebrow">{siteContent.agency.diagnostic.label}</span><h2>{copy.diagnostic.title}<br /><em>{copy.diagnostic.accent}</em></h2><p>{copy.diagnostic.description}</p><div className="direct-contact"><span className="eyebrow">{siteContent.agency.diagnostic.direct}</span>{contact.whatsappHref && <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer"><span>WhatsApp<small>{contact.whatsappDisplay}</small></span><ArrowUpRight size={18} /></a>}{contact.emailHref && <a href={contact.emailHref}><span>Email<small>{contact.email}</small></span><ArrowUpRight size={18} /></a>}</div></div><ProjectDiagnostic /></div></section>
  </main><Footer /></>;
}
