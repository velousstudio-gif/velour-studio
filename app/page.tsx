import Home from '@/components/experience-home';
import { getResendConfig } from '@/lib/resend-mail';
export const metadata = { alternates: { canonical: '/' } };
export default function Page(){return <Home contactEnabled={Boolean(getResendConfig())}/>}
