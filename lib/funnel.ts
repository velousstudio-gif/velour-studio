'use client';

import type { EventName } from './leads/store';
import { EMPTY_TRACKING, type LeadTracking } from './leads/tracking';

const KEY = 'velour-attribution';

const read = (): LeadTracking | null => {
  try { const raw = window.sessionStorage.getItem(KEY); return raw ? { ...EMPTY_TRACKING, ...JSON.parse(raw) } : null; }
  catch { return null; }
};

/** Primer contacto de la sesión: página de llegada, dominio de referencia y UTMs (si existen). Sin cookies. */
export function captureAttribution() {
  if (read()) return;
  const params = new URLSearchParams(window.location.search);
  let referrerHost = '';
  try { referrerHost = document.referrer ? new URL(document.referrer).hostname : ''; } catch { /* sin referrer */ }
  const value: LeadTracking = {
    ...EMPTY_TRACKING,
    landingPage: window.location.pathname,
    referrerHost: referrerHost === window.location.hostname ? '' : referrerHost,
    utmSource: params.get('utm_source') || '', utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '', utmContent: params.get('utm_content') || '', utmTerm: params.get('utm_term') || '',
  };
  try { window.sessionStorage.setItem(KEY, JSON.stringify(value)); } catch { /* el formulario funciona igual */ }
}

export function currentAttribution(): LeadTracking {
  return { ...(read() ?? EMPTY_TRACKING), sourcePage: window.location.pathname };
}

export function track(event: EventName) {
  const body = JSON.stringify({ event, page: window.location.pathname });
  try {
    if (navigator.sendBeacon?.('/api/events', new Blob([body], { type: 'application/json' }))) return;
    void fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => undefined);
  } catch { /* la medición nunca bloquea la navegación */ }
}
