import type { ReactNode } from 'react';
import { organizations } from '../data/organizations';
import { tomorrowUTC, type MarketDraft } from '../data/creation';

type Field = keyof MarketDraft;
interface Props { draft: MarketDraft; step: number; errors: Partial<Record<Field, string>>; onChange: (field: Field, value: string) => void }
export function CreateFields({ draft, step, errors, onChange }: Props) {
  function field(key: Field, label: string, control: ReactNode, hint?: string) {
    return <div className="creation-field"><label htmlFor={`create-${key}`}>{label}</label>{control}<small id={`hint-${key}`}>{hint}</small>{errors[key] && <p className="creation-error" id={`error-${key}`}>{errors[key]}</p>}</div>;
  }
  const attrs = (key: Field) => ({ id: `create-${key}`, name: key, value: draft[key], 'aria-invalid': !!errors[key], 'aria-describedby': `hint-${key}${errors[key] ? ` error-${key}` : ''}`, onChange: (event: { target: { value: string } }) => onChange(key, event.target.value) });
  return <>
    {step === 0 && <>{field('organization', 'Organization', <select {...attrs('organization')}>{organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}<option value="new">New organization</option></select>)}{draft.organization === 'new' && field('newOrganization', 'New organization name', <input {...attrs('newOrganization')} maxLength={60} autoComplete="organization" />, `${draft.newOrganization.length}/60 characters`)}</>}
    {step === 1 && <>{field('title', 'Proposal title', <input {...attrs('title')} maxLength={120} placeholder="Renew the Risk Steward mandate" />, `${draft.title.length}/120 characters`)}{field('description', 'Short description', <textarea {...attrs('description')} maxLength={500} rows={4} placeholder="Explain the decision and what passing the proposal changes." />, `${draft.description.length}/500 characters`)}</>}
    {step === 2 && <>{field('collateral', 'Collateral token', <select {...attrs('collateral')}><option>sDAI</option><option>USDS</option></select>, 'The token used to fund both conditional worlds.')}{field('metric', 'Success metric', <input {...attrs('metric')} maxLength={100} />, 'Specify the asset or measurable outcome and its unit. Voters retain the final decision.')}</>}
    {step === 3 && field('date', 'Closing date', <input {...attrs('date')} type="date" min={tomorrowUTC()} />, 'Trading closes at 23:59 UTC on this date. Choose tomorrow or later.')}
  </>;
}
