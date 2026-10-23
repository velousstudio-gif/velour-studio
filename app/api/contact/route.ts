import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getResendConfig, sendInquiry } from '@/lib/resend-mail';
import { validateInquiry } from '@/lib/inquiry';
import { getLeadStore } from '@/lib/leads/store';
import { leadOrigin, sanitizeTracking } from '@/lib/leads/tracking';
import { siteContent } from '@/content/site-content';
import { siteUrl } from '@/lib/site-config';
import { allow, clientIp } from '@/lib/auth/limiter';
import { allowedOrigin } from '@/lib/same-origin';

export const runtime = 'nodejs';

const failure = siteContent.form.messages.failure;
const UUID = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  if (ip && !allow(`contact:${ip}`, 8, 10 * 60_000)) return NextResponse.json({ error: failure }, { status: 429 });
  if (!allowedOrigin(request)) {
    return NextResponse.json({ error: failure }, { status: 403 });
  }
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return NextResponse.json({ error: failure }, { status: 415 });
  }
  let data: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > 16000) return NextResponse.json({ error: failure }, { status: 413 });
    data = JSON.parse(text);
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid payload');
  } catch {
    return NextResponse.json({ error: failure }, { status: 400 });
  }
  const clean = validateInquiry(data);
  if (!clean) return NextResponse.json({ error: failure }, { status: 400 });

  const requestKey = request.headers.get('idempotency-key');
  if (requestKey && !UUID.test(requestKey)) {
    return NextResponse.json({ error: failure }, { status: 400 });
  }
  const key = requestKey || randomUUID();
  const store = getLeadStore();
  const config = getResendConfig();
  if (!store && !config) return NextResponse.json({ error: failure }, { status: 503 });

  // 1) Persistir primero: un fallo del proveedor de email ya no pierde la solicitud.
  let leadId: string | null = null;
  let alreadyNotified = false;
  let storeFailed = false;
  if (store) {
    try {
      const tracking = sanitizeTracking(data.tracking);
      const result = await store.createLead({
        kind: clean.kind, name: clean.name, email: clean.email, phone: clean.phone, company: clean.company,
        serviceType: clean.project, audience: clean.audience, situation: clean.situation, budget: clean.budget,
        questionType: clean.questionType, message: clean.message,
        origin: leadOrigin(tracking, new URL(siteUrl).hostname), tracking, requestKey: key,
      });
      if ('rejected' in result) return NextResponse.json({ error: failure }, { status: 429 });
      leadId = result.id;
      alreadyNotified = !result.created && result.notified;
    } catch (error) {
      storeFailed = true;
      console.error('[contact] No se pudo guardar el lead.', { type: error instanceof Error ? error.name : 'UnknownError' });
    }
  }

  // 2) Aviso por email (Resend), si está configurado.
  let emailed = false;
  if (config && !alreadyNotified) {
    try {
      await sendInquiry(config, clean, `velour-contact/${key}`, { crmSaved: !storeFailed });
      emailed = true;
    } catch (error) {
      // Provider details are logged by sendInquiry, never returned to the browser.
      console.error('[contact] No se completó el envío.', { type: error instanceof Error ? error.name : 'UnknownError' });
    }
  }
  if (store && leadId && !alreadyNotified) {
    await store.setNotification(leadId, !config ? 'sin-configurar' : emailed ? 'enviada' : 'fallida').catch(() => undefined);
  }

  // Éxito solo si la solicitud llegó a algún canal real: CRM o email al equipo. Nunca se informa éxito sin ninguno.
  if (storeFailed && emailed) console.error('[contact] Lead entregado solo por email; falta cargarlo en el CRM.');
  if (leadId || emailed || alreadyNotified) return NextResponse.json({ ok: true });
  return NextResponse.json({ error: failure }, { status: 502 });
}
