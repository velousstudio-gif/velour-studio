# Velour Studio — rediseño de experiencia

Finalizado: 1 de octubre de 2026. Esta revisión sustituye la home anterior; las entradas históricas de QA-REPORT.md describen versiones previas.

## 1. Secciones reconstruidas

Hero de pantalla completa, franja de tecnologías, cinco servicios editoriales expandibles, portfolio con tres proyectos grandes, proceso de cinco etapas, El estudio, manifiesto tipográfico, CTA oscuro, FAQ, consulta breve, diagnóstico de dos pasos y footer. Header fijo con contraste según la superficie. Se conservaron contactos, precios, proyectos de demostración, rutas internas y el transporte de los formularios.

## 2. Componentes y organización

- `components/experience-home.tsx`: composición de la nueva home.
- `components/experience/`: InteractiveBackground, usePointerPosition, MouseTilt, ContextualCursor, PageIntro y ExperienceScenes.
- `components/sections/`: HeroExperience, TechnologyMarquee, ServicesShowcase, ProjectsShowcase, ProcessStory, AboutExperience, GiantType, ConversionCTA, FAQExperience, ContactSections y FooterExperience.
- Se reutilizan TextReveal, ImageReveal, AnimatedButton, MotionLink, AnimatedFAQ, ProjectVisual y los formularios existentes. Se retiraron los controladores de escenas, parallax y cursor de la home anterior.
- `app/experience.css` contiene la estructura visual nueva. Los estilos compartidos de formularios, mockups y páginas secundarias siguen disponibles.
- `experienceContent`, exportado desde `content/site-content.ts`, centraliza los textos nuevos. Contactos, precios, FAQ y proyectos mantienen sus fuentes centrales existentes.
- Backup anterior: `artifacts/velour-before-experience-redesign.zip`, sin archivos de entorno.

## 3. Efectos de mouse

Luz radial con interpolación RAF .08 y variables CSS, aura de 440 px con blur de 60 px, grain .025, tonos por sección y por proyecto. El bucle termina al alcanzar su destino; no hay renders React por píxel. Mockups con perspectiva y tilt hasta 3 grados, pequeños desplazamientos, monograma reactivo, imagen de servicio flotante con retraso y cursores contextuales de 86 px. Cursor nativo conservado. Botones magnéticos limitados a 8 px con contenido interno a 4 px. Los efectos decorativos no capturan clics.

## 4. ScrollTriggers

Hero con escala/opacidad y profundidad; progresión de servicios; máscara, escala y desplazamiento de proyectos; paso activo y progreso del proceso; tres líneas tipográficas con direcciones alternadas; composición del CTA y entrada del wordmark del footer. Los reveals de imágenes usan contextos revertibles. MatchMedia separa escritorio, móvil y reduced-motion. Se recalculan las medidas después de cambios de altura; el anclaje inicial se alinea tras la preparación de escenas.

## 5. Elementos fijos

Servicios: pin de 2.2 pantallas solo desde 1280 px y 850 px de alto, si toda la presentación cabe. Al explorar un servicio mediante clic, se libera el pin para el resto de esa visita, compensando la posición para evitar un salto. El proceso usa una columna sticky desde 1024 px. El footer se descubre debajo del contenido solo en escritorios suficientemente altos; sus enlaces siguen accesibles por teclado.

## 6. Móvil y tablet

Sin cursor, aura móvil, tilt ni Lenis por debajo de 1024 px. Servicios en flujo natural, proyectos adaptados, pasos completamente legibles, menú modal, gradientes estáticos, FAQ y transición de formulario conservados. El progreso del proceso sigue el scroll nativo. Las tablets con puntero táctil mantienen pasos visibles y footer en flujo normal incluso por encima de 1024 px. Se revisaron 1440, 1280, 1024, 768, 430, 390 y 375 px, sin overflow horizontal de documento en las mediciones.

## 7. Movimiento reducido y accesibilidad

Sin Lenis, mouse reactivo, parallax, pin ni desplazamiento horizontal animado. Revelaciones inmediatas y pasos visibles. Verificado con un harness temporal del proveedor de preferencias y las mismas reglas CSS reduced-motion, luego retirado antes del build. No se modificó la preferencia del sistema operativo. Navegación por teclado, foco visible, modal con Escape, controles de pausa, disclosures con aria-expanded y contenidos decorativos ocultos a lectores de pantalla.

## 8. Dependencias

Ninguna dependencia npm nueva en este rediseño. Se utiliza el Next.js, TypeScript, GSAP/ScrollTrigger, Framer Motion y Lenis ya instalados. Sin Three.js. Diez SVG de tecnologías locales: 13,693 bytes en total; fuentes y procedencia documentadas en `public/technology/README.md`.

## 9. Rendimiento y verificación

- Fuentes locales, next/image en imágenes raster, imágenes bajo el fold con carga diferida y recursos compartidos reutilizados.
- Marquee pausado fuera de pantalla o al ocultar la pestaña, con control manual; imports de GSAP/Lenis diferidos y cleanup de listeners, RAF, timelines y media contexts.
- Intro visual de 780 ms, sin esperar assets y una sola vez por sesión.
- Se evitó superponer transformaciones de scroll y mouse sobre el mismo nodo del CTA.
- Se corrigieron el anclaje repetido en scroll nativo, la liberación del pin y la coordinación de máscaras tras cambios de layout.
- `npm run lint`: correcto, cero warnings.
- `npm run typecheck`: correcto.
- `npm run test:forms`: correcto; validación, configuración ausente, Resend simulado, fallos y enlaces. No se enviaron emails reales.
- `npm run build`: correcto, Next.js 16.3.6; 12 páginas generadas.
- Pruebas manuales: menú móvil, anclajes, expansión de servicios, progreso, FAQ exclusivo, selección/validación/persistencia de formulario, estado sin Resend, acceso por teclado al footer y navegación home/proyecto/home.
- Consola de producción sin errores ni warnings en el recorrido comprobado; todos los anclajes de la home apuntan a un ID existente.
- Capturas: `artifacts/experience-desktop.png`, `artifacts/experience-mobile-375.png` y `artifacts/experience-cta-desktop.png`.
- HTML generado: un H1, title solicitado, favicon original, metadata de localhost con noindex; sin gmail-avatar ni enlaces sociales vacíos.
- Navegador integrado disponible; Chrome independiente no estaba expuesto por las herramientas. Los FPS no se midieron con un profiler y no se afirma un resultado de 60 FPS ni de Core Web Vitals. Falta validación en teléfonos físicos y navegadores externos antes de publicación.

## 10. Contenido y publicación pendientes

Email confirmado: velousstudio@gmail.com. WhatsApp confirmado: +54 9 358 532 9272, con mensaje codificado. Precios conservados: landing USD 150, web profesional USD 250, e-commerce USD 300 y desarrollo personalizado a cotizar.

Faltan dominio real, URLs de Instagram/LinkedIn si se publicarán, razón social y definición de los textos legales. Configurar RESEND_API_KEY, FROM_EMAIL y CONTACT_EMAIL, verificar el dominio remitente y probar una entrega real tras desplegar. Los proyectos Maison Commerce, Recruitment Platform y Atelier Identity continúan claramente identificados como conceptos: reemplazar por material autorizado de proyectos reales cuando exista. Confirmar alcance, vigencia de precios, tiempos y soporte. No se inventaron clientes, métricas, dominio ni datos de contacto.
