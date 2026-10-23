import type { Metadata } from 'next';
import { VslThanksView } from '@/components/pages/vsl-thanks';

export const metadata: Metadata = { title: 'Thank you', robots: { index: false, follow: false } };
export default function VslThanksEn() { return <VslThanksView locale="en" />; }
