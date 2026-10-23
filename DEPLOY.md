# Despliegue de velourstudio.online — procedimiento

> **No desplegar sin autorización expresa del titular.** Cada paso indica quién lo hace.
> Plataforma: Vercel (sitio + funciones). Datos: Supabase (`aehzdbzorksfdilzvwrf`, Free, us-east-1). Email: Resend.

## 0. Requisitos previos (una sola vez)
| # | Qué | Dónde | Quién |
|---|-----|-------|-------|
| 1 | Migraciones aplicadas: `20261022000000_crm_init.sql` y `20261023000000_crm_backup.sql` | Supabase → SQL Editor | ✅ Hecho (23-10-2026) |
| 2 | Variables de entorno de **Production** (tabla de abajo) | Vercel → Project → Settings → Environment Variables | Titular (pega los secretos) |
| 3 | Auth: Site URL `https://velourstudio.online`; Redirect URLs `https://velourstudio.online/**` (y `http://localhost:3000/**` para trabajar en local) | Supabase → Authentication → URL Configuration | Claude prepara / titular aprueba |
| 4 | SMTP propio (Resend) para recuperar contraseñas | Integración oficial Resend → Supabase; remitente `acceso@velourstudio.online`; plantilla en español | ✅ Hecho y probado (entregado) |
| 5 | Política de privacidad v2 aprobada (`content/privacy-policy.ts` → `approved: true`) y `CONSENT_VERSION` actualizado | Código | Titular aprueba |

### Variables de entorno (Production)
| Variable | Valor | Secreto |
|---|---|---|
| `LEAD_STORE` | `supabase` | no |
| `SUPABASE_URL` | `https://aehzdbzorksfdilzvwrf.supabase.co` | no |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API Keys → Publishable | no |
| `SUPABASE_SECRET_KEY` | Supabase → Settings → API Keys → Secret | **sí** (marcar *Sensitive*) |
| `RESEND_API_KEY` | Resend → API Keys (permiso *Sending access*) | **sí** (marcar *Sensitive*) |
| `FROM_EMAIL` | `Velour Studio <avisos@velourstudio.online>` (dominio verificado en Resend el 23-10-2026). Revisar el valor actual en Vercel: debe ser de velourstudio.online | no |
| `CONTACT_EMAIL` | casilla que recibe los avisos de cada consulta | no |

**No definir en Production:** `DEV_*`, `ALLOW_LOCAL_STORE`, `LEAD_STORE_PATH`, `DEV_DB_DIR`, ni ninguna variable `NEXT_PUBLIC_` con claves.
Si `LEAD_STORE` falta, el sitio funciona igual que hoy (solo email) y el CRM queda deshabilitado.

### Estado verificado el 23-10-2026
- Dominio `velourstudio.online` verificado en Resend (DNS en Replit: TXT `resend._domainkey`, CNAME `send`, CNAME `rsend`). No se agregó MX de recepción.
- Vercel: proyecto `velour-studio` conectado al repositorio de GitHub (despliega Production desde la rama principal; otras ramas generan vistas previas).
- Variables actuales en Vercel Production: solo `RESEND_API_KEY`, `FROM_EMAIL`, `CONTACT_EMAIL` → faltan las de Supabase.

## 1. Antes de desplegar (Claude, en local)
```
npm ci
npm run lint && npm run typecheck
npm run test:forms && npm run test:crm && npm run test:theme
npm run build
npm run check:build        # sin trabajos pendientes ni secretos en el build público
npm run check:supabase     # proyecto activo, migraciones y admin presentes
```
Además: descargar **Respaldo completo** desde el CRM (Leads → Respaldo completo) y guardarlo fuera del repositorio.

## 2. Desplegar (con autorización)
1. Anotar el deployment de Production actual en Vercel → Deployments (es el punto de rollback).
2. Publicar el código en la rama que despliega Production (o `vercel deploy --prod` si se usa la CLI).
3. Esperar el estado **Ready** en Vercel.

## 3. Verificación inmediata (≈5 minutos)
```
npm run check:prod -- https://velourstudio.online
```
Comprueba: home y secciones, cabeceras de seguridad, `/crm` y descargas protegidas, `/api/contact` cerrado a otros sitios,
trabajos pendientes ocultos (404 y fuera del sitemap), robots y privacidad. No crea datos.

Luego, manual (titular + Claude):
1. Enviar **una** consulta de prueba desde el formulario real (nombre `PRUEBA LANZAMIENTO`, email de prueba).
2. Verificar que llega el aviso por email y que aparece en `/crm`; cambiar estado y agregar una nota.
3. Probar "Olvidé mi contraseña" con la cuenta admin (debe llegar el correo de Resend).
4. Borrar la consulta de prueba (SQL acotado por nombre/email; ver `supabase/BACKUP.md`).

## 4. Rollback (si algo falla)
| Situación | Acción | Tiempo |
|---|---|---|
| Error visible en el sitio | Vercel → Deployments → deployment anterior → **Instant Rollback** (o *Promote to Production*) | < 1 min |
| El CRM o el guardado fallan pero el sitio está bien | Quitar `LEAD_STORE` en Vercel y redeploy: el formulario vuelve a funcionar solo por email | ~2 min |
| Problema con datos | Restaurar el último respaldo con `npm run restore:backup` (ver `supabase/BACKUP.md`) | ~10 min |
Las migraciones de esta fase son aditivas: el código anterior sigue funcionando con la base nueva, así que el rollback del sitio no requiere tocar Supabase.

## 5. Después del lanzamiento
- Semanal: descargar el respaldo completo desde el CRM.
- Revisar en Supabase → Usage que el proyecto no se acerque a los límites del plan Free.
- Si Supabase avisa por email de una pausa por inactividad: entrar al panel y tocar *Resume project*.
