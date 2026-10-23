import Link from 'next/link';
import { RecoveryForm } from '../login-form';
import { Brand } from '../brand';

export default function RecoverPage() {
  return <div className="crm-login-card">
    <Brand />
    <h1>Recuperar acceso</h1>
    <p>Te enviaremos un enlace seguro para crear una nueva contraseña.</p>
    <RecoveryForm />
    <div className="crm-login-links"><Link href="/login">Volver al acceso</Link></div>
  </div>;
}
