import 'server-only';
import { businessConfig } from '@/content/site-content';
import { configuredValue, validEmail } from './contact-links';

export function getResendConfig() {
  const apiKey = configuredValue(process.env.RESEND_API_KEY || '');
  const fromEmail = validEmail(process.env.RESEND_FROM_EMAIL || '');
  const formRecipientEmail = validEmail(process.env.FORM_RECIPIENT_EMAIL?.trim() || businessConfig.formRecipientEmail);
  if (!apiKey.startsWith('re_') || !fromEmail || !formRecipientEmail) return null;
  return { apiKey, fromEmail, formRecipientEmail };
}

type Inquiry = Record<'name' | 'company' | 'email' | 'phone' | 'project' | 'budget' | 'message', string>;

export async function sendInquiry(config: NonNullable<ReturnType<typeof getResendConfig>>, inquiry: Inquiry) {
  // Plain text keeps visitor-supplied markup inert. The visitor is Reply-To, never From.
  const text = [
    'Nueva consulta desde Velour Studio', '',
    `Nombre: ${inquiry.name}`, `Empresa: ${inquiry.company || 'No indicada'}`,
    `Email: ${inquiry.email}`, `WhatsApp: ${inquiry.phone || 'No indicado'}`,
    `Tipo de proyecto: ${inquiry.project}`, `Presupuesto: ${inquiry.budget || 'Sin definir'}`,
    '', 'Mensaje:', inquiry.message,
  ].join('\n');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `Velour Studio <${config.fromEmail}>`,
      to: [config.formRecipientEmail],
      reply_to: inquiry.email,
      subject: 'Nuevo proyecto — Velour Studio', text,
    }),
    signal: AbortSignal.timeout(10000),
    redirect: 'error',
  });
  if (!response.ok) throw new Error('No se pudo aceptar la consulta.');
  const result: unknown = await response.json();
  if (!result || typeof result !== 'object' || !('id' in result) || typeof result.id !== 'string' || !result.id) {
    throw new Error('Respuesta de envío no válida.');
  }
}
