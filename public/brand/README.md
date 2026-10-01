# Velour Studio · recursos de marca

El header y el footer de todas las páginas usan exclusivamente el wordmark tipográfico apilado VELOUR / STUDIO de `components/brand-logo.tsx`. Hereda el color de cada fondo, con las tipografías, tamaños y espaciados editoriales originales. La presencia de PNG en esta carpeta no cambia el wordmark.

- `favicon.png`: favicon principal y shortcut icon definidos en `app/layout.tsx`.
- `logo-dark.png` y `logo-light.png`: conservados como recursos de marca; no se muestran en la web.
- `monogram-dark.png`: conservado como recurso editorial. El recorrido comercial actual ya no incluye la antigua sección «Nuestra mirada» y no fuerza este recurso en otra sección.
- `monogram-light.png`: marca de agua del CTA oscuro «Tu próximo proyecto…», con opacidad 0.035 y parallax de ±15 px solo en escritorio. Se sirve con Next Image, conserva proporciones y no interviene en el layout. Ningún monograma se usa en header ni footer.
- `gmail-avatar.png`: exclusivo para Gmail y perfiles; no se usa en componentes ni metadata de la web.

Los archivos originales se conservan sin modificaciones.
