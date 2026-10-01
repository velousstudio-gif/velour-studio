# Velour Studio — revisión del recorrido comercial

Fecha: 30 de septiembre de 2026.

## Implementación

- Identidad conservada: wordmarks tipográficos, Instrument Serif / Manrope, crema, negro y dorado; imágenes y assets originales sin modificar.
- Nuevo flujo: hero, atributos de confianza, herramientas, servicios ampliados, proceso de cinco pasos, trabajos conceptuales, estudio, CTA, FAQ, preguntas y diagnóstico de dos pasos.
- Los precios se concentran en FAQ. No se añadieron métricas, testimonios, resultados económicos ni promesas de respuesta no confirmadas.
- `content/site-content.ts` conserva los contactos reales y centraliza servicios, textos, precios, plazos, pagos, opciones de diagnóstico y proyectos. Cada proyecto admite desafío, solución, sector y resultados opcionales con evidencia.

## Archivos de implementación

- `components/site.tsx`: Header, Hero, TrustStrip, TechnologyMarquee, ServiceFeature, ProcessTimeline, SelectedWork, Studio, ConversionCTA, FAQ y Footer. Se reutilizan Logo, ProjectVisual y ProjectMockup.
- `components/contact-form.tsx`: QuestionForm y ProjectDiagnostic sobre InquiryForm compartido; validación, dos pasos, foco, persistencia al retroceder y estados de envío.
- `app/agency.css`, `app/layout.tsx`: estilos del recorrido, responsive, menú fullscreen, controles y ajustes de paleta.
- `content/site-content.ts`, `lib/content.ts`: configuración única y adaptación de precios/plazos en FAQ.
- `lib/inquiry.ts`, `lib/resend-mail.ts`, `app/api/contact/route.ts`: validación compartida y envío de ambos tipos de consulta.
- `app/proyectos/[slug]/page.tsx`: estructura de casos, etiquetas demo y resultados solo con evidencia.
- `eslint.config.mjs`, `package.json`, `package-lock.json`, `postcss.config.mjs`: revisión de código y comandos de verificación.
- `scripts/test-forms.mjs`: pruebas del endpoint y transporte simulado, sin envíos.
- `README.md`, `content/README.md`, `content/RESEND-SETUP.md`, `public/brand/README.md`: documentación actualizada.

## Verificación

- `npm run lint`: correcto, sin warnings de código.
- `npm run typecheck`: correcto.
- `npm run test:forms`: correcto; entradas inválidas, campos manipulados, origen, formato, tamaño, credenciales ausentes, aceptación y errores simulados de Resend.
- `npm run build`: correcto, 12 rutas generadas.
- Revisados los anchos 1440, 1280, 1024, 768, 430, 390 y 375 px. Sin overflow horizontal, títulos desbordados ni controles fuera del viewport.
- Navegación móvil fullscreen: cierre por enlace y Escape; retorno de foco al botón y restauración del scroll.
- Diagnóstico: bloquea el avance incompleto y conserva proyecto, audiencia, situación y campos del segundo paso al retroceder.
- Preguntas: validación de campos obligatorios y estado explicativo cuando no hay credenciales. No se transmitieron datos a Resend.
- Enlaces internos del home con destino existente; proyectos, páginas legales, favicon, Open Graph, robots y sitemap responden HTTP 200.
- Un H1; title y descripción solicitados; favicon PNG existente. Dominio vacío conserva URLs locales y evita indexación.
- Email y WhatsApp coinciden con los datos confirmados; mensaje de WhatsApp codificado. Instagram y LinkedIn ocultos hasta tener URL.
- Consola de la versión compilada sin errores ni warnings durante las pruebas.

## Antes de publicar

1. Elegir dominio y alojamiento compatible con Next.js; completar `businessConfig.domain` y recompilar.
2. Configurar Resend: API key privada, remitente de dominio verificado y destinatario. Comprobar una entrega real y habilitar protección contra abuso en el alojamiento/proveedor.
3. Completar responsable legal y jurisdicción; revisar y aprobar los borradores de privacidad y términos.
4. Proporcionar proyectos reales con imágenes autorizadas, sector, problema, solución, stack y evidencia si se comunican resultados. Se pueden conservar los ejemplos solo como conceptos identificados.
5. Confirmar alcance de precios, impuestos, plazos, condiciones de pago, revisiones y soporte.
6. Instagram, LinkedIn y dirección son opcionales y permanecen ocultos mientras no estén configurados.

La revisión responsive se hizo con viewports de navegador, no con dispositivos físicos. Las pruebas de Resend usan un transporte simulado: no confirman entrega real a un buzón.

## Animaciones y microinteracciones · 30/09/2026

- Sistema en `components/motion.tsx` y `app/motion.css`: easing [0.22, 1, 0.36, 1], entradas 0.6–0.7 s, máscaras 1.1 s, intro hasta 1.7 s, interacciones 0.25–0.4 s. Solo Framer Motion existente y CSS; ninguna dependencia nueva, GSAP, Lenis ni Three.js.
- Wordmark/nav escalonados, títulos por líneas conservando el texto original accesible, máscaras de imágenes, header compacto sin cambiar la altura del documento, progreso superior y del proceso, hovers de servicios/proyectos, parallax acotado y CTA con magnetismo de máximo 5 px.
- FAQ de 0.3 s, diagnóstico de 0.4 s con fieldsets persistentes, indicador 50–100%, foco y errores animados, footer escalonado y transiciones de rutas de 0.12/0.3 s.
- Las máscaras se retiran después de entrar para conservar sombras y pies de imagen. Se limpian observers/listeners y animaciones al desmontar. Dos suscripciones compartidas detectan puntero/ancho y cambios de preferencia de movimiento. No se añadieron videos ni assets pesados; el PNG del CTA se optimiza con Next Image y carga diferida.
- Móvil/táctil: parallax y magnetismo desactivados, sin sticky de proceso ni luz animada. Movimiento reducido: contenido visible inmediatamente, sin máscaras, marquee, parallax, scroll suave, magnéticos ni transiciones espaciales.
- Revisados desktop 1440 px y móvil 375/430 px: navegación, menú, FAQ por teclado, diagnóstico inválido/válido y persistencia de valores en ambos pasos. Sin overflow horizontal. Rutas de proyectos y regreso al anchor comprobados.
- Movimiento reducido comprobado con un arnés temporal que aplicó `MotionConfig` y las mismas reglas CSS de producción, incluyendo cambio de preferencia, visibilidad de todos los títulos, marquee detenido, FAQ y formulario. El arnés se eliminó antes del build final. La herramienta no permite emular la preferencia del sistema operativo directamente.
- Chrome no estaba disponible en la conexión de herramientas. Las revisiones visuales se realizaron en el navegador integrado; queda pendiente la comprobación en Chrome real y dispositivos físicos. No se midió una puntuación Lighthouse ni se afirma una tasa de FPS.
- `npm run lint`, `npm run typecheck`, `npm run test:forms` y `npm run build` completados. Consola de producción revisada sin errores ni warnings. Capturas: `artifacts/motion-desktop.png` y `artifacts/motion-mobile-375.png`.

## Motion avanzado con GSAP y Lenis · 30/09/2026

Esta fase reemplaza la arquitectura de la sección anterior de animaciones. Mantiene diseño, contenido, imágenes, identidad y orden de secciones. El portfolio sigue vertical: una navegación horizontal no mejoraba su composición editorial.

### Distribución del movimiento

- `lib/motion.ts`: carga dinámica compartida de GSAP/ScrollTrigger y easing principal. Registro del plugin solo desde efectos del cliente.
- `components/motion/home-scenes.tsx`: timeline única de intro; profundidad del hero; servicios fijados con tres fases de mockups; automatización con profundidad; proceso activo con progreso vertical; proyectos con escala, título y metadatos; CTA con pin corto, monograma y luz; transiciones de bordes y columnas del footer.
- `components/motion/scroll-engine.tsx`: Lenis solo en escritorio con puntero fino, duración 1.1 s, wheelMultiplier 0.9 y un único ticker de GSAP. Scroll táctil nativo. Anclas, foco, redimensionamiento y limpieza de listeners/ticker incluidos.
- `components/motion/parallax.tsx`: capa reutilizable para arte, con velocidad y dirección; utilizada en El estudio.
- `components/motion/project-cursor.tsx`: cursor local de 84 px con springs, exclusivamente dentro de imágenes de proyectos.
- Framer Motion: títulos por líneas medidas, entradas simples, labels, FAQ exclusiva con máscara de 350 ms, menú fullscreen escalonado, campos/foco, diagnóstico de dos pasos persistentes, botones magnéticos de hasta 5 px, cursor y cortina de rutas de 0.28/0.32 s.
- CSS: navegación con textos en máscara, flechas, líneas doradas, hover de imágenes y enlaces, indicador de scroll de 2 s y footer revelado bajo el contenido. El hover del título de proyectos usa una capa diferente a su desplazamiento de scroll.

### ScrollTrigger, acceso y limpieza

Se utiliza en hero, imágenes grandes, servicios web, automatización, proceso, los tres proyectos, arte de El estudio, CTA, footer y bordes de las secciones oscuras. Servicios y CTA tienen pin solo en escritorio con altura suficiente; abrir los detalles del servicio libera su pin.

Los contextos se revierten al desmontar. Los elementos fijados usan wrappers propios de React. Las máscaras de entrada reproducen su timeline una vez y conservan el trigger hasta desmontar; esto evita invalidar mediciones entre hermanos al abrir un enlace profundo. Los hashes de rutas se alinean después de calcular el espacio de los pins. Se comprobó el recorrido inicio → proyecto → inicio/formulario sin recargar: pins eliminados al salir y restaurados al volver, imágenes visibles y formulario a unos 100 px del borde superior.

En móvil se eliminan pins, parallax de scroll, cursor custom, magnetismo, footer sticky y Lenis. Permanecen máscaras, títulos, menú, acordeón, hovers compatibles y transición de formulario. Con movimiento reducido también se desactivan scrub, marquee, cortina espacial, luz y scroll suave; el contenido permanece visible y utilizable.

### Verificación de esta fase

- Recorrido manual completo en desktop 1440 × 1000 y móvil 375 × 812, incluyendo todas las secciones, proyectos, CTA, FAQ, preguntas, diagnóstico y footer.
- Laptop 1366 × 768: servicio fijado sin recorte y detalles expandibles. Móvil 430 × 932: diagnóstico, navegación y ausencia de overflow.
- FAQ exclusiva, cierre del menú por enlace/Escape, recuperación del foco, avance validado del formulario y persistencia de campos al retroceder.
- Movimiento reducido comprobado con un arnés temporal que activó las preferencias del proveedor y las mismas reglas CSS de producción. Sin Lenis, pins, cursor ni contenido oculto. El arnés y los atributos de diagnóstico se eliminaron. No fue una emulación de la preferencia del sistema operativo.
- `npm run lint`, `npm run typecheck`, `npm run test:forms` y `npm run build`: correctos. Pruebas de correo con transporte simulado, sin envíos reales.
- Capturas de esta fase: `artifacts/advanced-motion-desktop.png` y `artifacts/advanced-motion-mobile-375.png`.

### Impacto estimado

Dependencias añadidas: GSAP 3.15.0 y Lenis 1.3.26; se conserva Framer Motion. Los archivos minificados de GSAP, ScrollTrigger y Lenis suman aproximadamente 51 KiB gzip como referencia de peso de las librerías. No equivale al incremento exacto de los chunks de Next.js, que incluyen integración y optimizaciones del bundler. GSAP se carga de forma dinámica y Lenis únicamente para escritorio sin movimiento reducido. No se añadieron imágenes ni vídeos.

Se priorizan transform, opacity y clip-path, con medidas del proceso al refrescar, no por frame. El marquee se pausa fuera de pantalla y al ocultar la pestaña. Los listeners y animaciones se limpian al desmontar. No se realizó una medición Lighthouse, de FPS ni en dispositivos físicos; esas cifras no se presuponen.

Cierre de QA: también se verificó tablet 768 × 1024, sin overflow ni pins. La consola de producción en una pestaña limpia quedó sin errores ni warnings durante navegación a proyecto, regreso al formulario, scroll de servicios y revisiones móviles/tablet. El último `npm run build` completó las 12 rutas correctamente.


## Rediseño completo de experiencia — 30/09/2026

La implementación actual y su validación están documentadas en [EXPERIENCE-REPORT.md](EXPERIENCE-REPORT.md). Los apartados anteriores son históricos.
