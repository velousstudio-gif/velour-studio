'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Nav() {
  const path = usePathname();
  const items = [['/crm', 'Panel'], ['/crm/leads', 'Leads']] as const;
  return <nav className="crm-nav" aria-label="CRM">
    {items.map(([href, label]) => <Link key={href} href={href} aria-current={(href === '/crm' ? path === '/crm' : path.startsWith(href)) ? 'page' : undefined}>{label}</Link>)}
  </nav>;
}
