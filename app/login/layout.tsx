import type { Metadata } from 'next';
import '../crm/crm.css';

export const metadata: Metadata = { title: 'Acceso privado', robots: { index: false, follow: false, nocache: true } };

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="crm-login crm-root">{children}</div>;
}
