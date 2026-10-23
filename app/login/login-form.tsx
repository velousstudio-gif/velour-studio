'use client';

import { useActionState } from 'react';
import { ArrowUpRight, LoaderCircle } from 'lucide-react';
import { loginAction, passwordAction, recoveryAction, type FormState } from './actions';

const initial: FormState = {};

function Status({ state }: { state: FormState }) {
  return <div role="status" aria-live="polite">{state.message && <p className="crm-status" data-tone={state.tone}>{state.message}</p>}</div>;
}
function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return <button className="button" type="submit" disabled={pending}>{pending ? <LoaderCircle className="spin" size={16} aria-hidden="true" /> : null}{children}{!pending && <ArrowUpRight size={16} aria-hidden="true" />}</button>;
}

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, initial);
  return <form action={action} noValidate>
    <Status state={state} />
    <input type="hidden" name="next" value={next} />
    <label className="crm-field"><span>Email</span><input name="email" type="email" autoComplete="username" required maxLength={254} /></label>
    <label className="crm-field"><span>Contraseña</span><input name="password" type="password" autoComplete="current-password" required maxLength={200} /></label>
    <Submit pending={pending}>Ingresar</Submit>
  </form>;
}

export function RecoveryForm() {
  const [state, action, pending] = useActionState(recoveryAction, initial);
  return <form action={action}>
    <Status state={state} />
    <label className="crm-field"><span>Email de tu cuenta</span><input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    <Submit pending={pending}>Enviar enlace</Submit>
  </form>;
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState(passwordAction, initial);
  return <form action={action}>
    <Status state={state} />
    <label className="crm-field"><span>Nueva contraseña (mínimo 12 caracteres)</span><input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={200} /></label>
    <label className="crm-field"><span>Repetir contraseña</span><input name="confirm" type="password" autoComplete="new-password" required minLength={12} maxLength={200} /></label>
    <Submit pending={pending}>Guardar contraseña</Submit>
  </form>;
}
