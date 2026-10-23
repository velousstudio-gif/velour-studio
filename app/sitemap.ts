import type { MetadataRoute } from 'next';
import {projects} from '@/lib/content';
import { clientWorks } from '@/content/portfolio';
import { isPublicSite, siteUrl } from '@/lib/site-config';
export default function sitemap():MetadataRoute.Sitemap{if(!isPublicSite)return[];const paths=['','/conceptos',...projects.map(p=>`/proyectos/${p.slug}`),...clientWorks.filter(w=>w.authorized).map(w=>`/trabajos/${w.slug}`)];const english=['/en','/en/conceptos',...clientWorks.filter(w=>w.authorized).map(w=>`/en/trabajos/${w.slug}`)];return[...paths,...english].map(path=>({url:`${siteUrl}${path}`,changeFrequency:'monthly',priority:path?0.7:1}))}
