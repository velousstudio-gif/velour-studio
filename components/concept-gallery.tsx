'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Concept } from '@/content/concepts';
import { ConceptScreen } from './concept-screen';
import { ServiceLink } from './service-link';
import { Tilt3D } from './fx';

/** Grilla filtrable de conceptos. Cada tarjeta lleva al diagnóstico con el servicio sugerido. */
export function ConceptGallery({ concepts, groups }: { concepts: Concept[]; groups: string[] }) {
  const [group, setGroup] = useState('Todos');
  const list = group === 'Todos' ? concepts : concepts.filter(concept => concept.group === group);
  return <>
    <div className="ix-filters" role="group" aria-label="Filtrar por rubro">{['Todos', ...groups].map(name => <button key={name} type="button" aria-pressed={group === name} onClick={() => setGroup(name)}>{name}</button>)}</div>
    <p className="ix-filter-count" aria-live="polite">{list.length} conceptos</p>
    <ul className="ix-concept-grid">{list.map(concept => <li key={concept.slug} id={concept.slug}>
      <Tilt3D max={7} className="ix-concept-tilt"><article className="ix-concept-item">
        <div className="ix-concept-screen"><ConceptScreen concept={concept} /></div>
        <div className="ix-concept-info"><span className="ix-concept-badge">CONCEPTO</span><h2>{concept.name}</h2><p>{concept.sector}</p>
          <ServiceLink service={concept.service} className="ix-text-link">QUIERO ALGO ASÍ<ArrowUpRight size={15} aria-hidden="true" /></ServiceLink></div>
      </article></Tilt3D>
    </li>)}</ul>
  </>;
}
