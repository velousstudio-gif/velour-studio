import Image from 'next/image';
import type { Project } from '@/content/site-content';
import { ProjectMockup } from './mockup';

/** Use a real image by editing projects[].image; the existing demo remains the fallback. */
export function ProjectVisual({ project }: { project: Project }) {
  if (!project.image.src) return <ProjectMockup kind={project.kind} />;
  return <div className="project-art">
    <Image src={project.image.src} alt={project.image.alt || project.name} fill
      sizes="(max-width: 800px) calc(100vw - 40px), (max-width: 1440px) 85vw, 1328px"
      style={{ objectFit: 'cover' }} />
  </div>;
}
