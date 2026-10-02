# Reconstrucción de la home — 1 de octubre de 2026

## Resultado

La home se reconstruyó por componentes tomando la referencia de lacruss.com únicamente para el recorrido comercial, la escala de bloques y el ritmo. Se reutilizaron la identidad, las fuentes y las imágenes propias de Velour; no se copiaron código, textos, proyectos, imágenes, cifras ni logos de la referencia.

## Secciones reconstruidas

Header compacto → hero con mockups → atributos de confianza → tecnologías → diseño/desarrollo web → automatización/desarrollo a medida → nota de branding → proceso de cinco pasos → dos casos conceptuales → CTA → ocho FAQ → preguntas → diagnóstico de dos pasos → footer.

Los proyectos siguen identificados como conceptos. Las tres páginas de detalle existentes se conservan; dos aparecen en la home. No se inventaron resultados, testimonios ni métricas. El pago visible es 50% al inicio y 50% a la entrega; la modalidad alternativa permanece deshabilitada.

## Eliminaciones

Se retiraron ExperienceHome, PageIntro, ExperienceScenes, MouseTilt, ContextualCursor, InteractiveBackground, el motor Lenis, los componentes anteriores de sections y lib/motion.ts. También las hojas agency.css, motion.css, experience.css y el módulo editorial-brand sin uso.

Se eliminaron GSAP y Lenis de package.json y del lockfile. GSAP sigue apareciendo como una tecnología ofrecida en el marquee, según el brief; no se carga como dependencia de esta web.

Ya no hay intro/loader, ScrollTriggers, pins de servicios/CTA, desplazamiento horizontal, parallax, cursor personalizado, magnetismo, inclinación según mouse, blobs ni overlays entre rutas.

## Movimiento conservado

- Hero: CSS, secuencia de aproximadamente 1,15 s. Revelado de los dos bloques del titular, fades y máscara de imagen.
- Servicios: entrada única de texto con Y=25 px y de imagen con escala 1,04→1 y máscara.
- Tecnologías: marquee CSS de 65 s, pausable, detenido fuera de pantalla o con pestaña oculta.
- Proceso: IntersectionObserver cambia contraste y círculo activo; visual estático con sticky de CSS en escritorio.
- Proyectos: escala 1,02 y aparición del enlace sobre la imagen; en móvil el CTA permanece visible.
- FAQ: altura, opacidad y rotación de icono.
- Diagnóstico: Framer Motion, salida/entrada de 150 ms cada una, desplazamiento de 20 px.
- Fondo: un único radial de 600 px de radio, dorado al 8%, sin blur. El mouse actualiza refs/estilos con interpolación; no usa estado de React. El RAF se detiene al estabilizarse. Desactivado en móvil y reduced motion.
- Scroll nativo suave. Se respetan las preferencias de movimiento reducido.

## Archivos actuales

| Responsabilidad | Archivo |
| --- | --- |
| Entrada de la página | app/page.tsx |
| Composición de la home | components/home/home.tsx |
| Servicios y mockups | components/home/services.tsx, visuals.tsx |
| Proceso y portfolio | components/home/process.tsx, portfolio.tsx |
| FAQ y tecnologías | components/home/faq.tsx, technology-marquee.tsx |
| Footer y luz ambiental | components/home/footer.tsx, ambient-light.tsx |
| Header | components/site.tsx |
| Movimiento compartido | components/motion.tsx, animated-faq.tsx |
| Formularios | components/contact-form.tsx |
| POST existente conservado | app/api/contact/route.ts |
| Validación y Resend | lib/inquiry.ts, lib/resend-mail.ts |
| Diseño y arte de proyectos | app/globals.css, app/mockups.css |
| Copy ES y futura localización | content/home-content.ts |
| Datos y contenido compartidos | content/site-content.ts |
| Pruebas de backend | scripts/test-forms.mjs |

Los wordmarks siguen siendo tipográficos; favicon.png sigue en metadata. El monograma propio permanece sutil en Preguntas en escritorio. gmail-avatar.png no se utiliza.

## Verificaciones

- npm run lint: correcto, sin warnings.
- npm run typecheck: correcto.
- npm run test:forms: correcto. Ruta real y SDK instalado con transporte HTTP simulado, sin enviar correos.
- npm run build: correcto. Home prerenderizada y API dinámica Node.
- Navegador: 1440×1000, 1280×900, 1024×900, 768×1024, 430×932, 390×844 y 375×812. Sin overflow horizontal de documento en esos anchos.
- Revisados hero, servicios, proceso, dos proyectos, CTA, FAQ, formularios y footer en escritorio/móvil.
- Menú móvil: apertura/cierre, modal nativo, bloqueo y restauración del scroll, enlace a Servicios.
- Todas las anclas renderizadas apuntan a IDs existentes. WhatsApp conserva el texto codificado y el número real; email utiliza mailto. No se abrieron aplicaciones externas ni se enviaron mensajes.
- FAQ: apertura y pago 50/50 comprobados. Ver más de servicios funcional.
- Formularios: opciones, avance, regreso, conservación de valores, estado Enviando y botón deshabilitado. Ambos POST alcanzan el servidor. El error local conserva nombre, correo, mensaje y selecciones.
- Consola de una pestaña nueva sobre npm start: sin errores ni warnings. Durante desarrollo se corrigió un href de Branding; las advertencias de LCP tras recarga en anclas no aparecen en producción.
- HTTP 200: home, privacidad, términos, los tres proyectos, favicon y Open Graph.

Capturas: artifacts/home-rebuild/desktop-1440.png y mobile-390.png.

## Rendimiento

Se eliminaron dos runtimes de animación y sus efectos. No quedan ScrollTriggers, canvas, WebGL, listeners de mouse que rendericen React ni blur de pantalla completa. La home contiene secciones estáticas de servidor y componentes cliente acotados para interacción. Las fuentes son locales y se conserva Next Image con tamaños responsive y carga diferida fuera del hero.

La respuesta HTML de producción referencia 11 archivos JavaScript: 760 KiB sin comprimir y aproximadamente 241 KiB con gzip calculado localmente. Incluye el runtime de Next/React; no es una medición de descarga total ni una comparación Lighthouse. Detalle reproducible guardado en artifacts/home-rebuild/production-assets.json. No se afirma una puntuación de Lighthouse ni un FPS que no se haya medido.

## Resend

Se conserva la integración real con el SDK resend. Las variables siguen siendo exactamente RESEND_API_KEY, FROM_EMAIL y CONTACT_EMAIL, solo en servidor. Se mantiene el asunto, Reply-To, siete campos principales, validación, honeypot, control de origen, tamaño máximo e idempotencia. El tipo Pregunta/Comentario/Sugerencia ahora también se valida y se agrega al email.

Este workspace no tiene .env.local ni las tres variables configuradas en ejecución. Por eso la prueba de navegador recibió el 503 controlado esperado y mantuvo los datos. Las pruebas del SDK verificaron respuestas exitosas y fallidas simuladas. No se comprobó una entrega real, el valor de FROM_EMAIL ni el estado de verificación de dominio de la cuenta de Resend en Vercel.

## Pendientes reales

- Dominio público: actualmente vacío, metadata con localhost y noindex.
- Razón social/responsable y jurisdicción; completar/aprobar privacidad y términos.
- Proyectos reales con permiso de publicación: nombre, imágenes, categoría, año, alcance, tecnologías y texto; resultados solo con evidencia.
- Confirmar alcance, impuestos y vigencia de precios; tiempos, revisiones y soporte.
- Instagram, LinkedIn y dirección, únicamente si se quieren mostrar.
- Comprobar FROM_EMAIL autorizado y una entrega real con las variables ya configuradas en Vercel, después del despliegue. No se modificó Vercel ni se publicó esta reconstrucción.
- Traducción completa y rutas/metadata EN antes de habilitar el selector. Hoy ES está activo y EN deshabilitado.

Email y WhatsApp ya están confirmados y no necesitan volver a proporcionarse.
