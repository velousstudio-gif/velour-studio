import { siteContent } from '@/content/site-content';
import { contactLinks } from './contact-links';

// Compatibility exports: edit content/site-content.ts, not this adapter.
export const contact = contactLinks(siteContent.contact);
export const services = siteContent.services;
export const projects = siteContent.projects;
export const plans = siteContent.prices;
export const faqs = siteContent.faqs.map(faq => ({...faq, answer: faq.answer
  .replaceAll('{landingPrice}', String(plans.find(plan => plan.id === 'landing')?.price ?? ''))
  .replaceAll('{webPrice}', String(plans.find(plan => plan.id === 'web')?.price ?? ''))
  .replaceAll('{commercePrice}', String(plans.find(plan => plan.id === 'commerce')?.price ?? ''))
  .replaceAll('{landingTime}', siteContent.timelines.landing)
  .replaceAll('{webTime}', siteContent.timelines.web)
  .replaceAll('{commerceTime}', siteContent.timelines.commerce)}));
export function projectInquiryHref(name: string) {
  const [path, hash] = siteContent.links.contact.split('#');
  return `${path || '/'}?plan=${encodeURIComponent(name)}${hash ? '#' + hash : ''}`;
}
