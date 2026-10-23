import { NextResponse, type NextRequest } from 'next/server';
import { crmDriver } from '@/lib/crm/config';
import { userClient } from '@/lib/crm/supabase';
import { safeNext } from '@/lib/auth/session';

export const runtime = 'nodejs';

/** Destino de los enlaces de recuperación de Supabase (flujo PKCE): canjea el código y abre una sesión. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNext(searchParams.get('next'), '/login/nueva-clave');
  const fail = NextResponse.redirect(new URL('/login?enlace=invalido', origin));
  if (crmDriver() !== 'supabase' || !code || code.length > 200) return fail;
  const { error } = await (await userClient()).auth.exchangeCodeForSession(code);
  const response = error ? fail : NextResponse.redirect(new URL(next === '/crm' ? '/login/nueva-clave' : next, origin));
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
