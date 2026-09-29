import { siteContent } from '@/content/site-content';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import {ArrowLeft,ArrowUpRight} from 'lucide-react';
import {projects} from '@/lib/content';
import {ProjectVisual} from '@/components/project-visual';
import {Header,Footer} from '@/components/site';
export function generateStaticParams(){return projects.map(({slug})=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const p=projects.find(p=>p.slug===slug);return{title:p?.name||'Proyecto',description:p?.description,alternates:{canonical:'/proyectos/'+slug},openGraph:{title:(p?.name||'Proyecto')+' | Velour Studio',description:p?.description,url:'/proyectos/'+slug,type:'website',locale:'es_AR',siteName:'Velour Studio'}}}
export default async function Project({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const project=projects.find(p=>p.slug===slug);if(!project)notFound();return <><Header/><main className="container detail-page" id="inicio"><Link className="text-link" href={siteContent.links.works}><ArrowLeft size={16}/>{siteContent.copy.projectPage.volver_a_proyectos}</Link><h1>{project.name}</h1><div className="eyebrow"><span/>{project.category.toUpperCase()}{project.status === 'demo' && siteContent.copy.projectPage.concepto_de_demostracion}</div><ProjectVisual project={project}/><p>{project.detail}</p>{project.status === 'demo' && <p>{siteContent.copy.projectPage.este_proyecto_es_una_muestra_conceptual_del}</p>}<div className="tech-tags">{project.tech.map(t=><span key={t}>{t}</span>)}</div><a className="button primary" href={siteContent.links.contact}>{siteContent.copy.projectPage.quiero_una_solucion_asi}<ArrowUpRight size={17}/></a></main><Footer/></>}
