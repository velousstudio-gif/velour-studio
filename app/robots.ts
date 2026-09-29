import type { MetadataRoute } from 'next';
import { isPublicSite, siteUrl } from '@/lib/site-config';
export default function robots(): MetadataRoute.Robots {
  return isPublicSite
    ? { rules: { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: `${siteUrl}/sitemap.xml` }
    : { rules: { userAgent: '*', disallow: '/' } };
}
