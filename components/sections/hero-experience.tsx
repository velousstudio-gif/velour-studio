'use client';

import Image from 'next/image';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { experienceContent as content, siteContent } from '@/content/site-content';
import { AnimatedButton, Reveal } from '../motion';
import { MouseTilt } from '../experience/mouse-tilt';
import { ContextualCursor } from '../experience/contextual-cursor';
import { ProjectVisual } from '../project-visual';
import { MotionLink } from '../motion';

export function HeroExperience() {
  return <section id="inicio" className="x-hero x-section" data-theme="light" data-ambient="hero"><div className="x-container">
    <div className="x-hero-meta"><span>{content.hero.eyebrow}</span><span>{content.hero.note}</span></div>
    <div className="x-hero-monogram" aria-hidden="true"><MouseTilt strength={3} travel={10}><Image src="/brand/monogram-dark.png" alt="" width={1254} height={1254} sizes="70vw" loading="eager" /></MouseTilt></div>
    <div className="x-hero-headline"><h1 aria-label={content.hero.title}>{content.hero.lines.map((line, i) => <span className="hero-line" key={line}><span data-hero-line style={{ animationDelay: (i * .12 + .2) + 's' }}>{line}</span></span>)}<span className="hero-line hero-serif"><span data-hero-line style={{ animationDelay: '.44s' }}>{content.hero.accent}</span></span></h1><span className="hero-star" aria-hidden="true">✳</span></div>
    <div className="x-hero-bottom"><Reveal intro delay={.55}><p>{content.hero.description}</p><div className="x-hero-actions"><AnimatedButton href={siteContent.links.form} magnetic className="button-dark">{content.hero.primary}<ArrowUpRight size={18} /></AnimatedButton><MotionLink href={siteContent.links.works} className="underlined-link">{content.hero.secondary}<ArrowDown size={16} /></MotionLink></div></Reveal></div>
    <div className="x-hero-showcase"><MouseTilt><MotionLink href={'/proyectos/' + siteContent.projects[0].slug} aria-label={'Explorar proyecto: ' + siteContent.projects[0].name}><ContextualCursor><div className="showcase-chrome"><span /><span /><span /><small>{content.hero.exploration}</small><ArrowUpRight size={13} /></div><ProjectVisual project={siteContent.projects[0]} eager /></ContextualCursor></MotionLink></MouseTilt><div className="showcase-caption"><span>01 / {siteContent.projects[0].name}</span><span>{content.hero.concept}</span></div></div>
    <div className="x-hero-foot"><span>{content.hero.disciplines}</span><a href={siteContent.links.services}>{content.hero.scroll}<ArrowDown size={15} /></a></div>
  </div></section>;
}
