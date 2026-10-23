import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, Check } from 'lucide-react';
import { getDict, localePath, localizeWork, type Locale } from '@/content/i18n';
import { visibleClientWorks } from '@/lib/portfolio-preview';
import { Logo } from '@/components/brand-logo';
import { VslVideo } from '@/components/vsl-video';
import { VslForm } from '@/components/vsl-form';
import { WhatsAppFloat } from '@/components/whatsapp-float';
import { Spotlight } from '@/components/fx';
import { Reveal } from '@/components/motion';
import { LanguageSwitch } from '@/components/locale';

/** Página para anuncios: video + formulario corto. Sin menú, para que la visita se enfoque en la acción. */
export function VslPageView({ locale }: { locale: Locale }) {
  const vsl = getDict(locale).ui.vsl;
  const en = locale === 'en';
  const works = visibleClientWorks().map(work => localizeWork(locale, work)).filter(work => work.screenshot);
  return <main className="ix-home vsl-page" id="main">
    <header className="vsl-top"><div className="container"><Logo /><LanguageSwitch className="vsl-lang" /><a className="ix-btn ix-btn-line vsl-top-cta" href="#formulario">{en ? 'GET A QUOTE' : 'PEDIR PRESUPUESTO'}</a></div></header>

    <section className="vsl-hero ix-dark"><Spotlight className="vsl-spot"><div className="container vsl-hero-inner">
      <p className="ix-kicker hero-enter"><span aria-hidden="true" />{vsl.kicker}</p>
      <h1 className="hero-enter" style={{ animationDelay: '.1s' }}>{vsl.title} <span className="ix-gold">{vsl.accent}</span></h1>
      <p className="vsl-sub hero-enter" style={{ animationDelay: '.25s' }}>{vsl.videoUrl ? vsl.subtitle : vsl.subtitleNoVideo}</p>
      <div className="vsl-frame hero-enter" style={{ animationDelay: '.35s' }}>
        {vsl.videoUrl ? <VslVideo url={vsl.videoUrl} poster={vsl.videoPoster} title={`${vsl.title} ${vsl.accent}`} />
          : <div className="vsl-works"><span className="vsl-works-title">{vsl.noVideoTitle}</span><div className="vsl-works-grid">{works.map(work => <figure key={work.slug}><span><Image src={work.screenshot!} alt={work.name} fill sizes="(max-width: 700px) 45vw, 420px" /></span><figcaption>{work.name}</figcaption></figure>)}</div></div>}
      </div>
      <a className="ix-btn ix-btn-gold ix-btn-glow vsl-main-cta" href="#formulario">{vsl.cta}<ArrowDown size={17} aria-hidden="true" /></a>
      <ul className="vsl-benefits">{vsl.benefits.map(item => <li key={item.title}><Check size={16} aria-hidden="true" /><span><b>{item.title}.</b> {item.text}</span></li>)}</ul>
    </div></Spotlight></section>

    {works.length > 0 && <div className="ix-strip" aria-label={en ? 'Our work' : 'Trabajos realizados'}><div className="ix-strip-track">{[...works, ...works, ...works].map((work, i) => <span key={`${work.slug}-${i}`} aria-hidden={i >= works.length}>{work.name}</span>)}</div></div>}

    <section className="ix-light vsl-steps-section"><div className="container">
      <Reveal className="ix-heading-center"><span className="ix-label">{en ? 'NEXT STEPS' : 'CÓMO SIGUE'}</span><h2>{en ? 'Three steps and' : 'Tres pasos y'} <span className="ix-gold">{en ? "we're off" : 'empezamos'}</span></h2></Reveal>
      <ol className="vsl-steps">{vsl.steps.map((step, i) => <li key={step.title}><Reveal delay={i * .08} className="vsl-step"><span>0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></Reveal></li>)}</ol>
    </div></section>

    <section id="formulario" className="ix-dark vsl-form-section"><div className="container vsl-form-grid">
      <div className="vsl-form-intro"><span className="ix-label">{vsl.form.label}</span><h2>{vsl.form.title}</h2>
        <dl className="vsl-faq">{vsl.faq.map(item => <div key={item.q}><dt>{item.q}</dt><dd>{item.a}</dd></div>)}</dl></div>
      <div className="ix-form-card vsl-card"><VslForm /></div>
    </div></section>

    <footer className="vsl-footer"><div className="container"><span>© 2026 Velour Studio</span><Link href={localePath(locale, '/')}>velourstudio.online</Link><Link href="/privacidad">{en ? 'Privacy' : 'Privacidad'}</Link></div></footer>
    <WhatsAppFloat />
  </main>;
}
