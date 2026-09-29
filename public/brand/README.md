# Velour Studio · recursos de marca

El header y el footer de todas las páginas usan exclusivamente el wordmark tipográfico apilado VELOUR / STUDIO de `components/brand-logo.tsx`. Hereda el color de cada fondo, con las tipografías, tamaños y espaciados editoriales originales. La presencia de PNG en esta carpeta no cambia el wordmark.

- `favicon.png`: favicon principal y shortcut icon definidos en `app/layout.tsx`.
- `logo-dark.png` y `logo-light.png`: conservados como recursos de marca; no se muestran en la web.
- `monogram-dark.png`: marca de agua editorial en la sección clara «Nuestra mirada» (`#manifiesto`), amplia y tenue, sin fondo ni marco. En móvil se desplaza al borde derecho y queda parcialmente recortada. Se renderiza con next/image, proporción cuadrada y transparencia, como decoración oculta a lectores de pantalla.
- `monogram-light.png`: reservado; no se añadió al contacto para conservar el protagonismo del título. Ningún monograma se usa en header ni footer.
- `gmail-avatar.png`: exclusivo para Gmail y perfiles; no se usa en componentes ni metadata de la web.

Los archivos originales se conservan sin modificaciones.
