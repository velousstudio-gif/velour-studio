import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseConfig } from './config';
import { toCrmError, type Rpc } from './dev-db';

/** Un proyecto pausado o caído no debe colgar el formulario: corta a los 8 s. */
const withTimeout: typeof fetch = (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(8000) });

let service: SupabaseClient | undefined;

/** Cliente con clave secreta: SOLO funciones de intake (create_lead, count_event). Nunca para el CRM. */
export function serviceClient(): SupabaseClient {
  const config = supabaseConfig();
  if (!config) throw new Error('Supabase no está configurado.');
  return (service ??= createClient(config.url, config.secretKey, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: withTimeout } }));
}

/** Cookies de sesión siempre HttpOnly: el navegador nunca habla con Supabase ni lee los tokens. */
export function hardenCookie(options: CookieOptions = {}): CookieOptions {
  return { ...options, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' };
}

/** Cliente con la sesión del usuario (JWT en cookie). RLS se evalúa con su identidad. */
export async function userClient(): Promise<SupabaseClient> {
  const config = supabaseConfig();
  if (!config) throw new Error('Supabase no está configurado.');
  const jar = await cookies();
  return createServerClient(config.url, config.publishableKey, {
    global: { fetch: withTimeout },
    cookies: {
      getAll: () => jar.getAll(),
      setAll: list => {
        // En Server Components no se pueden escribir cookies; el proxy ya refrescó la sesión.
        try { list.forEach(({ name, value, options }) => jar.set(name, value, hardenCookie(options))); } catch { /* lectura */ }
      },
    },
  });
}

export function supabaseRpc(client: SupabaseClient): Rpc {
  return async <T,>(fn: string, payload: Record<string, unknown> = {}) => {
    const { data, error } = await client.rpc(fn, { p: payload });
    if (error) throw toCrmError(error.message);
    return data as T;
  };
}
