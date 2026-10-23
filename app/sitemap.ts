import type { MetadataRoute } from 'next';
import {projects} from '@/lib/content';
import { clientWorks } from '@/content/portfolio';
import { isPublicSite, siteUrl } from '@/lib/site-config';
export default function sitemap():MetadataRoute.Sitemap{if(!isPublicSite)return[];return['',...projects.map(p=>`/proyectos/${p.slug}`),...clientWorks.filter(w=>w.authorized).map(w=>`/trabajos/${w.slug}`)].map(path=>({url:`${siteUrl}${path}`,changeFrequency:'monthly',priority:path?0.7:1}))}
