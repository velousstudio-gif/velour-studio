'use client';

import { Header } from './site';
import { useRef } from 'react';
import { HeroExperience } from './sections/hero-experience';
import { PageIntro } from './experience/page-intro';
import { ServicesShowcase } from './sections/services-showcase';
import { ProjectsShowcase } from './sections/projects-showcase';
import { TechnologyMarquee } from './sections/technology-marquee';
import { ProcessStory } from './sections/process-story';
import { AboutExperience } from './sections/about-experience';
import { GiantType } from './sections/giant-type';
import { ConversionCTA } from './sections/conversion-cta';
import { FAQExperience, ContactSections } from './sections/contact-sections';
import { FooterExperience } from './sections/footer-experience';
import { ExperienceScenes } from './experience/experience-scenes';

export default function ExperienceHome({ contactEnabled = false }: { contactEnabled?: boolean }) {
  const main = useRef<HTMLElement>(null);
  return <><a className="skip-link" href="#main">Saltar al contenido</a><PageIntro /><Header /><main ref={main} id="main" className="experience-main"><ExperienceScenes root={main} /><HeroExperience /><TechnologyMarquee /><ServicesShowcase /><ProjectsShowcase /><ProcessStory /><AboutExperience /><GiantType /><ConversionCTA /><FAQExperience /><ContactSections enabled={contactEnabled} /></main><FooterExperience /></>;
}
