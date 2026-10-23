import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
];
// Panel privado: nunca embebible, indexable ni cacheable.
const privateHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
  { key: 'Cache-Control', value: 'no-store' },
];

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  // 90: capturas de trabajos con texto nítido; 75: resto de imágenes (valor por defecto).
  images: { qualities: [75, 90] },
  // PGlite es solo para desarrollo/pruebas: no se empaqueta ni se sube a producción.
  serverExternalPackages: ['@electric-sql/pglite'],
  outputFileTracingExcludes: { '*': ['node_modules/@electric-sql/**'] },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/crm/:path*', headers: privateHeaders },
      { source: '/login/:path*', headers: privateHeaders },
    ];
  },
  async redirects() {
    return [
      { source: '/proyectos/crm-reclutamiento', destination: '/proyectos/recruitment-platform', permanent: true },
      { source: '/proyectos/dashboard-financiero', destination: '/#proyectos', permanent: true },
    ];
  },
};

export default nextConfig;
