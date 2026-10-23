import { siteUrl } from './site-config';

/**
 * Anti-CSRF: el Origin del navegador debe coincidir con el host al que llegó la petición (o con el dominio público).
 * Se compara contra el header Host porque request.url puede reflejar la dirección de escucha (p. ej. 0.0.0.0 en desarrollo).
 */
export function allowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  if (origin === siteUrl || origin === new URL(request.url).origin) return true;
  let originHost: string;
  try { originHost = new URL(origin).host; } catch { return false; }
  const host = request.headers.get('x-forwarded-host')?.split(',')[0].trim() || request.headers.get('host') || '';
  return !!host && originHost === host;
}
