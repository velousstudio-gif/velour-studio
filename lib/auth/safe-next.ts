/** Solo rutas internas: evita redirecciones abiertas tras el login. */
export function safeNext(value: unknown, fallback = '/crm'): string {
  return typeof value === 'string' && /^\/(?!\/)[\w\-./?=&%]*$/.test(value) && !value.startsWith('/login') ? value : fallback;
}
