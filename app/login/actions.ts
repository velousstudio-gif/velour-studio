'use server';

import { redirect } from 'next/navigation';
import { PASSWORD_MIN, requestRecovery, safeNext, signIn, signOut, updatePassword } from '@/lib/auth/session';

export type FormState = { tone?: 'error' | 'ok'; message?: string };
const text = (data: FormData, key: string, max: number) => String(data.get(key) ?? '').trim().slice(0, max);

export async function loginAction(_: FormState, data: FormData): Promise<FormState> {
  const result = await signIn(text(data, 'email', 254).toLowerCase(), String(data.get('password') ?? '').slice(0, 201));
  if (result === 'limited') return { tone: 'error', message: 'Demasiados intentos. Esperá unos minutos antes de volver a probar.' };
  if (result === 'unavailable') return { tone: 'error', message: 'El acceso no está disponible en este momento.' };
  if (result !== 'ok') return { tone: 'error', message: 'Email o contraseña incorrectos.' }; // mismo mensaje exista o no la cuenta
  redirect(safeNext(data.get('next')));
}

export async function recoveryAction(_: FormState, data: FormData): Promise<FormState> {
  const result = await requestRecovery(text(data, 'email', 254).toLowerCase());
  if (result === 'limited') return { tone: 'error', message: 'Demasiadas solicitudes. Probá de nuevo más tarde.' };
  if (result === 'unavailable') return { tone: 'error', message: 'La recuperación no está disponible en este momento.' };
  return { tone: 'ok', message: 'Si el email corresponde a una cuenta del equipo, te enviamos un enlace para crear una nueva contraseña.' };
}

export async function passwordAction(_: FormState, data: FormData): Promise<FormState> {
  const password = String(data.get('password') ?? '');
  if (password.length < PASSWORD_MIN) return { tone: 'error', message: `Usá al menos ${PASSWORD_MIN} caracteres.` };
  if (password !== String(data.get('confirm') ?? '')) return { tone: 'error', message: 'Las contraseñas no coinciden.' };
  if (!(await updatePassword(password))) return { tone: 'error', message: 'No se pudo actualizar. El enlace pudo haber vencido: pedí uno nuevo.' };
  redirect('/crm?clave=ok');
}

export async function logoutAction() {
  await signOut();
  redirect('/login?salio=1');
}
