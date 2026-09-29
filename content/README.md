# Editar el contenido sin modificar el diseño

Toda la información pública se edita en **content/site-content.ts**. Para completar contacto y publicación, usar los siete campos de `businessConfig` al principio del archivo; `siteContent.contact` y `siteContent.publication` derivan sus valores de ellos. `lib/content.ts` solo adapta los datos y genera enlaces seguros. No editar allí valores comerciales. Los contactos y el dominio ya no se leen desde NEXT_PUBLIC_*: el archivo de contenido es la fuente única. Nunca guardar claves o contraseñas en este archivo: se incluye en la web pública.

## Campos principales

| Campo | Qué editar |
| --- | --- |
| `contact` | Email, WhatsApp internacional, URLs completas de Instagram/LinkedIn, mensaje inicial de WhatsApp y dirección opcional. |
| `publication` | Dominio completo con HTTPS, responsable/razón social y jurisdicción pendiente de confirmar. |
| `seo` | Título SEO, descripción y texto alternativo del Open Graph. |
| `copy.home` | Hero, estudio, contacto, encabezados de secciones, botones y footer; claves descriptivas en español. |
| `navigation`, `links` | Nombres del menú y destinos compartidos, incluidos Privacy y Terms. Los IDs de secciones actuales se mantienen. |
| `services`, `process` | Servicios y etapas del proceso. |
| `prices`, `customProject` | Nombres, importes y cotización personalizada. Mantener los IDs landing/web/commerce para sincronizar las referencias de FAQ. |
| `projects` | Nombre, slug, año, categoría, descripción, detalle, tecnologías, estado y visual de cada trabajo. |
| `faqs` | Preguntas y respuestas. Los tokens {landingPrice}, {webPrice}, {commercePrice} toman automáticamente los precios vigentes. |
| `form` y `copy.form` | Opciones, campos, placeholders y textos de interfaz. Las opciones se comparten con la validación del servidor. |
| `copy.privacy`, `copy.terms` | Textos legales actuales, todavía borradores a completar y aprobar. |
| `copy.demoArtwork` | Todos los textos y nombres ficticios dentro de los mockups de ejemplo. |
| `media` | Imágenes actuales del hero y del mockup editorial. |
| `copy.socialImage` | Textos de la imagen Open Graph. |
| `pendingReview` | Inventario de datos demo, borradores y decisiones pendientes; no se muestra en pantalla. |

Los textos se mantienen separados donde el diseño usa saltos de línea o cursivas. Conservar espacios iniciales/finales que separan texto e iconos. No se ha cambiado CSS, tipografías ni estructura visual durante esta centralización.

## Contactos pendientes

Los valores `TU_EMAIL_AQUI`, `TU_WHATSAPP_AQUI`, `TU_INSTAGRAM_AQUI`, `TU_LINKEDIN_AQUI` y `TU_DIRECCION_AQUI` son placeholders explícitos. No se convierten en enlaces, ni se muestran como información real. El footer oculta los canales sin URL válida. Email y WhatsApp ya tienen datos reales confirmados; Instagram, LinkedIn y dominio permanecen vacíos.

- Email: dirección completa, sin `mailto:`.
- WhatsApp: número internacional con código de país. Se aceptan +, espacios, paréntesis y guiones; se normaliza a dígitos para `wa.me`. El mensaje se codifica automáticamente.
- Instagram/LinkedIn: URL completa con `https://`, no solo el usuario.
- Dirección: opcional. Completar y activar `showAddress: true` únicamente si se quiere publicar; aparece con el texto de contacto del footer.
- Dominio: reemplazar `TU_DOMINIO_AQUI` por la URL pública. Mientras sea un placeholder, se usa localhost sin indexación.

## Cambiar un proyecto demo por uno real

1. Editar el registro en `projects`; conservar `slug` si se quiere mantener la URL existente. Si cambia una URL ya publicada, agregar su redirección antes de desplegar.
2. Cambiar `status: 'demo'` por `status: 'real'`. Las etiquetas y la advertencia conceptual se eliminan automáticamente solo para ese proyecto.
3. Colocar una imagen autorizada en `public/images/` y completar `image.src` con `/images/archivo.webp` y `image.alt` con una descripción real. Se usa la misma imagen en portada y detalle, sin modificar componentes. Usar una composición horizontal y tener en cuenta que se encuadra con object-fit: cover.
4. Mientras `image.src` esté vacío se conserva el mockup actual definido por `kind`; no marcar un proyecto como real sin sustituir también ese material ficticio.
5. Los textos de `copy.demoArtwork` no se muestran para los proyectos que ya tienen una imagen propia. Los avisos generales de proyectos conceptuales desaparecen cuando todos están marcados como reales.

## Inventario pendiente de confirmar

- Maison Commerce, Recruitment Platform y Atelier Identity son **demo**: marcas, visuales, fechas y descripciones no representan clientes reales.
- Los precios 150/250/300 USD fueron solicitados por el propietario, no inventados; faltan alcance, impuestos y vigencia definitiva.
- Servicios, tiempos, administración y soporte de las FAQ necesitan confirmación comercial.
- Los textos legales son borradores: completar responsable, contacto, jurisdicción, proveedores, conservación de datos y condiciones efectivas.
- Instagram, LinkedIn, dirección (si aplica) y dominio siguen pendientes. Email y WhatsApp están confirmados.
- El formulario conserva su aviso de disponibilidad hasta conectar un receptor privado de email.

## Publicación

Después de editar: `npm run build` y reiniciar el servidor. Configurar Resend con `RESEND_API_KEY`, `RESEND_FROM_EMAIL` y `FORM_RECIPIENT_EMAIL` en `.env.local` o en el alojamiento. Sin la configuración completa no se activa el envío. Ver [RESEND-SETUP.md](RESEND-SETUP.md) y comprobar una entrega real antes de publicar.
