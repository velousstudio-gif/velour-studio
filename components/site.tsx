'use client';
import { siteContent } from '@/content/site-content';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowDown, Menu, X, Plus, Minus } from 'lucide-react';
import { contact, services, projects, plans, faqs, projectInquiryHref } from '@/lib/content';
import { ProjectVisual } from './project-visual';
import ContactForm from './contact-form';
import { Logo } from './brand-logo';
import editorialBrand from './editorial-brand.module.css';
export { Logo } from './brand-logo';

const navigation = siteContent.navigation;

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <header className="site-header"><div className="container header-inner">
    <Logo />
    <nav id="primary-navigation" aria-label="Navegación principal" className={open ? 'navigation is-open' : 'navigation'}>
      {navigation.map(([label, id]) => <a href={siteContent.links[id as keyof typeof siteContent.links]} key={id} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={15} /></a>)}
    </nav>
    <a className="header-project" href={siteContent.links.contact}>{siteContent.copy.home.hablemos}<span className="round-arrow"><ArrowUpRight size={17} /></span></a>
    <button ref={toggle} className="menu-toggle" aria-controls="primary-navigation" aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
  </div></header>;
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { y: 24, opacity: 0.9 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduced ? 0 : 0.8 }}>{children}</motion.div>;
}

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{siteContent.copy.home.symbol}{number}{siteContent.copy.home.symbol_2}</span>{children}</div>;
}

function HeroArtwork() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  return <div className="hero-artwork" ref={ref}>
    <motion.div className="hero-image" style={{ y: reduced ? 0 : y }}><Image src={siteContent.media.hero.src} alt={siteContent.media.hero.alt} fill sizes="(max-width: 540px) 170vw, (max-width: 800px) calc(100vw - 48px), (max-width: 1100px) calc(100vw - 72px), (max-width: 1440px) calc(100vw - 112px), 1328px" preload /></motion.div>
    <div className="artwork-caption"><span>{siteContent.copy.home.direccion_creativa_velour_studio}</span><p>{siteContent.copy.home.la_forma_cambia}<br /><em>{siteContent.copy.home.la_intencion_permanece}</em></p></div>
    <div className="artwork-corner"><span>{siteContent.copy.home.exploracion_visual_001}</span><span className="artwork-mark" aria-hidden="true">{siteContent.copy.home.v}</span></div>
  </div>;
}

export default function Home({ contactEnabled = false }: { contactEnabled?: boolean }) {
  return <>
    <a className="skip-link" href="#main">{siteContent.copy.home.saltar_al_contenido}</a><Header />
    <main id="main">
      <section className="hero container" id="inicio">
        <div className="hero-topline"><span>{siteContent.copy.home.estudio_digital_independiente}</span><span>{siteContent.copy.home.web_commerce_branding}</span></div>
        <h1>{siteContent.copy.home.experiencias_digitales}<br /><em>{siteContent.copy.home.creadas_para_destacar}</em><span className="hero-asterisk" aria-hidden="true">{siteContent.copy.home.symbol_3}</span></h1>
        <div className="hero-bottom"><div className="hero-actions"><a className="button button-dark" href={siteContent.links.contact}>{siteContent.copy.home.empezar_un_proyecto}<ArrowUpRight size={18} /></a><a className="underlined-link" href={siteContent.links.works}>{siteContent.copy.home.ver_trabajos}<ArrowDown size={17} /></a></div><p>{siteContent.copy.home.disenamos_y_desarrollamos_experiencias_digitales_para_marcas}</p></div>
        <HeroArtwork /><div className="hero-colophon"><span>{siteContent.copy.home.estrategia_con_intencion_diseno_con_caracter}</span><a href={siteContent.links.manifesto}>{siteContent.copy.home.descubri_el_estudio}<ArrowDown size={13} /></a></div>
      </section>
      <section className={`manifesto container editorial-section ${editorialBrand.section}`} id="manifiesto"><div className={editorialBrand.artwork} aria-hidden="true"><Image src="/brand/monogram-dark.png" alt="" fill sizes="(max-width: 540px) 360px, (max-width: 800px) 420px, (max-width: 1448px) 29vw, 420px" /></div><SectionLabel number="01">{siteContent.copy.home.nuestra_mirada}</SectionLabel><Reveal className="manifesto-copy"><h2>{siteContent.copy.home.diseno_tecnologia}<br />{siteContent.copy.home.y_estrategia}<br /><em>{siteContent.copy.home.trabajando_juntos}</em></h2><div className="manifesto-bottom"><span className="star-mark" aria-hidden="true">{siteContent.copy.home.symbol_3}</span><p>{siteContent.copy.home.velour_studio_combina_diseno_visual_desarrollo_y}</p></div></Reveal></section>
      <section className="work-section dark-section" id="proyectos"><div className="container">
        <div className="section-heading"><div><SectionLabel number="02">{siteContent.copy.home.portfolio_seleccionado}</SectionLabel><h2>{siteContent.copy.home.trabajos}<br /><em>{siteContent.copy.home.seleccionados}</em></h2></div><p>{siteContent.copy.home.una_exploracion_de_lo_que_podemos_crear}<br /><span>{projects.some(project => project.status === 'demo') ? siteContent.copy.home.proyectos_conceptuales_mirada_real : siteContent.copy.home.real_projects_intro}</span></p></div>
        <div className="work-list">{projects.map((project, index) => <Reveal className={`work-item work-${project.kind}`} key={project.slug}>
          <Link className="work-image-link" href={`/proyectos/${project.slug}`} aria-label={`Ver proyecto ${project.name}`}><ProjectVisual project={project} /><span className="work-open"><ArrowUpRight size={24} /></span></Link>
          <div className="work-caption"><div><span className="work-index">{siteContent.copy.home.proyecto_0}{index + 1}{project.status === 'demo' && siteContent.copy.home.concepto}</span><h3><Link href={`/proyectos/${project.slug}`}>{project.name}</Link></h3></div><div><span className="work-category">{project.category}{siteContent.copy.home.symbol_4}{project.year}</span><p>{project.description}</p></div></div>
        </Reveal>)}</div>
        <div className="work-outro"><span>{siteContent.copy.home.tu_proyecto_podria_ser_el_proximo}</span><a className="underlined-link" href={siteContent.links.contact}>{siteContent.copy.home.hagamoslo_posible}<ArrowUpRight size={19} /></a></div>
      </div></section>
      <section className="services-section container editorial-section" id="servicios"><div className="section-heading"><div><SectionLabel number="03">{siteContent.copy.home.lo_que_hacemos}</SectionLabel><h2>{siteContent.copy.home.buenas_ideas}<br /><em>{siteContent.copy.home.bien_ejecutadas}</em></h2></div><p>{siteContent.copy.home.del_primer_boceto_al_ultimo_detalle}<br />{siteContent.copy.home.encontramos_la_forma_de_llevar_tu_marca}</p></div><div className="service-list">{services.map((service, index) => <a className="service-row" href={siteContent.links.contact} key={service.title}><span className="row-number">{siteContent.copy.home.text_0}{index + 1}</span><h3>{service.title}</h3><p>{service.description}</p><ArrowUpRight className="row-arrow" size={28} /></a>)}</div></section>
      <section className="process-section container editorial-section" id="proceso"><div className="section-heading"><div><SectionLabel number="04">{siteContent.copy.home.de_la_idea_a_lo_real}</SectionLabel><h2>{siteContent.copy.home.nuestro}<em>{siteContent.copy.home.proceso}</em></h2></div><p>{siteContent.copy.home.conversaciones_claras}<br />{siteContent.copy.home.decisiones_compartidas_cuidado_en_cada_etapa}</p></div><div className="process-list">{siteContent.process.map(([title, description], i) => <div className="process-step" key={title}><span className="process-number">{siteContent.copy.home.text_0}{i + 1}</span><h3>{title}</h3><p>{description}</p></div>)}</div></section>
      <section className="about-section dark-section" id="nosotros"><div className="container about-layout"><div className="studio-art" aria-label="Composición tipográfica de Velour Studio"><span className="studio-art-top">{siteContent.copy.home.independiente_por_naturaleza}</span><div className="studio-orbit orbit-one" /><div className="studio-orbit orbit-two" /><span className="studio-art-letter">{siteContent.copy.home.v}</span><span className="studio-art-bottom">{siteContent.copy.home.diseno_con_una_mirada_propia}</span></div><Reveal className="about-copy"><SectionLabel number="05">{siteContent.copy.home.el_estudio}</SectionLabel><h2>{siteContent.copy.home.disenamos_con_intencion}<br /><em>{siteContent.copy.home.desarrollamos_con_proposito}</em></h2><p className="about-intro">{siteContent.copy.home.velour_studio_es_un_estudio_digital_independiente}</p><a className="underlined-link" href={siteContent.links.contact}>{siteContent.copy.home.conozcamonos}<ArrowUpRight size={19} /></a></Reveal></div></section>
      <section className="investment-section container editorial-section" id="planes"><div className="investment-intro"><SectionLabel number="06">{siteContent.copy.home.un_punto_de_partida}</SectionLabel><h2>{siteContent.copy.home.cada_proyecto}<br /><em>{siteContent.copy.home.es_diferente}</em></h2><p>{siteContent.copy.home.el_alcance_define_la_inversion}<br />{siteContent.copy.home.estas_son_nuestras_bases_para_empezar}</p></div><div className="investment-list">{plans.map(plan => <a href={projectInquiryHref(plan.name)} className="investment-row" key={plan.name}><span>{plan.name}</span><span><small>{siteContent.copy.home.desde}</small>{siteContent.copy.home.usd}{plan.price}<ArrowUpRight size={19} /></span></a>)}<a className="investment-row" href={projectInquiryHref(siteContent.customProject.name)}><span>{siteContent.customProject.name}</span><span className="custom-price">{siteContent.customProject.priceLabel}<ArrowUpRight size={19} /></span></a><p className="investment-note">{siteContent.copy.home.los_costos_de_dominio_hosting_shopify_aplicaciones}</p></div></section>
      <section className="faq-section container" aria-labelledby="faq-heading"><h2 className="sr-only" id="faq-heading">{siteContent.copy.home.preguntas_frecuentes}</h2><SectionLabel number="07">{siteContent.copy.home.antes_de_empezar}</SectionLabel><div className="faqs">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus className="faq-plus" size={18} /><Minus className="faq-minus" size={18} /></summary><p>{answer}</p></details>)}</div></section>
      <section className="contact-section dark-section" id="contacto"><div className="container"><div className="contact-topline"><SectionLabel number="08">{siteContent.copy.home.tu_proxima_gran_idea}</SectionLabel><span>{siteContent.copy.home.empieza_con_una_conversacion}</span></div><h2>{siteContent.copy.home.hagamos_algo}<br /><em>{siteContent.copy.home.que_valga_la_pena}<br />{siteContent.copy.home.mostrar}</em><ArrowUpRight aria-hidden="true" /></h2><div className="contact-layout"><div className="contact-intro"><p>{siteContent.copy.home.contanos_que_queres_crear_y_te_ayudamos}</p><a className="underlined-link" href={siteContent.links.form}>{siteContent.copy.home.iniciar_proyecto}<ArrowDown size={18} /></a>{contact.email && <a className="contact-alternative" href={contact.emailHref}>{contact.email}<ArrowUpRight size={15} /></a>}{contact.whatsapp && <a className="contact-alternative" href={contact.whatsappHref} target="_blank" rel="noopener noreferrer"><span>WhatsApp · {contact.whatsappDisplay}</span><ArrowUpRight size={15} /></a>}</div><div id="project-form"><ContactForm enabled={contactEnabled} /></div></div></div></section>
    </main><Footer />
  </>;
}

export function Footer() {
  return <footer className="footer dark-section"><div className="container"><div className="footer-top"><Logo /><p>{siteContent.copy.home.diseno_con_caracter}<br />{siteContent.copy.home.experiencias_con_proposito}{contact.address && <><br /><span>{contact.address}</span></>}</p><nav aria-label="Servicios del estudio">{siteContent.footerServices.map(label => <a href={siteContent.links.services} key={label}>{label}</a>)}</nav><nav aria-label="Contacto y redes">{[
    { label: 'Email', detail: contact.email, href: contact.emailHref },
    { label: 'Instagram', href: contact.instagram },
    { label: 'LinkedIn', href: contact.linkedin },
    { label: 'WhatsApp', detail: contact.whatsappDisplay, href: contact.whatsappHref },
  ].filter(({ href }) => Boolean(href)).map(({ label, detail, href }) => <a key={label} href={href} style={{ maxWidth: '100%' }} {...(/^https?:\/\//.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{label}{detail && <><br />{label === 'Email' ? <>{detail.split('@')[0]}@<wbr />{detail.split('@')[1]}</> : detail}</>}</span> <ArrowUpRight size={13} /></a>)}<a href={siteContent.links.home}>{siteContent.copy.home.volver_arriba}<ArrowUpRight size={13} /></a></nav></div><div className="footer-bottom"><span>{siteContent.copy.home.text_2026_velour_studio}</span><div><Link href={siteContent.links.privacy}>{siteContent.copy.home.privacy}</Link><Link href={siteContent.links.terms}>{siteContent.copy.home.terms}</Link></div><span>{siteContent.copy.home.independent_by_design}</span></div></div></footer>;
}
