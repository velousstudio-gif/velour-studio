import { ArrowUpRight, Check } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { ProjectVisual } from '../project-visual';

export function WebComposition({ hero = false }: { hero?: boolean }) {
  return <div className={`web-composition${hero ? ' hero-composition' : ''}`} aria-hidden="true">
    <div className="browser-frame browser-main"><div className="browser-chrome"><span><i /><i /><i /></span><span>{siteContent.projects[0].name}</span><ArrowUpRight size={12} /></div><ProjectVisual project={siteContent.projects[0]} eager={hero} /></div>
    <div className="browser-frame browser-secondary"><div className="browser-chrome"><span><i /><i /><i /></span><span>{siteContent.projects[2].name}</span><ArrowUpRight size={12} /></div><ProjectVisual project={siteContent.projects[2]} /></div>
    <span className="composition-caption">WEB / COMMERCE / IDENTITY</span>
  </div>;
}

export function AutomationComposition() {
  const copy = siteContent.agency.interface;
  return <div className="automation-composition" aria-hidden="true"><div className="appointment-window"><div className="browser-chrome"><span><i /><i /><i /></span><span>{copy.label}</span><ArrowUpRight size={12} /></div><div className="appointment-body"><span className="appointment-brand">{copy.wordmark}</span><span className="appointment-label">{copy.label}</span><div className="appointment-title">{copy.title}</div><p>{copy.description}</p><div className="appointment-date">{copy.date}</div><div className="appointment-times">{copy.times.map((time, index) => <span data-selected={index === 1} key={time}>{time}</span>)}</div><div className="appointment-submit">{copy.button}<ArrowUpRight size={16} /></div></div></div><div className="confirmation-slip"><span className="confirmation-icon"><Check size={22} /></span><span>{copy.wordmark}</span><strong>{copy.status}</strong><span className="confirmation-line" /><small>{copy.note}</small></div></div>;
}
