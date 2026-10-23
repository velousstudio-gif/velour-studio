import 'server-only';

/**
 * Limitador en memoria (por instancia del servidor). Es una capa extra: el freno que vale entre instancias
 * está en la base de datos (create_lead) y en Supabase Auth. No guarda datos personales: solo contadores efímeros.
 */
const buckets = new Map<string, { count: number; reset: number }>();

export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
  const bucket = buckets.get(key);
  if (!bucket || bucket.reset < now) { buckets.set(key, { count: 1, reset: now + windowMs }); return true; }
  bucket.count += 1;
  return bucket.count <= limit;
}

/** IP del visitante según el proxy de la plataforma. Vacío en local: sin IP no se limita. */
export function clientIp(headers: Headers): string {
  return (headers.get('x-forwarded-for') || '').split(',')[0].trim().slice(0, 64);
}

export function resetLimiterForTests() { buckets.clear(); }
