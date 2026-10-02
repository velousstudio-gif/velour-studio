# Editar el contenido sin modificar el diseño

Los datos públicos compartidos están en `content/site-content.ts`; la copy y composición de la home están en `content/home-content.ts`. Ambos son públicos: nunca guardar API keys o secretos aquí. `lib/content.ts` genera enlaces y adapta los valores.

## Dónde editar

| Archivo / campo | Uso actual |
| --- | --- |
| `site-content.ts` → `businessConfig` | Email público, WhatsApp, redes, dominio y responsable legal. |
| `siteContent.contact`, `publication` | Mensaje de WhatsApp, dirección opcional, jurisdicción. Contacto y dominio derivan de businessConfig. |
| `siteContent.seo`, `copy.socialImage` | Metadata y textos de Open Graph. |
| `home-content.ts` → `homeLocales.es` | Hero, confianza, tecnologías, dos servicios completos, encabezados, CTA, pregunta, diagnóstico y footer. |
| `homeContent.services[].capabilities` | Opciones de cada servicio y destinos de sus anclas. |
| `siteContent.services.branding` | Descripción de branding reutilizada por la home. Los antiguos servicios web/automation son copy de archivo; los activos están en home-content.ts. |
| `siteContent.navigation`, `links` | Header y destinos compartidos. |
| `siteContent.process` | Cinco etapas, plazos orientativos, descripción, entregables y aprobación. |
| `siteContent.prices`, `customProject`, `timelines` | Importes y plazos interpolados en FAQ. |
| `siteContent.faqs` | Preguntas y respuestas. Conservar tokens {landingPrice}, {webPrice}, {commercePrice}, {landingTime}, {webTime}, {commerceTime}. |
| `siteContent.paymentOptions` | Solo las entradas con enabled: true se publican. Hoy se muestra 50% al inicio y 50% a la entrega. |
| `siteContent.projects` | Los tres registros de proyecto y páginas de detalle. |
| `homeContent.portfolio.projects` | Slugs de los dos casos seleccionados para la home y sus títulos editoriales. |
| `siteContent.diagnosticOptions`, `questionTypes` | Opciones de ambos formularios, compartidas con la validación del servidor. |
| `siteContent.copy.form`, `form`, `agency.diagnostic`, `agency.question` | Etiquetas, mensajes y pasos de formularios. |
| `siteContent.copy.privacy`, `copy.terms` | Borradores legales. |
| `siteContent.copy.demoArtwork`, `agency.interface` | Nombres y copy ficticios de los mockups. La interfaz de reservas es una ilustración. |
| `siteContent.media` | Imágenes propias usadas en proceso y composición de moda. |

La copy de versiones anteriores que permanece en `copy.home` y `agency.hero/trust/cta` no controla la nueva home. No hay claves ni enlaces reales inventados.

## Contactos y publicación

- Email confirmado: `velousstudio@gmail.com`; se transforma en mailto.
- WhatsApp confirmado: `5493585329272`; presentación `+54 9 358 532 9272`. El mensaje se codifica automáticamente en wa.me.
- Instagram y LinkedIn: completar URL HTTPS; se ocultan si están vacíos o no son válidos.
- Dominio: completar `businessConfig.domain` con URL HTTPS. Vacío usa localhost y noindex, sin inventar URLs.
- Dirección: opcional. Activar `showAddress` solo si debe publicarse.
- Responsable legal y jurisdicción: pendientes.

## Reemplazar los conceptos por proyectos reales

1. Editar `siteContent.projects`. Conservar slugs publicados o preparar redirecciones al cambiarlos.
2. Completar nombre, año, sector, categoría, descripción, problema, solución y tecnologías.
3. Agregar una imagen autorizada a `public/images/` y configurar `image.src` y `image.alt`. Se utiliza Next Image y se conserva la proporción del bloque.
4. Cambiar status a real solo cuando textos e imagen correspondan a un trabajo real. Mientras esté en demo se mantiene la identificación conceptual.
5. No publicar resultados sin evidencia: `result` permanece null; un resultado necesita texto y URL de evidencia.
6. Seleccionar los slugs destacados en `homeContent.portfolio.projects`. La tercera página de detalle sigue disponible aunque no aparezca en la home.

## Idiomas

`localeConfig` y `homeLocales.es` preparan los diccionarios. EN permanece deshabilitado. Para activarlo faltan traducción de toda la copy compartida, rutas, metadata y selector funcional.

## Antes de publicar

Confirmar dominio, datos legales, proyectos reales, alcance e impuestos de los precios, tiempos, revisiones y soporte. Redes y dirección son opcionales. No es necesario volver a proporcionar email o WhatsApp.

Las credenciales de envío se configuran únicamente en `.env.local` o Vercel: `RESEND_API_KEY`, `FROM_EMAIL`, `CONTACT_EMAIL`. Ver [RESEND-SETUP.md](RESEND-SETUP.md). Comprobar una entrega real con remitente verificado tras desplegar.

Ejecutar lint, typecheck, test:forms y build después de modificar opciones. Las pruebas no envían emails ni leen credenciales locales.
