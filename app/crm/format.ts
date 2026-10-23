const TZ = 'America/Argentina/Buenos_Aires';
/** Una fecha sola (YYYY-MM-DD) es un día calendario: se fija al mediodía para que la zona horaria no la corra al día anterior. */
const asDate = (iso: string) => new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T12:00:00-03:00` : iso);
export const fmtDate = (iso: string | null | undefined) => iso ? new Intl.DateTimeFormat('es-AR', { timeZone: TZ, day: '2-digit', month: 'short', year: 'numeric' }).format(asDate(iso)) : '—';
export const fmtDateTime = (iso: string | null | undefined) => iso ? new Intl.DateTimeFormat('es-AR', { timeZone: TZ, day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : '—';
/** Fecha calendario de hoy en Argentina (YYYY-MM-DD). */
export const todayAr = (offsetDays = 0) => new Date(Date.now() + offsetDays * 86400_000).toLocaleDateString('en-CA', { timeZone: TZ });
/** Una fecha elegida (YYYY-MM-DD) vence al final de ese día, hora Argentina (UTC-3 todo el año). */
export const dueFromDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) ? `${date}T23:59:00-03:00` : null;
export const whatsappLink = (phone: string) => { const d = phone.replace(/\D/g, ''); return d.length >= 8 && d.length <= 15 ? `https://wa.me/${d}` : ''; };
