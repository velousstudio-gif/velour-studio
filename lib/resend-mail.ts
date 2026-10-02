import 'server-only';
import { Resend } from 'resend';
import { configuredValue, validEmail } from './contact-links';
import type { Inquiry } from './inquiry';

/** Accept a bare mailbox or the display-name format supported by Resend. */
function validSender(value: string): string {
  const sender = configuredValue(value);
  if (sender.length > 320 || /[\r\n]/.test(sender)) return '';
  if (validEmail(sender)) return sender;
  const match = sender.match(/^[^<>]+<([^<>]+)>$/);
  return match && validEmail(match[1]) ? sender : '';
}

// Called inside POST at runtime, never during page rendering or in client code.
export function getResendConfig() {
  const apiKey = configuredValue(process.env.RESEND_API_KEY || '');
  const fromEmail = validSender(process.env.FROM_EMAIL || '');
  const contactEmail = validEmail(process.env.CONTACT_EMAIL || '');
  const invalid = [
    ...(!apiKey || /\s/.test(apiKey) ? ['RESEND_API_KEY'] : []),
    ...(!fromEmail ? ['FROM_EMAIL'] : []),
    ...(!contactEmail ? ['CONTACT_EMAIL'] : []),
  ];
  if (invalid.length) {
    console.error('[contact] Configuración de Resend ausente o inválida.', { variables: invalid });
    return null;
  }
  return { apiKey, fromEmail, contactEmail };
}

export async function sendInquiry(config: NonNullable<ReturnType<typeof getResendConfig>>, inquiry: Inquiry, idempotencyKey: string) {
  // Plain text keeps visitor-supplied markup inert. The visitor is Reply-To, never From.
  const text = [
    'Nueva solicitud de proyecto — Velour Studio', '',
    `Nombre: ${inquiry.name}`, `Empresa: ${inquiry.company || 'No indicada'}`,
    `Email: ${inquiry.email}`, `WhatsApp: ${inquiry.phone || 'No indicado'}`,
    `Tipo de proyecto: ${inquiry.project || 'Consulta general'}`,
    `Presupuesto: ${inquiry.budget || 'Sin definir'}`,
    `Consulta: ${inquiry.kind === 'question' ? inquiry.questionType : 'Diagnóstico de proyecto'}`,
    ...(inquiry.kind === 'project' ? [`Para: ${inquiry.audience}`, `Situación actual: ${inquiry.situation}`] : []),
    '', 'Mensaje:', inquiry.message,
  ].join('\n');
  const resend = new Resend(config.apiKey);
  const { data, error } = await resend.emails.send({
    from: config.fromEmail,
    to: [config.contactEmail],
    replyTo: inquiry.email,
    subject: 'Nueva solicitud de proyecto — Velour Studio',
    text,
  }, { idempotencyKey });

  if (error) {
    console.error('[contact] Resend rechazó el envío. Revisar permisos de la API key, FROM_EMAIL y su dominio verificado.', {
      name: error.name,
      statusCode: error.statusCode,
      message: error.message.replaceAll(config.apiKey, '[redacted]').slice(0, 500),
    });
    throw new Error('Resend rejected the email');
  }
  if (!data?.id) {
    console.error('[contact] Resend devolvió una respuesta sin ID de email.');
    throw new Error('Missing Resend email ID');
  }
  console.info('[contact] Resend aceptó el email.', { emailId: data.id });
}
