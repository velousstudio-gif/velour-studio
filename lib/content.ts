import { siteContent } from '@/content/site-content';
import { contactLinks } from './contact-links';

// Compatibility exports: edit content/site-content.ts, not this adapter.
export const contact = contactLinks(siteContent.contact);
export const services = siteContent.services;
export const projects = siteContent.projects;
export const plans = siteContent.prices;
export const faqs = siteContent.faqs.map(([question, answer]) => [question, answer
  .replaceAll('{landingPrice}', String(plans.find(plan => plan.id === 'landing')?.price ?? ''))
  .replaceAll('{webPrice}', String(plans.find(plan => plan.id === 'web')?.price ?? ''))
  .replaceAll('{commercePrice}', String(plans.find(plan => plan.id === 'commerce')?.price ?? ''))]);
export function projectInquiryHref(name: string) {
  const [path, hash] = siteContent.links.contact.split('#');
  return `${path || '/'}?plan=${encodeURIComponent(name)}${hash ? '#' + hash : ''}`;
}
