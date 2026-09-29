import { siteContent } from '@/content/site-content';
import { externalUrl } from './contact-links';
export const siteTitle = siteContent.seo.title;
export const siteDescription = siteContent.seo.description;
export const siteUrl = new URL(externalUrl(siteContent.publication.siteUrl) || 'http://localhost:3000').origin;
export const isPublicSite = !['localhost', '127.0.0.1', '0.0.0.0', '[::1]'].includes(new URL(siteUrl).hostname);
