import 'server-only';

export type Driver = 'supabase' | 'pglite' | 'file';

/** Los drivers locales (archivo JSON / PGlite) existen solo para desarrollo y pruebas. */
export function localStorageAllowed(): boolean {
  if (process.env.VERCEL) return false;
  return process.env.NODE_ENV !== 'production' || process.env.ALLOW_LOCAL_STORE === '1';
}

export function driver(): Driver | null {
  const raw = process.env.LEAD_STORE || (process.env.NODE_ENV === 'development' ? 'file' : '');
  if (raw === 'supabase') return supabaseConfig() ? 'supabase' : null;
  if ((raw === 'pglite' || raw === 'file') && localStorageAllowed()) return raw;
  return null;
}

/** Solo servidor. La clave secreta jamás llega al navegador. */
export function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.trim();
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();
  return url && publishableKey && secretKey && /^https:\/\/[\w-]+\.supabase\.co\/?$/.test(url) ? { url, publishableKey, secretKey } : null;
}

/** El CRM necesita base de datos relacional + autenticación. */
export const crmDriver = (): 'supabase' | 'pglite' | null => {
  const current = driver();
  return current === 'supabase' || current === 'pglite' ? current : null;
};
