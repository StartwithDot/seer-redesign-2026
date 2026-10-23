import type { KeyboardEvent } from 'react';
import type { MarketRecord } from '../data/types';

interface ExplorerCompactListProps {
  markets: MarketRecord[];
  onOpenRecord: (recordId: string) => void;
}

export function ExplorerCompactList({ markets, onOpenRecord }: ExplorerCompactListProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const rows = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button') ?? []);
    rows[index + (event.key === 'ArrowDown' ? 1 : -1)]?.focus();
  };
  return (
    <div className="compact-market-list" aria-label="Compact market records">
      {markets.map((market, index) => (
        <button
          key={market.id}
          type="button"
          onClick={() => onOpenRecord(`market-${market.id}`)}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          <span className={`status-chip status-chip--${market.status}`}>{market.status}</span>
          <span className="compact-market-title">
            <strong>{market.title}</strong>
            <small>{market.kind} · {market.id}</small>
          </span>
          <span className="compact-market-metric"><small>Volume</small><strong>${market.volumeUsd.toLocaleString()}</strong></span>
          <span className="compact-market-metric"><small>Liquidity</small><strong>${market.liquidityUsd.toLocaleString()}</strong></span>
          <span className="compact-market-metric"><small>Top 8 coverage</small><strong>{market.coverage.top8Percent}%</strong></span>
          <span aria-hidden="true">→</span>
        </button>
      ))}
    </div>
  );
}
