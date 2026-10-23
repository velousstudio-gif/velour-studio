import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Verificación OPTIMISTA y renovación de sesión de Supabase. No es el límite de seguridad:
 * cada página, acción y ruta del CRM vuelve a verificar la sesión en el servidor y la base aplica RLS.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  let response = NextResponse.next({ request });
  let authenticated = false;

  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();
  if (process.env.LEAD_STORE === 'supabase' && url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: list => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, { ...options, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' }));
        },
      },
    });
    authenticated = Boolean((await supabase.auth.getUser()).data.user);
  } else {
    authenticated = request.cookies.has('velour_dev_session');
  }

  if (pathname.startsWith('/crm') && !authenticated) {
    const login = new URL('/login', request.url);
    login.searchParams.set('next', pathname + search);
    response = NextResponse.redirect(login);
  }
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export const config = { matcher: ['/crm/:path*', '/login/:path*', '/auth/:path*'] };
