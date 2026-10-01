# Configuración real y Resend

## Datos del negocio

Editar `businessConfig` al principio de `content/site-content.ts`:

| Variable | Valor que hay que completar |
| --- | --- |
| `publicEmail` | Email visible al público, sin el prefijo mailto:. |
| `whatsappNumber` | Número internacional con código de país; admite +, espacios y guiones. |
| `instagramUrl` | URL completa del perfil oficial con https://. |
| `linkedinUrl` | URL completa del perfil oficial con https://. |
| `domain` | URL pública completa con https://; se usa su origen para metadata, Open Graph, canónicas y sitemap. |
| `legalBusinessName` | Nombre legal o razón social reales. Se usa como publisher en metadata si está completo; aprobar aparte los textos legales. |
| `formRecipientEmail` | Buzón receptor del formulario, opcional aquí. Preferible dejarlo vacío y definir FORM_RECIPIENT_EMAIL en el servidor si no se quiere exponerlo en el código público. |

No completar con ejemplos ficticios. Un valor vacío o TU_*_AQUI no crea enlaces. Email genera mailto:, WhatsApp genera wa.me con mensaje codificado; Instagram y LinkedIn abren una nueva pestaña con noopener/noreferrer. El dominio sin configurar conserva localhost y desactiva indexación. Los campos antiguos de siteContent se derivan automáticamente de businessConfig: no duplicar datos allí.

## Archivo .env.local

Copiar `.env.example` a `.env.local` y completar estas tres líneas:

```dotenv
RESEND_API_KEY=
RESEND_FROM_EMAIL=
FORM_RECIPIENT_EMAIL=
```

- `RESEND_API_KEY`: tu API key de Resend con permiso para enviar emails. Es privada, solo se lee en el servidor y no debe llevar prefijo NEXT_PUBLIC_.
- `RESEND_FROM_EMAIL`: dirección remitente de un dominio verificado en Resend. Escribir solo el email; el código añade el nombre Velour Studio. No se utiliza el email del visitante como remitente.
- `FORM_RECIPIENT_EMAIL`: buzón donde querés recibir las consultas. Tiene prioridad sobre `businessConfig.formRecipientEmail`. Si está vacío, se usa ese campo central; si ambos están vacíos, no se activa el envío.

La integración permanece desactivada si falta cualquiera de las tres piezas válidas. No existe envío de prueba automático. `.env.local` está excluido de Git.

Después de cambiar variables, ejecutar `npm run build` y reiniciar `npm start` (o volver a desplegar). La disponibilidad mostrada en la página se resuelve al compilar. En desarrollo, reiniciar `npm run dev`.

## Funcionamiento

La ruta `/api/contact` recibe dos tipos de consulta: `kind: 'question'` para preguntas y `kind: 'project'` para el diagnóstico de dos pasos. Valida los datos, aplica el honeypot y llama a la API HTTPS de Resend desde el servidor. Envía todos los campos como texto plano (incluidas audiencia y situación actual), usa el email del visitante en reply_to y conserva un remitente y destinatario configurados. Solo devuelve éxito cuando Resend confirma la aceptación con un ID; esto no confirma por sí solo la llegada al buzón. Los errores del proveedor no exponen claves ni detalles internos. Los formularios conservan los datos si falla el envío. El diagnóstico también los conserva al volver al paso anterior.

`npm run test:forms` comprueba validación, ausencia de credenciales y respuestas de proveedor simuladas. No realiza envíos reales ni lee tus credenciales.

La integración anterior por CONTACT_WEBHOOK_URL fue reemplazada por Resend; esa variable ya no habilita el formulario. Antes de publicar, verificar el dominio remitente, comprobar una entrega real y configurar protección contra abuso en la plataforma/proveedor. En esta tarea no se enviaron emails reales.

Documentación oficial: [Enviar emails](https://resend.com/docs/api-reference/emails/send-email) y [verificar dominios](https://resend.com/docs/dashboard/domains/introduction).
