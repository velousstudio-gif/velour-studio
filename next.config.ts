import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  async redirects() {
    return [
      { source: '/proyectos/crm-reclutamiento', destination: '/proyectos/recruitment-platform', permanent: true },
      { source: '/proyectos/dashboard-financiero', destination: '/#proyectos', permanent: true },
    ];
  },
};

export default nextConfig;
