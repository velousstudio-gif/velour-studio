# Auditoría Velour Web — 22/10/2026

## Arquitectura encontrada
Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4 + Framer Motion. Sin base de datos ni autenticación. Contenido centralizado en `content/*.ts`. Único backend: `POST /api/contact` → email vía Resend. Tests: `scripts/test-forms.mjs`, `test-theme.mjs`. Requiere hosting Node (Vercel).

## Hallazgos
| # | Sev. | Hallazgo | Estado |
|---|---|---|---|
| 1 | Crítico | `businessConfig.domain` estaba vacío → `siteUrl=localhost`: el sitio salía `noindex`, `robots.txt` con `Disallow: /`, sitemap vacío, canonical/OG a localhost | **Corregido** (`https://velourstudio.online`). Verificar tras el deploy |
| 2 | Crítico | Los leads solo existían como email: si Resend fallaba (clave/dominio/caída) la solicitud se perdía y el visitante veía error | **Corregido**: se guarda primero, el email es aviso |
| 3 | Alto | Sin atribución (UTM, origen, página) ni medición del funnel | **Corregido** (Fase 1) |
| 4 | Medio | Email público `velousstudio@gmail.com` vs `velourstudio@gmail.com` en docs | **Pendiente: confirmar** |
| 5 | Medio | Precio Web Profesional USD 250 (sitio) vs 200 (doc comercial) | **Pendiente: decidir** |
| 6 | Medio | Privacidad dice "sin herramientas de seguimiento" y "se transmite al servicio de recepción"; ahora se guardan leads y se cuentan eventos anónimos | **Pendiente**: actualizar texto legal con tu aprobación |
| 7 | Bajo | `package-lock.json` desincronizado (`npm ci` falla; faltan @emnapi) | Se resolvió con `npm install` local; revisar el lock |
| 8 | Bajo | Formulario de diagnóstico sin checkbox de consentimiento (solo aviso al enviar) | Se registra versión de consentimiento; checkbox en próxima fase |
| 9 | Info | Proyectos del portafolio son conceptos demo (correctamente rotulados) | Fase 3 |

## Arquitectura propuesta
- Público: `/` y rutas actuales, intactas. `/login` y `/crm/*` fuera de sitemap, `noindex`, `Disallow` en robots (ya aplicado).
- Capa de datos `lib/leads/store.ts` con interfaz `LeadStore`. Hoy: archivo JSON local (dev). Producción: **Postgres gestionado con plan gratuito (Neon o Supabase; Vercel no tiene disco persistente)** — a decidir por vos, USD 0 al inicio.
- Auth CRM (Fase 2): usuario admin por variables de entorno/seed seguro, hash argon2id/bcrypt, cookie HttpOnly+Secure+SameSite, guardas en servidor (proxy + cada acción), rate limit, auditoría en tabla.
- Tablas: leads, notes, tasks, activities, users, audit_log, events (agregados).

## Fases
1. **Captación real** (hecho localmente, ver abajo).
2. CRM MVP: `/login`, lista/filtros/ficha, notas, estados, tareas, CSV auditado. Requiere elegir BD.
3. Portafolio real autorizado.
4. SEO/rendimiento/accesibilidad, staging, deploy autorizado.

## Fase 1 implementada
- `app/api/contact`: valida → guarda lead (idempotente por clave) → email (Resend) → éxito si hubo lead o email.
- Lead: estado `nuevo`, origen lógico, UTM, página, referrer (solo dominio), consentimiento versionado, posible duplicado por email.
- `app/api/events` + `FunnelTracker`: conteos anónimos agregados (cta, whatsapp, email, inicio de form, paso, éxito, error). Sin cookies, IP ni PII. El clic en WhatsApp no crea lead.
- Variables: `LEAD_STORE=file` (solo local). Sin ella en producción el comportamiento es el anterior (solo email).

## Pruebas
lint, typecheck, build y `test:forms` (suite previa + 14 aserciones nuevas) pasan; prueba manual con servidor dev: dos envíos con la misma clave → 1 lead.

---
# Fase 2 — Base de datos y CRM privado (implementada en local)

## Decisión: Supabase es compatible
Next.js 16 (App Router) + `@supabase/ssr` + Supabase Auth + Postgres: compatible y gratis para este volumen (Free: 500 MB, 50.000 usuarios/mes, 2 proyectos). Riesgos del plan Free: **pausa tras 1 semana sin actividad** y **sin backups automáticos** (ver `supabase/README.md`).

## Arquitectura
- `supabase/migrations/…_crm_init.sql`: 7 tablas con RLS, triggers de historial, 15 funciones. La misma migración corre en Supabase y en PGlite (Postgres embebido, solo dev/pruebas).
- Intake público: `create_lead` (SECURITY DEFINER, solo `service_role`): idempotente, detecta duplicados (email/teléfono), freno de abuso (5 envíos/hora por email, 200/hora global).
- CRM: toda consulta usa la identidad del usuario (JWT) → RLS. Administrador: todo. Colaborador: solo leads asignados. Historial por triggers (no se puede omitir). Exportación y asignación: solo admin, auditadas en `audit_log`.
- Auth: Supabase Auth (cookies HttpOnly vía `@supabase/ssr`), recuperación por email, `proxy.ts` (verificación optimista + renovación) y verificación real en cada página/acción/ruta. En dev: usuarios locales scrypt + cookie firmada (imposible en producción).
- Rutas: `/login`, `/login/recuperar`, `/login/nueva-clave`, `/auth/callback`, `/crm`, `/crm/leads`, `/crm/leads/[id]`, `/crm/export`.
- Flujo: Nuevo → Contactado → Calificado → Propuesta → Negociación → Ganado/Perdido (+ Archivado).

## Pruebas
`npm run test:crm` (24 pruebas, SQL real con RLS) · `npm run test:forms` (Fase 1 + 14 aserciones) · lint · typecheck · build · recorrido en navegador (26 verificaciones: login, permisos entre usuarios, notas, tareas, CSV, móvil/escritorio).

## Pendiente
Conectar Supabase real (guía en `supabase/README.md`); aprobar `PRIVACIDAD-BORRADOR.md`; confirmar email oficial y precio (referencia interna USD 200; publicado sigue USD 250); probar el correo de recuperación con SMTP real; Kanban, plantillas de email y permisos finos quedan para fases posteriores.
