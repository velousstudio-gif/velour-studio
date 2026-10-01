# Editar el contenido sin modificar el diseño

Toda la información pública se edita en **content/site-content.ts**. Para completar contacto y publicación, usar los campos públicos de `businessConfig` al principio del archivo; `siteContent.contact` y `siteContent.publication` derivan sus valores de ellos. `lib/content.ts` solo adapta los datos y genera enlaces seguros. No editar allí valores comerciales. Los contactos y el dominio ya no se leen desde NEXT_PUBLIC_*: el archivo de contenido es la fuente única. Nunca guardar claves o contraseñas en este archivo: se incluye en la web pública.

## Campos principales

| Campo | Qué editar |
| --- | --- |
| `contact` | Email, WhatsApp internacional, URLs completas de Instagram/LinkedIn, mensaje inicial de WhatsApp y dirección opcional. |
| `publication` | Dominio completo con HTTPS, responsable/razón social y jurisdicción pendiente de confirmar. |
| `seo` | Título SEO, descripción y texto alternativo del Open Graph. |
| `experienceContent` | Nuevo hero, tecnologías, cinco servicios, encabezados, proceso, manifiesto, CTA, diagnóstico y footer. Exportado al final de `site-content.ts`. |
| `agency` | Descripciones y textos comerciales reutilizados, confianza, FAQ, pregunta, diagnóstico y mockups. |
| `copy.home` | Textos conservados del estudio, artwork y footer. Las antiguas frases del home se conservan como archivo; el hero activo está en `experienceContent.hero`. |
| `navigation`, `links` | Nombres del menú y destinos compartidos, incluidos Privacy y Terms. Los IDs de secciones actuales se mantienen. |
| `services.web`, `services.automation`, `services.branding` | Títulos, descripciones, ampliaciones de servicio y capacidades. |
| `process` | Cinco etapas, tiempos orientativos, entregables y badge de aprobación. |
| `prices`, `customProject` | Nombres, importes y cotización personalizada. Mantener los IDs landing/web/commerce para sincronizar las referencias de FAQ. |
| `projects` | Nombre, slug, año, sector, categoría, descripción, desafío (`problem`), solución, stack (`tech`), estado, imagen y resultado opcional con evidencia. |
| `faqs` | Objetos con `id`, `question` y `answer`. Los tokens {landingPrice}, {webPrice}, {commercePrice} toman automáticamente los precios vigentes. Conservar el ID `payment` para mostrar opciones de pago en esa respuesta. |
| `timelines`, `paymentOptions` | Plazos de FAQ y dos alternativas de pago; la segunda no fija porcentajes. |
| `diagnosticOptions` | Tipos de proyecto, destinatarios, situaciones y presupuestos. Se comparten con la validación del servidor. |
| `form` y `copy.form` | Mensajes, campos, placeholders y textos de interfaz compartidos. |
| `footerServices` | Etiquetas y claves de enlace centralizadas del footer. |
| `copy.privacy`, `copy.terms` | Textos legales actuales, todavía borradores a completar y aprobar. |
| `copy.demoArtwork` | Todos los textos y nombres ficticios dentro de los mockups de ejemplo. |
| `media` | Imágenes actuales del hero y del mockup editorial. |
| `copy.socialImage` | Textos de la imagen Open Graph. |
| `pendingReview` | Inventario de datos demo, borradores y decisiones pendientes; no se muestra en pantalla. |

Los textos se mantienen separados donde el diseño usa saltos de línea o cursivas. Conservar espacios iniciales/finales que separan texto e iconos. El nuevo recorrido comercial reutiliza las fuentes, wordmarks, imágenes y mockups existentes.

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
6. Completar `sector`, `problem`, `solution` y `tech`. `result` permanece `null` salvo que exista evidencia: usar `{ text: 'Resultado comprobado', evidenceUrl: 'URL pública de la evidencia' }`. Solo se publica en un caso real con URL válida. No inventar métricas.

Las cinco visuales de servicios son exploraciones ilustrativas independientes del portfolio; incluyen mockups y dos composiciones abstractas de sistemas, con leyenda de concepto. El dispositivo de reservas usa datos demo de `agency.interface`; no acepta reservas.

## Inventario pendiente de confirmar

- Maison Commerce, Recruitment Platform y Atelier Identity son **demo**: marcas, visuales, fechas y descripciones no representan clientes reales.
- Los precios 150/250/300 USD fueron solicitados por el propietario, no inventados; faltan alcance, impuestos y vigencia definitiva.
- Servicios, tiempos, administración y soporte de las FAQ necesitan confirmación comercial.
- Los textos legales son borradores: completar responsable, contacto, jurisdicción, proveedores, conservación de datos y condiciones efectivas.
- Instagram, LinkedIn, dirección (si aplica) y dominio siguen pendientes. Email y WhatsApp están confirmados.
- El formulario usa Resend. Confirmar remitente autorizado y entrega al receptor configurado en CONTACT_EMAIL.

## Publicación

Después de editar: `npm run lint`, `npm run typecheck`, `npm run test:forms` y `npm run build`; reiniciar el servidor. Configurar Resend con `RESEND_API_KEY`, `FROM_EMAIL` y `CONTACT_EMAIL` en `.env.local` o en el alojamiento. Ambos formularios envían al backend; una configuración incompleta produce un error de servidor y conserva los datos introducidos. Ver [RESEND-SETUP.md](RESEND-SETUP.md) y comprobar una entrega real antes de publicar.
