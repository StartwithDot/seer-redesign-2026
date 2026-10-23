import type { MarketRecord } from '../data/types';

interface ExplorerAnalyticalFieldProps {
  markets: MarketRecord[];
  onOpenRecord: (recordId: string) => void;
}

export function ExplorerAnalyticalField({ markets, onOpenRecord }: ExplorerAnalyticalFieldProps) {
  const maximumLiquidity = Math.max(1, ...markets.map((market) => market.liquidityUsd));
  return (
    <figure className="analytical-field">
      <figcaption>
        <div>
          <p className="section-kicker">Decision field</p>
          <h2>Odds concentration against available liquidity</h2>
        </div>
        <p>Higher marks concentrate more market odds in the leading outcomes. Position is context, not a sponsor recommendation.</p>
      </figcaption>
      <div className="analytical-plot" role="group" aria-label="Market liquidity and odds concentration field">
        <span className="field-axis field-axis--y">Top 3 odds concentration</span>
        <span className="field-axis field-axis--x">Available liquidity</span>
        {[0, 25, 50, 75, 100].map((tick) => (
          <span key={tick} className="field-gridline field-gridline--y" style={{ bottom: `${tick}%` }} />
        ))}
        {markets.map((market) => {
          const x = Math.round((Math.log10(market.liquidityUsd + 1) / Math.log10(maximumLiquidity + 1)) * 88 + 6);
          const y = Math.round(market.coverage.top3Percent * 0.82 + 8);
          return (
            <button
              key={market.id}
              type="button"
              className="field-mark"
              style={{ left: `${x}%`, bottom: `${y}%` }}
              onClick={() => onOpenRecord(`market-${market.id}`)}
              title={`${market.title}: ${market.coverage.top3Percent}% top 3 concentration, $${market.liquidityUsd.toLocaleString()} liquidity`}
              aria-label={`Open ${market.title}. Top 3 concentration ${market.coverage.top3Percent} percent, liquidity ${market.liquidityUsd} dollars.`}
            >
              <span>{market.title.slice(0, 2).toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    </figure>
  );
}
