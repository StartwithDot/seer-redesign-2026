import { useState } from 'react';
import { chainById } from '../data/chains';
import { getAddressExplorer } from '../data/externalLinks';
import { getOutcomeHolders } from '../data/marketEvidence';
import { formatAddress } from '../lib/format';
import { CopyButton } from './CopyButton';
import type { Market } from '../types';

interface MarketHoldersPanelProps {
  market: Market;
}

export function MarketHoldersPanel({ market }: MarketHoldersPanelProps) {
  const firstOutcome = market.outcomes.find((outcome) => outcome.id !== 'estimate') ?? market.outcomes[0];
  const [outcomeId, setOutcomeId] = useState(firstOutcome.id);
  const outcome = market.outcomes.find((item) => item.id === outcomeId) ?? firstOutcome;
  const holders = getOutcomeHolders(market, outcome);
  const chain = chainById(market.chainId);

  return (
    <div className="holders-panel">
      <div className="evidence-panel-heading">
        <div>
          <h3>Top Holders</h3>
          <p>{market.provenance.origin === 'captured-api' ? 'Captured token balances; open a contract to verify current holdings.' : 'Illustrative per-outcome balances.'}</p>
        </div>
        <label>
          <span>Outcome</span>
          <select value={outcomeId} onChange={(event) => setOutcomeId(event.target.value)}>
            {market.outcomes.filter((item) => item.id !== 'estimate').map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </label>
      </div>
      {!holders.length && <div className="empty-inline" role="status"><strong>No holder records in this sample.</strong><p>Choose another outcome or inspect the live app for current ownership.</p></div>}
      {holders.length > 0 && <div className="table-scroll">
        <table>
          <thead>
            <tr><th>Account</th><th>Address</th><th>Balance</th>{market.provenance.origin !== 'captured-api' && <th>Share of sample</th>}</tr>
          </thead>
          <tbody>
            {holders.map((holder) => (
              <tr key={holder.id}>
                <td><strong>{holder.account}</strong></td>
                <td><a href={getAddressExplorer(chain, holder.address)} target="_blank" rel="noreferrer">{formatAddress(holder.address)} ↗</a></td>
                <td className="numeric" title={holder.exactBalance}>{holder.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })} shares{holder.exactBalance && <CopyButton value={holder.exactBalance} label="Copy exact holder balance" />}</td>
                {market.provenance.origin !== 'captured-api' && <td className="numeric">{holder.share.toFixed(1)}%</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
