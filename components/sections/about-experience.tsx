'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { experienceContent as content, siteContent } from '@/content/site-content';
import { TextReveal, Reveal, MotionLink } from '../motion';
import { MouseTilt } from '../experience/mouse-tilt';

export function AboutExperience() {
  const copy = siteContent.copy.home;
  return <section id="nosotros" className="x-about x-section" data-theme="light" data-ambient="warm"><div className="x-container"><div className="about-topline"><span className="x-kicker">{content.about.label}</span><span>{content.about.caption}</span></div><div className="experience-about-layout"><div><TextReveal>{copy.disenamos_con_intencion}<br /><em>{copy.desarrollamos_con_proposito}</em></TextReveal><Reveal><p>{copy.velour_studio_es_un_estudio_digital_independiente}</p><MotionLink href={siteContent.links.form} className="underlined-link">{copy.conozcamonos}<ArrowUpRight size={18} /></MotionLink></Reveal></div><MouseTilt className="about-monogram" strength={3} travel={15}><div className="monogram-orbit" aria-hidden="true" /><Image src="/brand/monogram-dark.png" alt="" width={1254} height={1254} sizes="(max-width: 700px) 85vw, 45vw" /><span>{content.about.signature}</span></MouseTilt></div><div className="about-principles" id="confianza">{siteContent.agency.trust.map(item => <Reveal key={item.title}><h3>{item.title}</h3><p>{item.description}</p></Reveal>)}</div></div></section>;
}
