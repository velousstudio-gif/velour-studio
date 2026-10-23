import type { Metadata } from 'next';
import { VslThanksView } from '@/components/pages/vsl-thanks';

export const metadata: Metadata = { title: 'Gracias', robots: { index: false, follow: false } };
export default function VslThanks() { return <VslThanksView locale="es" />; }
