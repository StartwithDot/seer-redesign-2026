import { useState } from 'react';
import { SAVED_MARKET, chainAddressUrl } from '../data/entities';
import { marketOutcomeRows, marketRecordFields } from '../data/market-record';
import { downloadTextFile } from '../data/prediction-csv';
import { OracleProvenance } from './OracleProvenance';

export function MarketRecordPanel() {
  const [notice, setNotice] = useState('');
  const exportMarket = () => {
    try { downloadTextFile('seer-risk-market-source.json', JSON.stringify(SAVED_MARKET, null, 2), 'application/json'); setNotice('Complete saved market exported.'); }
    catch { setNotice('Download unavailable. The complete record is still readable below.'); }
  };
  return <details className="risk-market-record">
    <summary>Complete market record · {SAVED_MARKET.outcomes.length} outcomes</summary>
    <p>The saved market asks about defaults before 2027. Its oracle state is separate from the Q3 interface round. No to All and the invalid outcome are excluded from the 33-asset roster.</p>
    <button className="risk-secondary-button" type="button" onClick={exportMarket}>Export market record</button>
    <p role="status">{notice}</p>
    <details><summary>Identity, settlement and timestamps</summary><dl>{marketRecordFields.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl></details>
    <details><summary>Outcome tokens · 33 assets + 2 market outcomes</summary><div className="risk-source-series">
      {marketOutcomeRows.map(row => <details key={row.index}><summary>{row.name} · {row.kind}</summary><dl>
        <div><dt>API outcome index</dt><dd>{row.index}</dd></div>
        <div><dt>Wrapped token</dt><dd><a href={chainAddressUrl(row.token)} target="_blank" rel="noreferrer">{row.token}</a></dd></div>
        <div><dt>Payout numerator · raw units</dt><dd>{row.payout}</dd></div>
        <div><dt>Saved API odds</dt><dd>{row.odds === null ? 'Not published' : `${row.odds}%`}</dd></div>
      </dl></details>)}
    </div></details>
    <OracleProvenance />
    <details><summary>Oracle questions and encoded terms</summary>
      {SAVED_MARKET.encodedQuestions.map((question, index) => <p className="risk-encoded-question" key={index}>{question}</p>)}
      {SAVED_MARKET.questions.map(question => <dl key={question.id}>{Object.entries(question).map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{String(value)}</dd></div>)}</dl>)}
      <p>No answer or dispute is recorded in this saved response.</p>
    </details>
    <details><summary>Original saved market JSON</summary><pre tabIndex={0} aria-label="Original saved market JSON">{JSON.stringify(SAVED_MARKET, null, 2)}</pre></details>
  </details>;
}
