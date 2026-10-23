import { organizations } from './organizations';

export interface MarketDraft {
  organization: string;
  newOrganization: string;
  title: string;
  description: string;
  collateral: string;
  metric: string;
  date: string;
}
export const steps = ['Organization', 'Proposal', 'Measure', 'Closing date', 'Review'];
export const emptyDraft: MarketDraft = { organization: 'gnosis', newOrganization: '', title: '', description: '', collateral: 'sDAI', metric: 'GNO price in sDAI', date: '' };
export function tomorrowUTC() {
  const date = new Date(); date.setUTCDate(date.getUTCDate() + 1); return date.toISOString().slice(0, 10);
}
export function organizationName(draft: MarketDraft) {
  return draft.organization === 'new' ? draft.newOrganization.trim() || 'New organization' : organizations.find(org => org.id === draft.organization)?.name || 'Organization';
}
export function validateStep(draft: MarketDraft, step: number): Partial<Record<keyof MarketDraft, string>> {
  const errors: Partial<Record<keyof MarketDraft, string>> = {};
  if (step === 0) {
    if (draft.organization !== 'new' && !organizations.some(org => org.id === draft.organization)) errors.organization = 'Choose an organization.';
    if (draft.organization === 'new' && (draft.newOrganization.trim().length < 2 || draft.newOrganization.length > 60)) errors.newOrganization = 'Use 2–60 characters.';
  }
  if (step === 1) {
    if (draft.title.trim().length < 10 || draft.title.length > 120) errors.title = 'Use a clear proposal title of 10–120 characters.';
    if (draft.description.trim().length < 20 || draft.description.length > 500) errors.description = 'Describe the proposal in 20–500 characters.';
  }
  if (step === 2) {
    if (!['sDAI', 'USDS'].includes(draft.collateral)) errors.collateral = 'Choose supported collateral.';
    if (draft.metric.trim().length < 5 || draft.metric.length > 100) errors.metric = 'Describe a measurable outcome in 5–100 characters.';
  }
  if (step === 3 && (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date) || Number.isNaN(Date.parse(draft.date)) || new Date(draft.date).toISOString().slice(0, 10) !== draft.date || draft.date < tomorrowUTC())) errors.date = 'Choose tomorrow or a later date in UTC.';
  return errors;
}
export function loadDraft(): MarketDraft {
  try {
    const saved = JSON.parse(localStorage.getItem('futarchy-create-v2') || 'null');
    if (saved && Object.keys(emptyDraft).every(key => typeof saved[key] === 'string')) return saved;
  } catch { /* Start fresh when browser storage is unavailable. */ }
  return { ...emptyDraft };
}
export interface CreationReceipt { hash: string; createdAt: string; address: string; draft: MarketDraft }
export async function saveDemoMarket(draft: MarketDraft, address: string): Promise<CreationReceipt> {
  const createdAt = new Date().toISOString();
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify({ draft, address, createdAt })));
  const receipt = { hash: `0x${Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2, '0')).join('')}`, createdAt, address, draft };
  const receipts = JSON.parse(localStorage.getItem('futarchy-demo-receipts') || '[]');
  localStorage.setItem('futarchy-demo-receipts', JSON.stringify([receipt, ...(Array.isArray(receipts) ? receipts : [])].slice(0, 20)));
  window.dispatchEvent(new Event('futarchy-receipts-updated'));
  return receipt;
}
