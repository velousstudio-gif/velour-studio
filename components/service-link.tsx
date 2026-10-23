'use client';

import type { ReactNode } from 'react';
import { serviceHref, type ServiceType } from '@/content/portfolio';

export const SERVICE_EVENT = 'velour:servicio';

/**
 * CTA que lleva al diagnóstico con el tipo de proyecto ya elegido.
 * En la home no recarga: actualiza la URL, avisa al formulario y desplaza la vista. Fuera de la home navega normalmente.
 * Sin JavaScript también funciona: el formulario lee ?servicio= al cargar.
 * El clic se mide una sola vez en FunnelTracker (enlaces a #project-form).
 */
export function ServiceLink({ service, className, children, label }: { service: ServiceType; className?: string; children: ReactNode; label?: string }) {
  const href = serviceHref(service);
  return <a href={href} className={className} aria-label={label} onClick={event => {
    if (window.location.pathname !== '/' || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    window.history.replaceState(window.history.state, '', href);
    window.dispatchEvent(new CustomEvent(SERVICE_EVENT, { detail: service }));
    const target = document.getElementById('project-form');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }}>{children}</a>;
}
