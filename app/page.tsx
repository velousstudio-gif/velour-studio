import Home from '@/components/site';
import { getResendConfig } from '@/lib/resend-mail';
export const metadata = { alternates: { canonical: '/' } };
export default function Page(){return <Home contactEnabled={Boolean(getResendConfig())}/>}
