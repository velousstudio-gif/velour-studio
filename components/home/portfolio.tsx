import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { homeContent } from '@/content/home-content';
import { siteContent } from '@/content/site-content';
import { isPreviewOnly, type ClientWork } from '@/content/portfolio';
import { visibleClientWorks } from '@/lib/portfolio-preview';
import { MotionLink as Link } from '../motion';

type Tile = { work: ClientWork; kind: 'desktop' | 'phone' };

/** Mosaico de trabajos reales (escritorio y celular) en columnas desfasadas, como un muro de proyectos. */
export function Portfolio() {
  const copy = homeContent.portfolio;
  const works = visibleClientWorks().filter(work => work.screenshot);
  if (works.length === 0) return null;
  const at = (i: number) => works[i % works.length];
  const columns: Tile[][] = [
    [{ work: at(0), kind: 'desktop' }, { work: at(1), kind: 'phone' }],
    [{ work: at(0), kind: 'phone' }, { work: at(2), kind: 'desktop' }],
    [{ work: at(3), kind: 'desktop' }, { work: at(2), kind: 'phone' }],
    [{ work: at(3), kind: 'phone' }, { work: at(1), kind: 'desktop' }],
  ];
  return <section id="proyectos" className="ix-dark ix-work" aria-labelledby="work-title">
    <div className="container ix-heading-center ix-heading-dark"><span className="ix-label">{copy.label}</span><h2 id="work-title">{copy.title}</h2><p><strong>{copy.leadStrong}</strong> {copy.clientIntro}</p>
      {works.some(isPreviewOnly) && <p className="preview-badge">VISTA PREVIA LOCAL · PENDIENTES DE AUTORIZACIÓN · NO SE PUBLICAN</p>}</div>
    <div className="ix-wall"><div className="ix-wall-inner">{columns.map((column, c) => <div key={c} className="ix-wall-col" data-col={c}>{column.map(({ work, kind }) => {
      const src = kind === 'phone' ? work.screenshotMobile : work.screenshot;
      if (!src) return null;
      return <Link key={`${work.slug}-${kind}`} href={`/trabajos/${work.slug}`} className={`ix-tile ix-tile-${kind}`} aria-label={`${copy.view}: ${work.name}`}>
        <span className="ix-tile-screen"><Image src={src} alt={`Sitio de ${work.name}`} fill sizes={kind === 'phone' ? '240px' : '(max-width: 850px) 70vw, 380px'} /></span>
        <span className="ix-tile-caption"><b>{work.name}</b>{work.sector}<ArrowUpRight size={14} aria-hidden="true" /></span>
      </Link>;
    })}</div>)}</div></div>
    <div className="container ix-work-list"><ul>{works.map(work => <li key={work.slug}><Link href={`/trabajos/${work.slug}`}><span>{work.category} · {work.sector}</span><strong>{work.name}</strong><ArrowUpRight size={16} aria-hidden="true" /></Link></li>)}</ul>
      <div className="ix-actions"><Link className="ix-btn ix-btn-gold" href={siteContent.links.form}>{copy.cta}<ArrowUpRight size={17} aria-hidden="true" /></Link></div></div>
  </section>;
}
