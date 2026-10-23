import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { homeContent } from '@/content/home-content';
import { siteContent } from '@/content/site-content';
import { isPreviewOnly, type ClientWork } from '@/content/portfolio';
import { visibleClientWorks } from '@/lib/portfolio-preview';
import { MotionLink as Link, Reveal } from '../motion';

type Tile = { work: ClientWork; kind: 'desktop' | 'phone' };

/** Muro 3D de trabajos reales: columnas que se desplazan solas en sentidos alternos (se pausan con el mouse). */
export function Portfolio() {
  const copy = homeContent.portfolio;
  const works = visibleClientWorks().filter(work => work.screenshot);
  if (works.length === 0) return null;
  const at = (i: number) => works[((i % works.length) + works.length) % works.length];
  const columns: Tile[][] = [0, 1, 2, 3, 4].map(c => [0, 1, 2, 3].map(i => ({ work: at(c + i), kind: (c + i) % 2 === 0 ? 'desktop' : 'phone' })));
  const tile = ({ work, kind }: Tile, key: string, hidden: boolean) => {
    const src = kind === 'phone' ? work.screenshotMobile : work.screenshot;
    if (!src) return null;
    return <Link key={key} href={`/trabajos/${work.slug}`} className={`ix-tile ix-tile-${kind}`} aria-label={`${copy.view}: ${work.name}`} aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined}>
      <span className="ix-tile-screen"><Image src={src} alt={hidden ? '' : `Sitio de ${work.name}`} fill sizes={kind === 'phone' ? '220px' : '360px'} /></span>
      <span className="ix-tile-caption"><b>{work.name}</b>{work.sector}<ArrowUpRight size={14} aria-hidden="true" /></span>
    </Link>;
  };
  return <section id="proyectos" className="ix-dark ix-work" aria-labelledby="work-title">
    <Reveal className="container ix-heading-center ix-heading-dark"><span className="ix-label">{copy.label}</span><h2 id="work-title">{copy.title}</h2><p><strong>{copy.leadStrong}</strong> {copy.clientIntro}</p>
      {works.some(isPreviewOnly) && <p className="preview-badge">VISTA PREVIA LOCAL · PENDIENTES DE AUTORIZACIÓN · NO SE PUBLICAN</p>}</Reveal>
    <div className="ix-wall"><div className="ix-wall-inner">{columns.map((column, c) => <div key={c} className="ix-wall-col" data-col={c}><div className="ix-wall-track">
      {column.map((t, i) => tile(t, `a${c}-${i}`, false))}
      {column.map((t, i) => tile(t, `b${c}-${i}`, true))}
    </div></div>)}</div></div>
    <div className="container ix-work-list"><ul>{works.map((work, i) => <li key={work.slug}><Reveal delay={i * .07}><Link href={`/trabajos/${work.slug}`}><span>{work.category} · {work.sector}</span><strong>{work.name}</strong><ArrowUpRight size={16} aria-hidden="true" /></Link></Reveal></li>)}</ul>
      <div className="ix-actions"><Link className="ix-btn ix-btn-gold" href={siteContent.links.form}>{copy.cta}<ArrowUpRight size={17} aria-hidden="true" /></Link></div></div>
  </section>;
}
