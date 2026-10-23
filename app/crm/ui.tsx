import Link from 'next/link';
import { STATUS_LABEL, type LeadStatus } from '@/lib/crm/types';

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <span className="crm-badge" data-status={status}>{STATUS_LABEL[status] ?? status}</span>;
}

export function Banner({ code }: { code?: string }) {
  const messages: Record<string, string> = {
    permiso: 'No tenés permiso para esa acción.', noexiste: 'El lead no existe o no tenés acceso.',
    invalido: 'Revisá los datos ingresados.', error: 'No se pudo completar la acción. Probá de nuevo.',
    clave: 'Contraseña actualizada.',
  };
  if (!code || !messages[code]) return null;
  return <p className="crm-banner" data-tone={code === 'clave' ? 'ok' : 'error'} role="status">{messages[code]}</p>;
}

export function Pager({ page, pages, href }: { page: number; pages: number; href: (page: number) => string }) {
  if (pages <= 1) return null;
  return <nav className="crm-pager" aria-label="Paginación">
    {page > 1 ? <Link className="button button-quiet" href={href(page - 1)}>← Anterior</Link> : <span />}
    <span className="crm-muted">Página {page} de {pages}</span>
    {page < pages ? <Link className="button button-quiet" href={href(page + 1)}>Siguiente →</Link> : <span />}
  </nav>;
}
