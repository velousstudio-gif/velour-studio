# Configuración del formulario con Resend

## Variables privadas

Copiar `.env.example` a `.env.local` para desarrollo. En Vercel, configurar los mismos nombres en **Settings → Environment Variables**, en el entorno de despliegue correspondiente:

```dotenv
RESEND_API_KEY=
FROM_EMAIL=
CONTACT_EMAIL=
```

- `RESEND_API_KEY`: API key de Resend con permiso para enviar desde el dominio elegido. Nunca usar el prefijo `NEXT_PUBLIC_`, incluirla en contenido público ni subir `.env.local` a Git.
- `FROM_EMAIL`: remitente autorizado en Resend. Admite una dirección sola o `Velour Studio <dirección>`. Se utiliza exactamente ese valor, sin añadir otro nombre. El dominio debe estar verificado en la misma cuenta de Resend y autorizado para esa API key.
- `CONTACT_EMAIL`: buzón donde recibir las consultas. Puede ser Gmail. Es privado y se lee exclusivamente en el servidor; no usa el email público como fallback.

Los nombres anteriores `RESEND_FROM_EMAIL` y `FORM_RECIPIENT_EMAIL` ya no se utilizan. Tampoco existe un destinatario del formulario en `businessConfig`: los datos públicos de contacto siguen centralizados en `content/site-content.ts`.

Después de cambiar código o variables en Vercel, crear un **nuevo deployment / Redeploy**. En local, reiniciar el proceso de Next.js. La configuración se lee al recibir cada POST; la página estática ya no decide si permite enviar.

## Verificar FROM_EMAIL

1. Confirmar que el dominio exacto del remitente figura como **Verified** en Resend → Domains y tiene habilitado el envío.
2. Confirmar que la API key pertenece a esa cuenta y permite enviar desde ese dominio.
3. No usar una dirección `@gmail.com` como FROM_EMAIL: el dominio Gmail no es propio y no puede verificarse. Sí puede usarse en CONTACT_EMAIL o Reply-To.
4. Si todavía no hay un dominio propio, `onboarding@resend.dev` permite **pruebas solo al email asociado a la cuenta de Resend**. CONTACT_EMAIL debe coincidir con ese email. Esta restricción la aplica Resend; no se sustituye automáticamente el remitente.
5. Tras desplegar, enviar una consulta de prueba y revisar su estado en Resend → Emails y el buzón receptor. Un ID confirma aceptación, no garantiza entrega al inbox.

Documentación oficial: [dominios verificados](https://resend.com/docs/dashboard/domains/introduction), [restricciones de resend.dev](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain) y [SDK oficial Node.js](https://github.com/resend/resend-node).

## Archivos y comportamiento

- `app/api/contact/route.ts`: POST `/api/contact`, runtime Node.js, origen permitido, JSON limitado, honeypot y validación del servidor.
- `lib/inquiry.ts`: valida tipos, campos obligatorios, longitudes, email y opciones de proyecto contra el contenido central.
- `lib/resend-mail.ts`: módulo `server-only`, lectura de variables en runtime y SDK oficial `resend` mediante `resend.emails.send`.
- `components/contact-form.tsx`: los formularios de pregunta y diagnóstico hacen POST real, muestran `Enviando...`, deshabilitan el envío y conservan todo si falla.

El correo usa FROM_EMAIL como `from`, CONTACT_EMAIL como `to` y el email del visitante como `replyTo`. Asunto: **Nueva solicitud de proyecto — Velour Studio**. Incluye nombre, empresa, email, WhatsApp, tipo de proyecto, presupuesto y mensaje; el diagnóstico añade audiencia y situación. Los campos ausentes de la consulta breve se indican como no definidos. Se envía texto plano para que el contenido introducido por visitantes no ejecute HTML.

El bloqueo sincrónico evita doble submit y la clave de idempotencia de Resend evita duplicar el correo al reintentar la misma solicitud tras un error de red. Solo se confirma éxito cuando Resend devuelve un ID. Los errores del proveedor se registran en el servidor con nombre, código y mensaje; nunca se devuelve la API key ni el error interno al navegador.

## Comprobaciones

```sh
npm install
npm run lint
npm run test:forms
npm run build
```

`test:forms` ejecuta el endpoint y el SDK instalado con transporte HTTP simulado, sin cargar credenciales ni enviar emails. Comprueba validación, configuración, payload, idempotencia y errores. Para probar envíos reales localmente, completar `.env.local`, reiniciar Next.js y enviar desde la web.
