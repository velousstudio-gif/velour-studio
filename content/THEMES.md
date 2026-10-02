# Velour Light / Velour Dark

Dos modos de luminosidad con el mismo diseño editorial y dorado de marca. Este sistema sustituye Classic / Mono. No duplica componentes, layouts o una hoja de estilos completa, y no aplica filtros a las imágenes.

## Archivos modificados en esta actualización

- `app/themes.css`: paletas Light/Dark, variantes por contexto, controles y transición.
- `app/globals.css`: acentos legibles, botones invertibles, estados seleccionados, hover de tecnologías y opacidad del monograma.
- `lib/theme.ts`: nombres, validación, migración y script previo al primer pintado.
- `lib/theme-store.ts`: estado compartido, selección manual, sistema, persistencia y sincronización entre pestañas.
- `components/theme-selector.tsx`: selector Sun/Light y Moon/Dark con nombres accesibles y `aria-pressed`.
- `components/home/home.tsx`: variantes clara y oscura del monograma existente.
- `scripts/test-theme.mjs`: pruebas del sistema, prioridades, almacenamiento y contraste.
- `README.md` y esta guía.
- `artifacts/light-dark/`: capturas y resultados responsive.

`app/layout.tsx` conserva su integración existente: importa el script actualizado y lo ejecuta en el head. `components/site.tsx` conserva las ubicaciones del selector. No fue necesario modificar formularios, navegación, backend ni dependencias.

## Paleta centralizada

Editar `app/themes.css`. `:root` define Light y los valores compartidos; `:root[data-theme="dark"]` sobrescribe únicamente los valores que cambian.

| Variable | Light | Dark |
| --- | --- | --- |
| `--bg` | #F7F5F0 | #0A0A0A |
| `--surface` | #FFFFFF | #111111 |
| `--surface-alt` | #EFEAE2 | #171717 |
| `--text` | #0A0A0A | #F7F5F0 |
| `--text-muted` | #6E6A63 | #A8A39A |
| `--accent` | #C6A15B | #C6A15B |
| `--accent-light` | #E2C785 | #E2C785 |
| `--border` | rgba(10,10,10,.12) | rgba(255,255,255,.12) |

Las líneas decorativas usan `--border`. Los controles usan `--input-border` y `--focus`, con contraste más alto. `--accent-text` mantiene el dorado legible: #806536 sobre fondos claros y #E2C785 sobre oscuros. `--text-muted-on-alt` ajusta mínimamente el gris de Light a #6D6962 sobre la superficie crema alternativa: la combinación literal de la paleta quedaba en 4.49:1.

Otros tokens separan funciones: `--button-bg/text`, `--placeholder`, `--header-bg`, `--glow/falloff`, `--technology-text`, `--chrome-text/dot`, `--shadow*`, `--inverse-*`, `--on-dark*`, `--process-active-*`, `--brand-overlay-*`, `--monogram-*`, `--cta-*`, `--footer-*` y `--selection-*`. `--surface-quiet`, `--accent-solid` y `--accent-soft` son alias de compatibilidad internos.

## Selector, sistema y persistencia

- Desktop: dos controles discretos Light / Dark con sol y luna en el header. Hasta 1100 px se muestran dentro del menú modal. Los botones móviles tienen al menos 44 px de alto.
- El control modifica `data-theme="light"` o `data-theme="dark"` en `<html>` sin recargar la página ni reiniciar formularios, FAQ o animaciones.
- La elección manual se guarda en `localStorage`, clave `velour-theme`, con valor `light` o `dark`.
- Sin una preferencia válida, `window.matchMedia('(prefers-color-scheme: dark)')` determina el modo. También escucha cambios del sistema mientras no haya una elección manual.
- La selección manual tiene prioridad sobre cambios posteriores del sistema. Si el almacenamiento está bloqueado, la elección se conserva en memoria durante la sesión, también al navegar entre páginas.
- El evento `storage` sincroniza otras pestañas del mismo origen. Eliminar la preferencia reanuda el seguimiento del sistema.
- Los valores anteriores `default` y `monochrome` migran a `light`, porque ambos eran paletas de fondo claro. No se interpretan como una selección de Dark. Los valores desconocidos vuelven a la preferencia del sistema.
- Ambos selectores comparten una sola suscripción al sistema; las suscripciones se eliminan al desmontarse.

## Flash inicial e hidratación

El script pequeño y síncrono en el `<head>` resuelve primero la preferencia guardada, después la del sistema, y actualiza el atributo antes de pintar el body. No espera a React ni a una descarga adicional. La carga inicial no tiene transición.

El selector usa `useSyncExternalStore`. El snapshot del servidor y el primer render React son siempre Light; tras hidratar se lee el modo efectivo del documento. La apariencia del control depende directamente de `data-theme`, por lo que respeta el tema desde el primer pintado. `suppressHydrationWarning` se mantiene exclusivamente en `<html>` para su cambio de atributo intencional. Las páginas siguen siendo prerenderizables.

La transición dura 350 ms para fondo, color, borde, fill, stroke, sombra y foco. `prefers-reduced-motion: reduce` la desactiva. Los efectos de movimiento existentes permanecen independientes.

## Variantes específicas por sección

- **Header y hero:** fondos crema/negro, wordmark y titular negro/claro, CTA negro/crema, acento dorado legible. Header sticky y menú heredan la misma paleta.
- **Aura:** dorado suave en Light y más profundo en Dark, sin aumentar excesivamente su opacidad. Sigue desactivado cuando corresponde según las preferencias de movimiento y dispositivo.
- **Servicios:** texto, separadores, fondos de las composiciones, acentos y hover adaptados. Los controles ilustrados usan los mismos tokens invertibles que los botones reales.
- **Proceso:** número activo dorado con texto negro en ambos modos; texto inactivo muted. Se refuerza ligeramente el overlay de la fotografía en Dark; la imagen conserva su color.
- **Portfolio:** cambia el fondo exterior, textos, metadata, tags y CTA superpuesto. Las fotografías y paletas artísticas de los proyectos en `app/mockups.css` se conservan.
- **CTA:** superficie crema alternativa en Light; charcoal en Dark con acento dorado y botón crema. Su color de texto, foco y botones usan variables locales.
- **FAQ:** hereda la paleta, incluyendo contenido expandido y bloque de formas de pago.
- **Formularios:** superficies claras/oscuras, placeholders legibles, límites visibles, foco dorado y controles seleccionados con texto contrastante. No cambian validación, pasos ni Resend.
- **Monograma de Preguntas:** `/brand/monogram-dark.png` sobre Light y `/brand/monogram-light.png` sobre Dark, con transparencia y baja opacidad. Se conserva oculto en pantallas pequeñas. Son variantes de la misma pieza existente; header y footer siguen tipográficos.
- **Tecnologías:** máscaras SVG con color heredado oscuro/claro y hover dorado.
- **Footer:** permanece oscuro en Light y usa negro más profundo en Dark; conserva texto claro, enlaces muted y foco dorado.
- **Selección y controles nativos:** selección dorada con texto negro; `color-scheme: light/dark` adapta menús nativos y scrollbar.

## QA

- `npm run lint`, `npm run typecheck`, `npm run test:theme`, `npm run test:forms` y `npm run build`: correctos. La prueba de formularios usa transporte simulado; no envió correos.
- 24 pares de contraste por modo: texto, placeholders, botones y links comprobados >= 4.5:1; límites de controles y foco >= 3:1. No equivale a una certificación completa WCAG.
- Bootstrap con Light/Dark del sistema, preferencia manual opuesta, valor inválido, migración, persistencia, almacenamiento bloqueado, sincronización entre pestañas, cambios del sistema y reduced motion probados con el código real.
- Ambos modos comprobados a 1440, 1280, 1024, 768, 430, 390 y 375 px. Sin overflow horizontal detectado en la página, encabezados, navegación, botones o formularios. Datos en `artifacts/light-dark/responsive-qa.json`.
- Revisión visual de desktop/mobile, selector de menú, secciones, formularios y footer. Cambio de modo conserva campos, etapa del diagnóstico y FAQ abierto; recarga conserva la selección.
- Build de producción servido en localhost; sin errores de consola/hidratación detectados durante la revisión.

Criterios de contraste: [WCAG, texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) y [WCAG, controles](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
