import type { KeyboardEvent } from 'react';
import type { MarketRecord } from '../data/types';

interface ExplorerLedgerProps {
  markets: MarketRecord[];
  onOpenRecord: (recordId: string) => void;
}

function rowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, market: MarketRecord, open: (id: string) => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    open(`market-${market.id}`);
    return;
  }
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  event.preventDefault();
  const rows = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLTableRowElement>('tr[tabindex]') ?? []);
  const index = rows.indexOf(event.currentTarget);
  rows[index + (event.key === 'ArrowDown' ? 1 : -1)]?.focus();
}

export function ExplorerLedger({ markets, onOpenRecord }: ExplorerLedgerProps) {
  return (
    <div className="market-ledger" role="region" aria-label="Opportunity market records">
      <table>
        <thead>
          <tr>
            <th scope="col">Market</th>
            <th scope="col">State</th>
            <th scope="col">Volume</th>
            <th scope="col">Liquidity</th>
            <th scope="col">Submissions</th>
            <th scope="col">Evidence</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((market) => (
            <tr
              key={market.id}
              tabIndex={0}
              aria-label={`Open market record for ${market.title}`}
              onClick={() => onOpenRecord(`market-${market.id}`)}
              onKeyDown={(event) => rowKeyDown(event, market, onOpenRecord)}
            >
              <td data-label="Market"><strong>{market.title}</strong><small>{market.id} · {market.kind}</small></td>
              <td data-label="State"><i className={`status-chip status-chip--${market.status}`}>{market.status}</i></td>
              <td data-label="Volume" className="numeric-cell">{market.volumeUsd ? `$${market.volumeUsd.toLocaleString()}` : 'Unavailable'}</td>
              <td data-label="Liquidity" className="numeric-cell">{market.liquidityUsd ? `$${market.liquidityUsd.toLocaleString()}` : 'No pool'}</td>
              <td data-label="Submissions" className="numeric-cell">{market.submissionCount}</td>
              <td data-label="Evidence">{market.source === 'sample' ? <i className="sample-badge">Sample</i> : 'Verified'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
