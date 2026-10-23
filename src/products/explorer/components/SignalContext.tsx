import { useState } from 'react';
import type { Market } from '../types';
import { formatCreator } from '../lib/format';
import { chainById } from '../data/chains';
import { getAddressExplorer, externalLinks } from '../data/externalLinks';
import { getLeadTradeOutcome, outcomeDisplayValue } from '../lib/marketOutcomes';
import { isScalarMarket } from '../lib/marketKind';
import { CopyButton } from './CopyButton';
export function SignalContext({ market }: { market?: Market }) {
  const [agent, setAgent] = useState(false);
  const lead = market && (getLeadTradeOutcome(market) ?? market.outcomes[0]);
  const record = market ? JSON.stringify({ id: market.id, chainId: market.chainId, question: market.question, source: market.provenance.origin, outcomes: market.outcomes.map(o => ({ name: o.name, price: Number.isFinite(o.price) ? o.price : null })) }, null, 2) : null;
  return <section className="signal-context-wrap" aria-label="How to read this signal"><div className="signal-context">
    <div><span>Asked by</span>{market ? <a href={getAddressExplorer(chainById(market.chainId), market.creatorAddress)} target="_blank" rel="noreferrer">{formatCreator(market.creator, market.creatorAddress)} <small>Asker profile ↗</small></a> : <strong>People, DAOs, protocols &amp; agents</strong>}</div>
    <div><span>Priced</span><strong>{market ? isScalarMarket(market) ? `The estimate in ${market.unit ?? 'the stated unit'}` : `The chance of ${lead?.name ?? 'each outcome'}` : 'The chance of each outcome'}</strong></div>
    <div><span>How to use</span><strong>{market && lead ? isScalarMarket(market) ? 'Read the estimate against the bounds.' : `${outcomeDisplayValue(market, lead)} is a market signal, not a guarantee.` : 'Read the odds; trading is optional.'}</strong></div>
    <div className="signal-reader-switch" role="group" aria-label="Signal reader"><button type="button" aria-pressed={!agent} onClick={() => setAgent(false)}>Human</button><button type="button" aria-pressed={agent} onClick={() => setAgent(true)}>Agent</button></div>
  </div>{agent && <div className="agent-record"><div><strong>{record ? 'Record example' : 'Read Seer programmatically'}</strong><p>People and agents can read the same signal. These records are snapshots. Use the documented API for current data.</p><a href={`${externalLinks.docs}developers/api`} target="_blank" rel="noreferrer">API documentation ↗</a></div>{record && <div><CopyButton value={record} label="Copy record example" /><pre>{record}</pre></div>}</div>}</section>;
}
