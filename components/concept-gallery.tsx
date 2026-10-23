'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Concept } from '@/content/concepts';
import { ConceptScreen } from './concept-screen';
import { ServiceLink } from './service-link';
import { Tilt3D } from './fx';
import { useDict } from './locale';

/** Grilla filtrable de conceptos. Cada tarjeta lleva al diagnóstico con el servicio sugerido. */
export function ConceptGallery({ concepts, groups }: { concepts: Concept[]; groups: { value: string; label: string }[] }) {
  const t = useDict().ui.concepts;
  const [group, setGroup] = useState('');
  const list = group === '' ? concepts : concepts.filter(concept => concept.group === group);
  return <>
    <div className="ix-filters" role="group" aria-label={t.filter}>{[{ value: '', label: t.all }, ...groups].map(item => <button key={item.value || 'all'} type="button" aria-pressed={group === item.value} onClick={() => setGroup(item.value)}>{item.label}</button>)}</div>
    <p className="ix-filter-count" aria-live="polite">{list.length} {t.count}</p>
    <ul className="ix-concept-grid">{list.map(concept => <li key={concept.slug} id={concept.slug}>
      <Tilt3D max={7} className="ix-concept-tilt"><article className="ix-concept-item">
        <div className="ix-concept-screen"><ConceptScreen concept={concept} /></div>
        <div className="ix-concept-info"><span className="ix-concept-badge">{t.badge}</span><h2>{concept.name}</h2><p>{concept.sector}</p>
          <ServiceLink service={concept.service} className="ix-text-link">{t.want}<ArrowUpRight size={15} aria-hidden="true" /></ServiceLink></div>
      </article></Tilt3D>
    </li>)}</ul>
  </>;
}
