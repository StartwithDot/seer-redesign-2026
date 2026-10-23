import { useEffect, useRef, useState, type FormEvent } from 'react';
import { emptyDraft, loadDraft, organizationName, saveDemoMarket, steps, validateStep, type CreationReceipt, type MarketDraft } from '../data/creation';
import { organizations } from '../data/organizations';
import type { WalletController } from '../hooks/useWallet';
import { CreateFields } from './CreateFields';
import { CreatePreview } from './CreatePreview';

interface Props { onNavigate: (hash: string) => void; wallet: WalletController; onOpenWallet: () => void }
export function CreateView({ onNavigate, wallet, onOpenWallet }: Props) {
  const [draft, setDraft] = useState(loadDraft);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof MarketDraft, string>>>({});
  const [receipt, setReceipt] = useState<CreationReceipt>();
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { try { localStorage.setItem('futarchy-create-v2', JSON.stringify(draft)); } catch { setFailure('Browser storage is unavailable. Your brief cannot be saved.'); } }, [draft]);
  useEffect(() => { heading.current?.focus(); }, [step, receipt]);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || pending || document.querySelector('[role="dialog"]')) return;
      event.preventDefault();
      if (receipt) { onNavigate('#/'); return; }
      if (step > 0) { setStep(current => current - 1); setErrors({}); } else onNavigate('#/');
    };
    window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey);
  }, [step, pending, receipt, onNavigate]);
  function change(field: keyof MarketDraft, value: string) {
    setErrors(current => ({ ...current, [field]: undefined }));
    setDraft(current => {
      const next = { ...current, [field]: value };
      if (field === 'organization' || field === 'collateral') {
        const token = organizations.find(org => org.id === next.organization)?.token || 'Token';
        next.metric = `${token} price in ${next.collateral}`;
      }
      return next;
    });
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); setFailure('');
    const invalidStep = (step === 4 ? [0, 1, 2, 3] : [step]).find(index => Object.keys(validateStep(draft, index)).length);
    if (invalidStep !== undefined) {
      const invalid = validateStep(draft, invalidStep); setErrors(invalid); setStep(invalidStep);
      window.setTimeout(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0); return;
    }
    if (step < 4) { setStep(step + 1); return; }
    if (!wallet.address) { onOpenWallet(); return; }
    setPending(true);
    try { setReceipt(await saveDemoMarket(draft, wallet.address)); }
    catch { setFailure('Could not save the local demo receipt. Check browser storage and try again.'); }
    finally { setPending(false); }
  }
  return <div className="route-view creation-page">
    <nav className="route-bar" aria-label="Breadcrumb"><a href="#/">Futarchy</a><span>/</span><strong>Create market</strong></nav>
    <header className="creation-heading"><span className="eyebrow">CREATE A CONDITIONAL MARKET</span><h1>Frame the decision.</h1><p>Define what passes, what to measure, and when to close. This local demo saves a reviewable brief; it does not deploy a market or request a signature.</p></header>
    {receipt ? <section className="create-success" role="status"><span className="eyebrow">LOCAL DEMO COMPLETE</span><h2 ref={heading} tabIndex={-1}>Your market brief is saved.</h2><p>{receipt.draft.title}</p><p>Demo receipt hash, not an on-chain transaction:</p><code className="receipt-hash">{receipt.hash}</code><p>Saved {new Date(receipt.createdAt).toLocaleString()} for {receipt.address}. No funds moved.</p><div className="creation-actions"><button className="primary-button" onClick={() => onNavigate('#/?section=milestones')}>Back to milestones</button><button className="quiet-button" onClick={() => { setDraft({ ...emptyDraft }); setReceipt(undefined); setStep(0); }}>Create another</button><a className="quiet-button" href="https://app.seer.pm/" target="_blank" rel="noreferrer">Open on seer.pm ↗</a></div></section> : <div className="creation-layout">
      <form ref={form} className="creation-form" noValidate onSubmit={submit}>
        <ol className="creation-steps" aria-label="Creation progress">{steps.map((label, index) => <li key={label}><button type="button" disabled={index > step} title={index > step ? 'Complete the preceding step first' : undefined} aria-current={index === step ? 'step' : undefined} onClick={() => { setErrors({}); setStep(index); }}><span>{index < step && !Object.keys(validateStep(draft, index)).length ? '✓' : index + 1}</span>{label}</button></li>)}</ol>
        <div className="creation-step-body"><h2 tabIndex={-1} ref={heading}>{steps[step]}</h2><CreateFields draft={draft} step={step} errors={errors} onChange={change} />
          {Object.keys(errors).length > 0 && <p className="creation-error" role="alert">Please correct the highlighted fields.</p>}
          {step === 4 && <><dl className="creation-review">{[['Organization', organizationName(draft)], ['Proposal', draft.title], ['Description', draft.description], ['Collateral', draft.collateral], ['Success metric', draft.metric], ['Closes', `${draft.date} · 23:59 UTC`]].map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl><p className="creation-note">A connected wallet identifies this local brief. Creating a live market requires the production app. This demo hash cannot be used in a block explorer.</p></>}
          {failure && <p role="alert" className="creation-error">{failure}</p>}
        </div>
        <footer><button className="quiet-button" type="button" disabled={pending} onClick={() => step ? setStep(step - 1) : onNavigate('#/')}>{step ? 'Back' : 'Cancel'}</button><button className="primary-button" type="submit" disabled={pending}>{pending ? 'Saving…' : step < 4 ? 'Continue' : wallet.address ? 'Save demo market' : 'Connect wallet to save'}</button></footer>
      </form><CreatePreview draft={draft} />
    </div>}
  </div>;
}
