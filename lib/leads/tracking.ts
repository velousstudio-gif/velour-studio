/** Atribución que el navegador adjunta al formulario. Se valida en servidor: nunca confiar en el cliente. */
export type LeadTracking = {
  landingPage: string;
  sourcePage: string;
  referrerHost: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
};

export const EMPTY_TRACKING: LeadTracking = { landingPage: '', sourcePage: '', referrerHost: '', utmSource: '', utmMedium: '', utmCampaign: '', utmContent: '', utmTerm: '' };

const UTM = /^[\p{L}\p{N} ._\-+/|:]{1,100}$/u;
/** Una etiqueta de campaña nunca debe parecer un dato personal: sin @, URLs ni secuencias largas de dígitos. */
const LOOKS_PERSONAL = /@|:\/\/|www\.|\d[\d\s().-]{6,}\d/i;
const PATH = /^\/[\w\-./~%]*$/;
const HOST = /^[a-z\d.-]{1,253}$/i;

/** Solo ruta (sin query ni hash) para no guardar datos accidentales de la URL. */
export function cleanPath(value: unknown): string {
  if (typeof value !== 'string') return '';
  const path = value.split(/[?#]/)[0].slice(0, 200);
  return PATH.test(path) && !LOOKS_PERSONAL.test(path) ? path : '';
}

/** Valores inválidos se descartan en lugar de rechazar el lead: la atribución es opcional. */
export function sanitizeTracking(raw: unknown): LeadTracking {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ...EMPTY_TRACKING };
  const data = raw as Record<string, unknown>;
  const utm = (key: string) => {
    const value = typeof data[key] === 'string' ? (data[key] as string).trim() : '';
    return UTM.test(value) && !LOOKS_PERSONAL.test(value) ? value : '';
  };
  const host = typeof data.referrerHost === 'string' && HOST.test(data.referrerHost) ? data.referrerHost.toLowerCase() : '';
  return {
    landingPage: cleanPath(data.landingPage),
    sourcePage: cleanPath(data.sourcePage),
    referrerHost: host,
    utmSource: utm('utmSource'), utmMedium: utm('utmMedium'), utmCampaign: utm('utmCampaign'),
    utmContent: utm('utmContent'), utmTerm: utm('utmTerm'),
  };
}

/** Origen lógico del lead, derivado solo de lo que el visitante realmente trajo. */
export function leadOrigin(tracking: LeadTracking, ownHost: string): string {
  if (tracking.utmSource) return `campaña:${tracking.utmSource}`;
  if (tracking.referrerHost && tracking.referrerHost !== ownHost) return `referido:${tracking.referrerHost}`;
  return 'directo';
}
