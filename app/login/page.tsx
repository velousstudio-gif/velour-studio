import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession, safeNext } from '@/lib/auth/session';
import { Brand } from './brand';
import { LoginForm } from './login-form';

export const dynamic = 'force-dynamic';

const notices: Record<string, string> = {
  expirada: 'Tu sesión expiró. Ingresá de nuevo para continuar.',
  salio: 'Cerraste sesión correctamente.',
  enlace: 'El enlace de recuperación no es válido o ya venció. Pedí uno nuevo.',
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const next = safeNext(Array.isArray(params.next) ? params.next[0] : params.next);
  if (await getSession()) redirect(next);
  const notice = params.expirada ? notices.expirada : params.salio ? notices.salio : params.enlace ? notices.enlace : '';
  return <div className="crm-login-card">
    <Brand />
    <h1>Acceso privado</h1>
    <p>Panel interno de Velour Studio. Solo para el equipo autorizado.</p>
    {notice && <p className="crm-status" data-tone="ok" role="status">{notice}</p>}
    <LoginForm next={next} />
    <div className="crm-login-links"><Link href="/login/recuperar">Olvidé mi contraseña</Link></div>
  </div>;
}
