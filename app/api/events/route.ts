import { getLeadStore, EVENT_NAMES, type EventName } from '@/lib/leads/store';
import { cleanPath } from '@/lib/leads/tracking';
import { allow, clientIp } from '@/lib/auth/limiter';
import { allowedOrigin } from '@/lib/same-origin';

export const runtime = 'nodejs';

/** Medición mínima del funnel: conteos anónimos agregados por día. No guarda IP, cookies ni datos personales. */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  if (ip && !allow(`events:${ip}`, 120, 10 * 60_000)) return new Response(null, { status: 429 });
  if (!allowedOrigin(request)) return new Response(null, { status: 403 });
  let data: unknown;
  try {
    const text = await request.text();
    if (text.length > 1000) return new Response(null, { status: 413 });
    data = JSON.parse(text);
  } catch { return new Response(null, { status: 400 }); }
  const { event, page } = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;
  if (typeof event !== 'string' || !EVENT_NAMES.includes(event as EventName)) return new Response(null, { status: 400 });
  const store = getLeadStore();
  if (store) await store.countEvent(event as EventName, cleanPath(page)).catch(() => undefined);
  return new Response(null, { status: 204 });
}
