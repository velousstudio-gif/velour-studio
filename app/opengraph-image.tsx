import { siteContent } from '@/content/site-content';
import { ImageResponse } from 'next/og';
export const alt = siteContent.seo.socialImageAlt;
export const size = {width:1200,height:630};
export const contentType = 'image/png';
export default function Image(){return new ImageResponse(<div style={{background:'#f7f5f0',width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:75,color:'#090909'}}><div style={{fontSize:26,letterSpacing:6}}>{siteContent.copy.socialImage.velour_studio}</div><div style={{fontSize:78,maxWidth:1050,letterSpacing:-4,lineHeight:1.08}}>{siteContent.copy.socialImage.experiencias_digitales_creadas_para_destacar}</div><div style={{fontSize:21,color:'#82704e',letterSpacing:3}}>{siteContent.copy.socialImage.estudio_independiente_web_commerce_branding}</div></div>,size)}
