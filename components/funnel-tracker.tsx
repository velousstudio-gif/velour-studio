'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { captureAttribution, track } from '@/lib/funnel';

/** Un único listener para todos los CTA existentes: no hace falta tocar cada enlace. */
export function FunnelTracker() {
  const pathname = usePathname();
  const internal = pathname.startsWith('/crm') || pathname.startsWith('/login');
  useEffect(() => {
    if (internal) return; // el panel privado no genera eventos de conversión
    captureAttribution();
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (href.startsWith('https://wa.me/')) track('whatsapp_click');
      else if (href.startsWith('mailto:')) track('email_click');
      else if (href.includes('#project-form')) track('cta_click');
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, [internal]);
  return null;
}
