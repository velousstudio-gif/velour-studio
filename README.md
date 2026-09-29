# Velour Studio

Web editorial en español con Next.js, TypeScript, Instrument Serif y Manrope autoalojadas. La dirección visual y los assets actuales se conservan.

## Desarrollo y producción

Requiere Node.js 20.9 o superior.

```sh
npm install
npm run dev
npm run typecheck
npm run build
npm start
```

## Editar contenido

**Fuente única: `content/site-content.ts`.** Contactos, dirección opcional, dominio, textos, servicios, precios, proyectos, FAQ, navegación y enlaces legales se modifican allí. Guía e inventario de contenidos pendientes en [content/README.md](content/README.md).

Los placeholders TU_*_AQUI no generan enlaces inválidos. Las antiguas variables NEXT_PUBLIC_CONTACT_EMAIL, NEXT_PUBLIC_WHATSAPP, NEXT_PUBLIC_INSTAGRAM_URL, NEXT_PUBLIC_LINKEDIN_URL y NEXT_PUBLIC_SITE_URL ya no son la fuente del contenido público. Migrar sus valores al archivo central antes de desplegar si estaban configuradas en el alojamiento.

## Antes de publicar

Completar contactos y dominio; confirmar textos comerciales, precios y alcance; reemplazar o conservar claramente identificados los tres proyectos demo; completar los borradores legales. Recompilar después de editar.

Completar `businessConfig` al inicio de `content/site-content.ts`. Para enviar consultas, definir `RESEND_API_KEY`, `RESEND_FROM_EMAIL` y `FORM_RECIPIENT_EMAIL` en `.env.local` o en el alojamiento. La integración permanece desactivada mientras falten credenciales, remitente o destinatario válidos. Guía completa: [content/RESEND-SETUP.md](content/RESEND-SETUP.md). No se envían emails de prueba automáticamente. Usar alojamiento compatible con Next.js/Node; no exportación estática.

## Marca y recursos

Header y footer mantienen el wordmark tipográfico; favicon PNG vigente. Monograma oscuro integrado solo en «Nuestra mirada». Ver `public/brand/README.md`. Las imágenes editoriales son ilustrativas; su procedencia está en `public/images/ART-DIRECTION.md`.
