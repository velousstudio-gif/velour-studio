import { getResendConfig, sendInquiry } from '@/lib/resend-mail';
import { validEmail } from '@/lib/contact-links';
import { siteContent } from '@/content/site-content';
import { siteUrl } from '@/lib/site-config';
import {NextResponse} from 'next/server';
export async function POST(request:Request){
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin&&origin!==siteUrl)return NextResponse.json({error:'Origen no permitido.'},{status:403});
 if(!request.headers.get('content-type')?.includes('application/json'))return NextResponse.json({error:'Formato no permitido.'},{status:415});
 let data:Record<string,unknown>;
 try{const text=await request.text();if(text.length>16000)return NextResponse.json({error:'La consulta es demasiado extensa.'},{status:413});data=JSON.parse(text);if(!data||typeof data!=='object'||Array.isArray(data))throw new Error();}catch{return NextResponse.json({error:'La consulta no tiene un formato válido.'},{status:400})}
 if(data.website)return NextResponse.json({error:'No pudimos validar la consulta.'},{status:400});
 const fields=['name','company','email','phone','project','budget','message'] as const;
 const clean=Object.fromEntries(fields.map(key=>[key,typeof data[key]==='string'?(data[key] as string).trim():''])) as Record<typeof fields[number], string>;
 if(!clean.name||clean.name.length>100||!validEmail(clean.email)||clean.email.length>254||clean.message.length<10||clean.message.length>5000||clean.company.length>150||clean.phone.length>40||!siteContent.form.projectTypes.includes(clean.project)||!['', ...siteContent.form.budgets].includes(clean.budget))return NextResponse.json({error:'Revisá los campos e incluí un mensaje de al menos 10 caracteres.'},{status:400});
 const resendConfig=getResendConfig();
 if(!resendConfig)return NextResponse.json({error:'El envío de consultas todavía no está habilitado. Por favor, intentá más tarde.'},{status:503});
 try{await sendInquiry(resendConfig,clean);return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'No pudimos enviar tu consulta. Intentá nuevamente en unos minutos.'},{status:502})}
}
