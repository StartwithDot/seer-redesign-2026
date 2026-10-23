import { useState } from 'react';
import {
  getLiquidityBreakdown,
  getOpenInterestBreakdown,
  recordStatusDescriptions,
  type RecordMetricBreakdown,
} from '../data/marketRecord';
import { formatCompactMoney, formatMoney } from '../lib/format';
import { marketStateLabels, marketTypeLabels, verificationLabels } from '../lib/marketFilters';
import type { Market } from '../types';

interface MetricTooltipProps {
  id: string;
  label: string;
  value: string;
  description: string;
  breakdown: RecordMetricBreakdown[];
}

function MetricTooltip({ id, label, value, description, breakdown }: MetricTooltipProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`record-metric has-tooltip ${expanded ? 'is-expanded' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <button type="button" aria-label={`Explain ${label}`} aria-expanded={expanded} onClick={() => setExpanded(!expanded)} aria-describedby={`${id}-metric-tooltip`}>?</button>
      <div className="metric-tooltip" id={`${id}-metric-tooltip`} role="tooltip">
        <strong>{label}</strong>
        <p>{description}</p>
        <small>Pool prices can move between samples; these are point-in-time estimates.</small>
        <dl>
          {breakdown.map((item) => (
            <div key={item.outcomeId}><dt>{item.name}</dt><dd>{formatCompactMoney(item.value)}</dd></div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export function MarketRecordMeta({ market }: { market: Market }) {
  return (
    <section className="record-meta" aria-labelledby="market-meta-title">
      <div className="record-meta-heading">
        <div className="seer-record-mark" aria-label="Seer market">S</div>
        <div>
          <span className="field-label">Market record</span>
          <h2 id="market-meta-title">{marketTypeLabels[market.type]}</h2>
        </div>
        <span className={`record-pnl ${market.pnl >= 0 ? 'is-positive' : 'is-negative'}`}>
          P&amp;L <strong>{Number.isFinite(market.pnl) && market.pnl >= 0 ? '+' : ''}{formatMoney(market.pnl, 2)}</strong>
        </span>
      </div>
      <div className="record-meta-grid">
        <MetricTooltip
          id={`${market.id}-liquidity`}
          label="Liquidity"
          value={formatCompactMoney(market.liquidity)}
          description="Estimated collateral and conditional-token depth available near the current pool price."
          breakdown={getLiquidityBreakdown(market)}
        />
        <div className="record-metric"><span>Volume</span><strong>{formatCompactMoney(market.volume)}</strong></div>
        <MetricTooltip
          id={`${market.id}-open-interest`}
          label="Open interest"
          value={formatCompactMoney(market.openInterest)}
          description="Reported USD value of outstanding outcome positions. A per-outcome USD breakdown requires a verified collateral exchange rate."
          breakdown={getOpenInterestBreakdown(market)}
        />
        <div className="record-metric"><span>Market state</span><strong>{marketStateLabels[market.marketState]}</strong><small>{recordStatusDescriptions[market.marketState]}</small></div>
        <div className="record-metric"><span>Verification</span><strong>{verificationLabels[market.verification]}</strong></div>
      </div>
    </section>
  );
}
