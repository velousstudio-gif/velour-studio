import type { Metadata } from 'next';
import Link from 'next/link';
import { requireSession } from '@/lib/auth/session';
import { ThemeSelector } from '@/components/theme-selector';
import { logoutAction } from '../login/actions';
import './crm.css';
import { Nav } from './nav';

export const metadata: Metadata = { title: 'CRM', robots: { index: false, follow: false, nocache: true } };
export const dynamic = 'force-dynamic';

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  return <div className="crm-root">
    <header className="crm-header"><div className="crm-header-inner">
      <Link className="crm-brand" href="/crm" aria-label="Velour Studio CRM"><b>VELOUR</b><small>STUDIO · CRM</small></Link>
      <Nav />
      <div className="crm-user">
        <ThemeSelector placement="header" />
        <span>{session.name}<small>{session.role === 'admin' ? 'Administrador' : 'Colaborador'}</small></span>
        <Link className="crm-link-btn" href="/login/nueva-clave">Contraseña</Link>
        <form action={logoutAction}><button className="crm-link-btn" type="submit">Salir</button></form>
      </div>
    </div></header>
    <main className="crm-main" id="contenido">{children}</main>
  </div>;
}
