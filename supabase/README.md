# Conectar Supabase a Velour Studio (CRM y leads)

Todo está implementado y probado en local. Este documento es lo que **vos** tenés que hacer para conectarlo.
Nada de esto se hizo todavía: no hay proyecto Supabase creado ni datos reales migrados.

## 0. Qué se verificó y qué no
- **Verificado en local:** la migración SQL completa (tablas, RLS, funciones) corre en un Postgres real embebido y pasa 24 pruebas (`npm run test:crm`), más el recorrido en navegador.
- **No verificado todavía:** la conexión con un proyecto Supabase real (requiere tus claves). Por eso el primer paso es un proyecto **de prueba**.

## 1. Costos (plan Free, USD 0) — datos de supabase.com/pricing
- 500 MB de base de datos y 50.000 usuarios activos/mes (sobra: el CRM tiene 2–5 usuarios).
- Hasta 2 proyectos activos.
- **Los proyectos Free se pausan tras 1 semana sin actividad.** Si pasa, el formulario no podrá guardar el lead hasta reactivarlo (un clic en el panel de Supabase). Mientras tanto **el aviso por email (Resend) sigue funcionando**: por eso conviene dejar Resend configurado.
- **Sin backups automáticos en Free.** Usá el botón *Exportar CSV* del CRM (queda auditado) como respaldo periódico. Si el CRM pasa a ser crítico, el plan Pro (USD 25/mes) incluye backups diarios.
- El correo de recuperación de contraseña usa el servicio de email de Supabase, pensado para pruebas y con límites bajos. Para uso real, configurá SMTP propio (Authentication → SMTP Settings; Resend tiene plan gratuito).

## 2. Crear el proyecto (recomendado: uno de prueba primero)
1. supabase.com → *New project*. Nombre `velour-crm-test`, región **South America (São Paulo)**, contraseña de base fuerte (guardala en un gestor).
2. **Authentication → Sign In / Providers → Email**: dejá *Confirm email* activado y **desactivá "Allow new users to sign up"**. (Aun así, quien se registre sin perfil no ve nada.) Subí el largo mínimo de contraseña a 12.
3. **Authentication → URL Configuration**: *Site URL* `https://velourstudio.online`; *Redirect URLs*: `https://velourstudio.online/**` y, para pruebas, `http://localhost:3000/**`.

## 3. Crear las tablas
1. **SQL Editor → New query**, pegá TODO el contenido de `supabase/migrations/20261022000000_crm_init.sql` y ejecutalo (una sola vez).
2. **Authentication → Users → Add user → Create new user**: tu email + contraseña larga, marcá *Auto Confirm User*.
3. En el SQL Editor, ejecutá `supabase/seed-admin.example.sql` cambiando el email. Así te convertís en administrador.
4. Revisá **Database → Tables**: las 7 tablas deben decir *RLS enabled*.

## 4. Variables de entorno (solo servidor)
Project Settings → **API Keys** (o *Data API*):

| Variable | Valor |
|---|---|
| `LEAD_STORE` | `supabase` |
| `SUPABASE_URL` | Project URL (`https://xxxx.supabase.co`) |
| `SUPABASE_PUBLISHABLE_KEY` | clave *publishable* (o `anon` legacy) |
| `SUPABASE_SECRET_KEY` | clave *secret* (o `service_role` legacy) — **máximo secreto** |

- Local: copiá `.env.example` a `.env.local` y completá. Reiniciá `npm run dev`.
- Vercel: Project → Settings → Environment Variables (Production). **Hacelo solo cuando autorices el deploy.**
- La clave secreta nunca lleva `NEXT_PUBLIC_`, no se commitea y el navegador jamás la recibe. Se usa únicamente para guardar leads del formulario público; el CRM usa la sesión de cada usuario.

## 5. Prueba de humo (en el proyecto de prueba)
1. `npm run dev`, enviá el formulario del sitio → debe aparecer el lead en `/crm/leads`.
2. Entrá a `/login` con tu usuario administrador.
3. Probá *Olvidé mi contraseña* (requiere que el email de Supabase llegue; ver costos).
4. Creá un colaborador (paso 3.2 + línea comentada de `seed-admin.example.sql`), asignale un lead y confirmá que solo ve ese.

## 6. Pasar a producción (cuando lo autorices)
Repetí 2–4 en el proyecto definitivo (o reutilizá el de prueba tras limpiar `leads` y tablas hijas). No hay datos reales para migrar: los leads anteriores solo existían como emails.

## Seguridad en una línea
Autorización doble: el servidor verifica sesión en cada página/acción **y** la base aplica RLS con la identidad del usuario. Un colaborador solo ve leads asignados; solo el administrador asigna, exporta y ve auditoría; el historial se escribe con triggers y no se puede omitir.
