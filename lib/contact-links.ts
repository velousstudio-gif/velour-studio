/** Public contact values are validated before becoming links. */
export function configuredValue(value: string): string {
  const clean = value.trim();
  return /^(TU_|PENDIENTE|POR_DEFINIR)/i.test(clean) ? '' : clean;
}

export function externalUrl(value: string): string {
  const clean = configuredValue(value);
  if (!clean) return '';
  try {
    const url = new URL(clean);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}

export function validEmail(value: string): string {
  const candidate = configuredValue(value);
  return candidate.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(candidate) && !/[\r\n?&#]/.test(candidate) ? candidate : '';
}

export function contactLinks(raw: { email: string; whatsapp: string; whatsappDisplay?: string; instagram: string; linkedin: string; whatsappMessage: string; address: string; showAddress: boolean }) {
  const email = validEmail(raw.email);
  const phone = configuredValue(raw.whatsapp).replace(/[\s()+.-]/g, '');
  const whatsapp = /^\d{7,15}$/.test(phone) ? phone : '';
  return {
    email, whatsapp,
    whatsappDisplay: whatsapp ? configuredValue(raw.whatsappDisplay || '') || whatsapp : '',
    instagram: externalUrl(raw.instagram), linkedin: externalUrl(raw.linkedin),
    emailHref: email ? `mailto:${email}` : '',
    whatsappHref: whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(raw.whatsappMessage)}` : '',
    address: raw.showAddress ? configuredValue(raw.address) : '',
  };
}
