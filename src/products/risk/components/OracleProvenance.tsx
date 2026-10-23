import { useState } from 'react';
import { oracleRecords, oracleStatus, REALITY_DEPLOYMENT } from '../data/provenance';
import { ArrowUpRight } from './Icons';

export function OracleProvenance({ initiallyOpen = false }: { initiallyOpen?: boolean }) {
  const [notice, setNotice] = useState('');
  const copy = async (value: string) => {
    try { await navigator.clipboard.writeText(value); setNotice('Question ID copied.'); }
    catch { setNotice('Select and copy the question ID below.'); }
  };
  return <details className="risk-oracle-provenance" open={initiallyOpen || undefined}>
    <summary>Resolution provenance · Reality.eth / Kleros</summary>
    {!oracleRecords.length && <p role="status">No oracle question is recorded.</p>}
    {oracleRecords.map(question => <section key={question.id} aria-label="Oracle question provenance">
      <div className="risk-oracle-heading"><strong>Reality.eth question</strong><span>{oracleStatus(question)}</span></div>
      <label>Question ID<input readOnly value={question.id} onFocus={event => event.target.select()} /></label>
      <div className="risk-provenance-links">
        <a href={question.realityUrl} target="_blank" rel="noreferrer">View question and answers <ArrowUpRight /></a>
        <button className="risk-inline-button" type="button" onClick={() => void copy(question.id)}>Copy question ID</button>
        <a href={question.arbitratorUrl} target="_blank" rel="noreferrer">{question.arbitratorName} arbitrator <ArrowUpRight /></a>
      </div>
      <dl>
        <div><dt>Dispute window</dt><dd>{question.timeout / 3600} hours</dd></div>
        <div><dt>Opened</dt><dd>{new Date(question.opening_ts * 1000).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC</dd></div>
        <div><dt>Finalization</dt><dd>{question.finalize_ts ? `${new Date(question.finalize_ts * 1000).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC` : 'Not recorded'}</dd></div>
        <div><dt>Arbitration</dt><dd>{question.is_pending_arbitration ? 'Pending; dispute ID not supplied' : 'No dispute recorded'}</dd></div>
        <div><dt>Answer</dt><dd>{question.hasAnswer ? question.best_answer : 'Not published'}</dd></div>
      </dl>
    </section>)}
    <p role="status">{notice}</p>
    <p>Answer and dispute states reflect the saved record. The question page exposes current answers and any arbitration.</p>
    <a className="risk-inline-button" href={REALITY_DEPLOYMENT.source} target="_blank" rel="noreferrer">Official oracle deployment <ArrowUpRight /></a>
  </details>;
}
