import Link from 'next/link';
import { requireSession } from '@/lib/auth/session';
import { NewPasswordForm } from '../login-form';
import { Brand } from '../brand';

export const dynamic = 'force-dynamic';

export default async function NewPasswordPage() {
  await requireSession(); // el enlace de recuperación abre una sesión temporal; sin ella no se puede cambiar nada
  return <div className="crm-login-card">
    <Brand />
    <h1>Nueva contraseña</h1>
    <p>Elegí una contraseña larga y única. Mínimo 12 caracteres.</p>
    <NewPasswordForm />
    <div className="crm-login-links"><Link href="/crm">Cancelar</Link></div>
  </div>;
}
