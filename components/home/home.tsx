import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { getDict, localePath, localizeWork, type Locale } from '@/content/i18n';
import { siteContent } from '@/content/site-content';
import { visibleClientWorks } from '@/lib/portfolio-preview';
import { Header } from '../site';
import { MotionLink as Link, Reveal } from '../motion';
import { QuestionForm, ProjectDiagnostic } from '../contact-form';
import { WhatsAppFloat } from '../whatsapp-float';
import { Hero } from './hero';
import { WebShowcase, CommerceShowcase, SoftwareShowcase } from './showcase';
import { Services } from './services';
import { Process } from './process';
import { Portfolio } from './portfolio';
import { Concepts } from './concepts';
import { FAQ } from './faq';
import { Footer } from './footer';

export default function Home({ locale = 'es' }: { locale?: Locale }) {
  const { home: copy, ui } = getDict(locale);
  const works = visibleClientWorks().map(work => localizeWork(locale, work));
  const lp = (path: string) => localePath(locale, path);
  return <><a href="#main" className="skip-link">{ui.header.skip}</a><Header /><main id="main" className="vx-home ix-home">
    <Hero locale={locale} />
    <WebShowcase locale={locale} />
    <CommerceShowcase locale={locale} />
    <SoftwareShowcase locale={locale} />
    <Services locale={locale} />
    <Portfolio locale={locale} />
    <Concepts locale={locale} />
    <Process locale={locale} />
    {works.length > 0 && <div className="ix-strip" aria-label={locale === 'en' ? 'Clients' : 'Clientes'}><div className="ix-strip-track">{[...works, ...works, ...works].map((work, i) => <span key={`${work.slug}-${i}`} aria-hidden={i >= works.length}>{work.name}</span>)}</div></div>}
    <section className="ix-contact-intro" aria-labelledby="contact-intro-title">
      <Reveal className="ix-contact-copy"><span className="ix-label">{copy.contactIntro.label}</span><h2 id="contact-intro-title">{copy.contactIntro.title} <span className="ix-gold">{copy.contactIntro.accent}</span></h2><p className="ix-body"><strong>{copy.contactIntro.bodyStrong}</strong> {copy.contactIntro.body}</p><div className="ix-actions ix-actions-left"><Link className="ix-btn ix-btn-gold" href={lp(siteContent.links.form)}>{copy.contactIntro.cta}<ArrowUpRight size={17} aria-hidden="true" /></Link></div></Reveal>
      <div className="ix-contact-image"><Image src={siteContent.media.hero.src} alt={siteContent.media.hero.alt} fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
    </section>
    <section id="contacto" className="ix-dark ix-form-section" aria-labelledby="form-title"><div className="container ix-form-grid" id="project-form">
      <div className="ix-form-card"><span className="ix-label">{copy.formSection.label}</span><h2 id="form-title">{copy.formSection.title}</h2><ProjectDiagnostic /></div>
      <aside className="ix-contact-card"><h3>{copy.formSection.after}</h3>
        <ol className="ix-after-list">{copy.formSection.afterSteps.map((step, i) => <li key={step}><span className="ix-contact-icon" aria-hidden="true">0{i + 1}</span><span>{step}</span></li>)}</ol>
        <p className="ix-contact-note">{copy.cta.notes.join(' · ')}</p>
      </aside>
    </div></section>
    <FAQ />
    <section id="preguntas" className="questions-section section-space"><div className="container form-section-grid"><div className="form-intro"><span className="eyebrow">{copy.question.label}</span><h2>{copy.question.title}<br /><em>{copy.question.accent}</em></h2><p>{copy.question.description}</p></div><QuestionForm /></div></section>
  </main><Footer locale={locale} /><WhatsAppFloat /></>;
}
