# Velour Studio

Web editorial en español con Next.js, TypeScript, Instrument Serif y Manrope autoalojadas. La home usa scroll nativo, CSS y Framer Motion para entradas discretas. No incluye GSAP ni Lenis.

## Desarrollo y producción

Requiere Node.js 20.9 o superior.

```sh
npm install
npm run dev
npm run lint
npm run typecheck
npm run test:forms
npm run test:theme
npm run build
npm start
```

## Contenido

- `content/home-content.ts`: copy activa de la home, servicios, confianza, tecnologías, CTA, composición del portfolio y footer. Diccionario ES y estructura preparada para EN; EN permanece deshabilitado.
- `content/site-content.ts`: datos públicos, SEO, proyectos, precios, FAQ, proceso, opciones y mensajes de formularios, legales y textos de los mockups.
- `lib/content.ts`: adaptadores y enlaces calculados. No editar los datos comerciales aquí.

Guía de edición y pendientes: [content/README.md](content/README.md).

## Publicación y Resend

Email y WhatsApp reales ya están configurados. Dominio, razón social y redes siguen pendientes. Los proyectos están identificados como conceptos; los legales requieren completar y aprobar su contenido.

Configurar exclusivamente en el servidor `RESEND_API_KEY`, `FROM_EMAIL` y `CONTACT_EMAIL`. Copiar `.env.example` a `.env.local` para desarrollo o definirlas en Vercel y redesplegar. Las claves nunca se incluyen en variables NEXT_PUBLIC ni en contenido público.

Ambos formularios usan `POST /api/contact`: validación de servidor, honeypot, control de origen, límite de entrada, Reply-To del visitante e idempotencia. Solo se informa éxito cuando Resend devuelve un ID. Los errores mantienen los datos del formulario. El tipo Pregunta/Comentario/Sugerencia se valida y se incluye en el correo.

Guía del remitente verificado y prueba de entrega: [content/RESEND-SETUP.md](content/RESEND-SETUP.md). Requiere alojamiento Next.js/Node; no usar exportación estática.

## Arquitectura visual actual

Hero → confianza → tecnologías → dos servicios → nota de branding → proceso → dos proyectos → CTA → FAQ → preguntas → diagnóstico → footer.

La home se ensambla en `components/home/home.tsx`; cada bloque tiene su componente en `components/home/`. `components/site.tsx` contiene el header compartido. `components/contact-form.tsx` conserva los formularios. `app/globals.css` contiene el sistema visual y los breakpoints; `app/mockups.css` contiene únicamente las ilustraciones de proyectos.

Header y footer usan el wordmark tipográfico. Se conserva el favicon y un monograma sutil en Preguntas, oculto en pantallas pequeñas. Los PNG de marca y assets propios permanecen disponibles; Gmail no se muestra.

El selector Light / Dark del header (dentro del menú en tablet/mobile) cambia la paleta sin recargar y conserva el dorado en ambos modos. Sin elección manual sigue `prefers-color-scheme`; la preferencia se guarda en `localStorage` con la clave `velour-theme`. Las variables están en `app/themes.css`. Funcionamiento, tokens y QA: [content/THEMES.md](content/THEMES.md).

Informe del trabajo y QA: [content/HOME-REBUILD-REPORT.md](content/HOME-REBUILD-REPORT.md). Los informes anteriores documentan versiones históricas.

ESLint 9 se mantiene por compatibilidad con los plugins React de `eslint-config-next` 16.3.6.
