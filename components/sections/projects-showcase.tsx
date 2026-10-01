'use client';

import { ArrowUpRight } from 'lucide-react';
import { experienceContent as content, siteContent } from '@/content/site-content';
import { projects } from '@/lib/content';
import { TextReveal, ImageReveal, MotionLink } from '../motion';
import { ContextualCursor } from '../experience/contextual-cursor';
import { MouseTilt } from '../experience/mouse-tilt';
import { ProjectVisual } from '../project-visual';

export function ProjectsShowcase() {
  return <section id="proyectos" className="x-work x-section" data-theme="dark" data-ambient="projects"><div className="x-container"><div className="x-section-heading"><span className="x-kicker">{content.projects.label}</span><TextReveal>{content.projects.title}<br /><em>{content.projects.accent}</em></TextReveal><p>{projects.some(project => project.status === 'demo') ? siteContent.agency.work.demo : siteContent.agency.work.real}</p></div>
    <div className="experience-projects">{projects.map((project, index) => <article className={'experience-project project-' + project.kind} data-project-tone={['warm', 'charcoal', 'rose'][index % 3]} key={project.slug}>
      <div className="project-topline"><span>0{index + 1} / {project.status === 'demo' ? 'CONCEPT PROJECT' : 'SELECTED PROJECT'}</span><span>{project.category} — {project.year}</span></div>
      <MotionLink href={'/proyectos/' + project.slug} className="experience-project-link" aria-label={content.projects.view + ': ' + project.name}><ContextualCursor label="VIEW PROJECT"><ImageReveal><div className="project-scroll-layer"><MouseTilt strength={2} travel={5}><ProjectVisual project={project} /></MouseTilt></div></ImageReveal></ContextualCursor><span className="project-open-arrow"><ArrowUpRight size={32} /></span></MotionLink>
      <div className="experience-project-caption"><h3><MotionLink href={'/proyectos/' + project.slug}>{project.name}<ArrowUpRight size={25} /></MotionLink></h3><div><p>{project.description}</p><ul>{project.tech.map(tech => <li key={tech}>{tech}</li>)}</ul></div></div>
    </article>)}</div></div></section>;
}
