import 'server-only';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { clientWorks, type ClientWork } from '@/content/portfolio';

/**
 * Trabajos de clientes visibles.
 *  - Producción: solo los autorizados de content/portfolio.ts.
 *  - `npm run dev`: además, los pendientes de content/clientes-pendientes.local.json (archivo local, ignorado por Git),
 *    marcados como vista previa. Nunca forman parte del build público.
 */
export function pendingClientWorks(): ClientWork[] {
  if (process.env.NODE_ENV !== 'development') return [];
  const file = process.env.PORTFOLIO_PENDING_FILE || path.join(/*turbopackIgnore: true*/ process.cwd(), 'content/clientes-pendientes.local.json');
  if (!existsSync(file)) return [];
  try {
    const items = JSON.parse(readFileSync(file, 'utf8')) as ClientWork[];
    return Array.isArray(items) ? items.map(item => ({ ...item, authorized: false })) : [];
  } catch { return []; }
}

export function visibleClientWorks(): ClientWork[] {
  const authorized = clientWorks.filter(work => work.authorized);
  return [...authorized, ...pendingClientWorks().filter(work => !authorized.some(a => a.slug === work.slug))];
}
