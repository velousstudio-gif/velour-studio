import type { CSSProperties } from 'react';
import type { Concept } from '@/content/concepts';

/** Pantalla de un concepto dibujada con CSS (sin imágenes): escala con el ancho del contenedor. */
export function ConceptScreen({ concept }: { concept: Concept }) {
  const [bg, fg, ac, soft] = concept.palette;
  const style = { '--c-bg': bg, '--c-fg': fg, '--c-ac': ac, '--c-soft': soft } as CSSProperties;
  const words = concept.headline.split(' ');
  const half = Math.ceil(words.length / 2);
  const title = <b className="cs-title">{words.slice(0, half).join(' ')}<br />{words.slice(half).join(' ')}</b>;
  const nav = <div className="cs-nav"><span className="cs-logo">{concept.name}</span><span className="cs-links"><i /><i /><i /><i /></span><span className="cs-pill">{concept.kicker}</span></div>;
  const art = <span className={`cs-art cs-art-${concept.motif}`}><i /><i /><i /></span>;
  return <div className={`cs cs-${concept.layout}${concept.serif ? ' cs-serif' : ''}`} style={style} aria-hidden="true">
    {nav}
    {concept.layout === 'split' && <div className="cs-body"><div className="cs-copy"><small>{concept.sector}</small>{title}<span className="cs-line" /><span className="cs-line cs-line-short" /><span className="cs-btn">{concept.kicker}</span></div>{art}</div>}
    {concept.layout === 'center' && <div className="cs-body">{art}<div className="cs-copy"><small>{concept.sector}</small>{title}<span className="cs-btn">{concept.kicker}</span></div><div className="cs-cards"><i /><i /><i /></div></div>}
    {concept.layout === 'shop' && <div className="cs-body"><div className="cs-banner"><div className="cs-copy"><small>{concept.kicker}</small>{title}</div>{art}</div><div className="cs-grid">{[0, 1, 2, 3].map(i => <span key={i}><i /><em /></span>)}</div></div>}
    {concept.layout === 'dash' && <div className="cs-body"><aside><i /><i /><i /><i /><i /></aside><div className="cs-main"><b className="cs-dash-title">{concept.headline}</b><div className="cs-kpis"><i /><i /><i /></div><svg viewBox="0 0 100 34" preserveAspectRatio="none"><polyline points="0,28 12,22 24,25 36,15 48,18 60,9 72,12 84,5 100,8" /></svg></div></div>}
    {concept.layout === 'editorial' && <div className="cs-body"><div className="cs-copy"><small>{concept.sector}</small>{title}</div><div className="cs-strip">{art}<span className="cs-line" /><span className="cs-line cs-line-short" /></div></div>}
  </div>;
}
