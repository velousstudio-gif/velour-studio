import type { MetadataRoute } from 'next';
import {projects} from '@/lib/content';
import { isPublicSite, siteUrl } from '@/lib/site-config';
export default function sitemap():MetadataRoute.Sitemap{if(!isPublicSite)return[];return['',...projects.map(p=>`/proyectos/${p.slug}`)].map(path=>({url:`${siteUrl}${path}`,changeFrequency:'monthly',priority:path?0.7:1}))}
