import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getResendConfig, sendInquiry } from '@/lib/resend-mail';
import { validateInquiry } from '@/lib/inquiry';
import { siteContent } from '@/content/site-content';
import { siteUrl } from '@/lib/site-config';

export const runtime = 'nodejs';

const failure = siteContent.form.messages.failure;

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin && origin !== siteUrl) {
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
  if (requestKey && !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(requestKey)) {
    return NextResponse.json({ error: failure }, { status: 400 });
  }
  const config = getResendConfig();
  if (!config) return NextResponse.json({ error: failure }, { status: 503 });

  try {
    await sendInquiry(config, clean, `velour-contact/${requestKey || randomUUID()}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    // Provider details are logged by sendInquiry, never returned to the browser.
    console.error('[contact] No se completó el envío.', { type: error instanceof Error ? error.name : 'UnknownError' });
    return NextResponse.json({ error: failure }, { status: 502 });
  }
}
