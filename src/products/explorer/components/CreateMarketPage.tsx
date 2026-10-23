import { useEffect, useRef, useState, type FormEvent } from 'react';
import { creationTypes, getCreationParent } from '../data/creation';
import { externalLinks } from '../data/navigation';
import type { WalletController } from '../hooks/useWallet';
import { validCreationDraft } from '../lib/creationDraft';
import { CopyButton } from './CopyButton';

type Props = { query: URLSearchParams; wallet: WalletController; onOpenWallet: () => void };
export function CreateMarketPage({ query, wallet, onOpenWallet }: Props) {
  const [selected, setSelected] = useState('');
  const [step, setStep] = useState(1);
  const [question, setQuestion] = useState('');
  const [rule, setRule] = useState('');
  const [deadline, setDeadline] = useState('');
  const [outcomes, setOutcomes] = useState('Yes\nNo');
  const [unit, setUnit] = useState('');
  const [lower, setLower] = useState('0');
  const [upper, setUpper] = useState('100');
  const heading = useRef<HTMLHeadingElement>(null);
  const active = creationTypes.find((type) => type.id === selected);
  const parent = getCreationParent(query);
  const invalidParent = query.has('parent') && !parent;
  const numeric = selected.includes('scalar');
  const answers = outcomes.split('\n').map((s) => s.trim()).filter(Boolean);
  const valid = validCreationDraft({ type: selected, question, rule, deadline, outcomes, unit, lower, upper });
  const draft = { type: selected, question: question.trim(), resolutionRule: rule.trim(), deadline, ...(numeric ? { unit, lowerBound: Number(lower), upperBound: Number(upper) } : { outcomes: answers }), ...(parent ? { parent: parent.market.id, parentOutcome: parent.outcome.id, chainId: parent.market.chainId } : {}) };
  useEffect(() => { heading.current?.focus(); }, [step]);
  const submit = (event: FormEvent) => { event.preventDefault(); if (valid) setStep(3); };
  return <section className="create-market-page" data-align="container">
    <div className="creation-progress" aria-label={`Step ${step} of 3`}>{['Answer structure', 'Question & rules', 'Review'].map((label, i) => <span className={step === i + 1 ? 'is-active' : ''} key={label}>{label}</span>)}</div>
    <div className="page-title-row"><div><p className="eyebrow">Market creation · Step {step} of 3</p><h1 ref={heading} tabIndex={-1}>{step === 1 ? 'What do you want to know?' : step === 2 ? 'Make it answerable.' : 'Review your question.'}</h1><p>{step === 1 ? 'Choose an answer structure. Draft here, then deploy in the live Seer app.' : step === 2 ? 'A clear question needs a source, a deadline, and a resolution rule.' : 'Your draft is ready to copy. Contract deployment takes place in the live app.'}</p></div></div>
    {parent && <aside className="creation-parent"><span className="eyebrow">Conditional market</span><h2>{parent.market.question}</h2><p>Parent outcome: <strong>{parent.outcome.name}</strong>. Its tokens serve as collateral and become worthless if another outcome wins.</p><a href={`#/markets/${parent.market.chainId}/${parent.market.slug}`}>View parent market →</a></aside>}
    {invalidParent && <p role="alert" className="notice">The parent market or outcome is unavailable. Return to the market and choose an outcome.</p>}
    {step === 1 && <><div className="market-type-workbench"><fieldset className="market-type-list"><legend>Answer structure</legend>{creationTypes.map((type) => <label className={`creation-type ${selected === type.id ? 'is-active' : ''}`} key={type.id}><input type="radio" name="creation-type" value={type.id} checked={selected === type.id} onChange={() => setSelected(type.id)} /><span><strong>{type.label}</strong><span>{type.detail}</span></span></label>)}</fieldset><div className="market-type-preview"><p className="eyebrow">{active ? 'Question example' : 'Start with a question'}</p><h2>{active?.label ?? 'Every outcome has a price.'}</h2><p>{active?.detail ?? 'Binary decisions, multiple answers, or a number within a range.'}</p>{active && <div className="rule-preview"><strong>{active.example}</strong><p>{active.outcomes}</p></div>}<a href={externalLinks.docs} target="_blank" rel="noreferrer">Read market rules ↗</a></div></div><div className="creation-actions"><p role="status">{active ? `${active.label} selected` : 'Choose an answer structure to continue.'}</p><button className="primary-button" disabled={!selected || invalidParent} title={!selected ? 'Choose an answer structure first' : invalidParent ? 'A valid parent outcome is required' : undefined} type="button" onClick={() => setStep(2)}>Next: question &amp; rules →</button></div></>}
    {step === 2 && <form className="creation-draft-form" onSubmit={submit}><label>Question<input autoFocus required minLength={10} maxLength={300} value={question} onChange={e => setQuestion(e.target.value)} placeholder={active?.example} /></label><div className="creation-field-pair"><label>Resolution deadline<input type="datetime-local" required value={deadline} min={new Date().toISOString().slice(0, 16)} onChange={e => setDeadline(e.target.value)} /><small>Your local time zone</small></label><label>Answer structure<input value={active?.label ?? ''} readOnly /></label></div><label>Resolution source &amp; rules<textarea required minLength={15} value={rule} onChange={e => setRule(e.target.value)} rows={3} placeholder="Name the public source, what counts as an answer, and what happens if the event is cancelled." /></label>{numeric ? <div className="creation-field-pair"><label>Unit<input required value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. USD, %, seats" /></label><label>Lower bound<input type="number" required step="any" value={lower} onChange={e => setLower(e.target.value)} /></label><label>Upper bound<input type="number" required step="any" value={upper} onChange={e => setUpper(e.target.value)} /></label></div> : <label>Outcomes<textarea required value={outcomes} onChange={e => setOutcomes(e.target.value)} rows={3} /><small>One unique outcome per line. At least two are required.</small></label>}<div className="creation-actions"><button className="secondary-button" type="button" onClick={() => setStep(1)}>Back</button><button className="primary-button" type="submit" disabled={!valid} title={!valid ? 'Complete the question, future deadline, resolution rules and valid outcomes or bounds' : undefined}>Review draft →</button></div></form>}
    {step === 3 && <div className="creation-review"><h2>{question}</h2><dl><div><dt>Answer structure</dt><dd>{active?.label}</dd></div><div><dt>Resolution deadline</dt><dd>{new Date(deadline).toLocaleString()}</dd></div><div><dt>Rules &amp; source</dt><dd>{rule}</dd></div><div><dt>{numeric ? 'Bounds' : 'Outcomes'}</dt><dd>{numeric ? `${lower} to ${upper} ${unit}` : answers.join(' · ')}</dd></div></dl><div className="creation-copy"><span>Copy this draft to configure in Seer</span><CopyButton value={JSON.stringify(draft, null, 2)} label="Copy market creation draft" /></div><p className="notice">No contract has been deployed. The live app will ask you to configure the market, verify its rules, and approve any deployment with your wallet. This draft is not transferred automatically.</p><div className="creation-actions"><button className="secondary-button" type="button" onClick={() => setStep(2)}>Edit question</button>{!wallet.account ? <button className="primary-button" type="button" onClick={onOpenWallet}>Connect wallet</button> : <a className="primary-button" href={externalLinks.liveApp} target="_blank" rel="noreferrer">Continue in live Seer ↗</a>}</div></div>}
    <p className="creation-security"><a href={externalLinks.kleros} target="_blank" rel="noreferrer">Secured by Kleros ↗</a><span>Disputed answers can be escalated to arbitration.</span></p>
  </section>;
}
