import { siteContent } from '@/content/site-content';
import { validEmail } from './contact-links';

export type Inquiry = Record<'name' | 'company' | 'email' | 'phone' | 'project' | 'audience' | 'situation' | 'budget' | 'message' | 'questionType', string> & { kind: 'project' | 'question' };

/** Shared endpoint validation: never trust radio/select values supplied by a client. */
export function validateInquiry(data: Record<string, unknown>): Inquiry | null {
  if (data.website || (data.kind !== 'project' && data.kind !== 'question')) return null;
  const fields = ['name', 'company', 'email', 'phone', 'project', 'audience', 'situation', 'budget', 'message', 'questionType'] as const;
  if (fields.some(key => data[key] !== undefined && typeof data[key] !== 'string')) return null;
  const clean = Object.fromEntries(fields.map(key => [key, typeof data[key] === 'string' ? data[key].trim() : ''])) as Record<typeof fields[number], string>;
  if (!clean.name || clean.name.length > 100 || !validEmail(clean.email) || clean.message.length < 10 || clean.message.length > 5000 || clean.company.length > 150 || clean.phone.length > 40) return null;
  const options = siteContent.diagnosticOptions;
  if (data.kind === 'project' && (!options.projectTypes.includes(clean.project) || !options.audiences.includes(clean.audience) || !options.situations.includes(clean.situation) || !['', ...options.budgets].includes(clean.budget))) return null;
  if (data.kind === 'question') {
    clean.questionType ||= siteContent.questionTypes[0];
    if (!siteContent.questionTypes.includes(clean.questionType)) return null;
    Object.assign(clean, { project: '', audience: '', situation: '', budget: '', company: '' });
  } else clean.questionType = '';
  return { ...clean, kind: data.kind };
}
