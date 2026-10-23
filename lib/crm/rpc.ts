import 'server-only';
import { crmDriver, driver } from './config';
import { devRpc, type Rpc } from './dev-db';
import { serviceClient, supabaseRpc, userClient } from './supabase';
import { CrmError, type Session } from './types';

/** Rol de servicio: únicamente para el intake público y el conteo de eventos. */
export function serviceRpc(): Rpc | null {
  const current = driver();
  if (current === 'supabase') return supabaseRpc(serviceClient());
  if (current === 'pglite') return devRpc({ role: 'service_role' });
  return null;
}

/** Identidad del usuario autenticado: toda lectura/escritura del CRM pasa por RLS con esta identidad. */
export async function userRpc(session: Pick<Session, 'userId'>): Promise<Rpc> {
  const current = crmDriver();
  if (current === 'supabase') return supabaseRpc(await userClient());
  if (current === 'pglite') return devRpc({ role: 'authenticated', sub: session.userId });
  throw new CrmError('unavailable', 'CRM no configurado');
}
