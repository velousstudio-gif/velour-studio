import { ArrowUpRight } from 'lucide-react';
import { concepts } from '@/content/concepts';
import { homeContent } from '@/content/home-content';
import { MotionLink as Link, Reveal } from '../motion';
import { ConceptScreen } from '../concept-screen';

/** Conceptos de diseño (marcas ficticias) en dos cintas 3D que avanzan en sentidos opuestos. */
export function Concepts() {
  const copy = homeContent.concepts;
  const rows = [concepts.slice(0, 25), concepts.slice(25)];
  return <section id="conceptos" className="ix-light ix-concepts" aria-labelledby="concepts-title">
    <Reveal className="container ix-heading-center"><span className="ix-label">{copy.label}</span><h2 id="concepts-title">{copy.title} <span className="ix-gold">{copy.accent}</span></h2><p><strong>{copy.leadStrong}</strong> {copy.lead}</p></Reveal>
    <div className="ix-ribbons" aria-label={copy.ariaLabel}>{rows.map((row, r) => <div key={r} className="ix-ribbon" data-row={r}><div className="ix-ribbon-track">
      {[...row, ...row].map((concept, i) => <Link key={`${concept.slug}-${i}`} href={`/conceptos#${concept.slug}`} className="ix-concept-card" aria-hidden={i >= row.length || undefined} tabIndex={i >= row.length ? -1 : undefined}>
        <span className="ix-concept-screen"><ConceptScreen concept={concept} /></span>
        <span className="ix-concept-meta"><b>{concept.name}</b><small>{concept.sector}</small><em>CONCEPTO</em></span>
      </Link>)}
    </div></div>)}</div>
    <div className="container ix-actions"><Link className="ix-btn ix-btn-gold" href="/conceptos">{copy.cta}<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
  </section>;
}
