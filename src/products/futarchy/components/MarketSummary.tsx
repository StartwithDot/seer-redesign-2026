import { countdownLabel, compactMoney, signedPercent } from '../data/format';
import type { Market } from '../data/types';
import { useCountdown } from '../hooks/useCountdown';
import { MetricInfo } from './MetricInfo';

const statusLabel = {
  active: 'Active',
  awaiting: 'Awaiting',
  resolved: 'Resolved',
} as const;

const resultLabel = {
  approved: 'Approved',
  rejected: 'Rejected',
} as const;

export function MarketSummary({ market }: { market: Market }) {
  const now = useCountdown();
  const ended = new Date(market.closesAt).getTime() <= now;
  const outcome = market.resolvedOutcome ? market.resolvedOutcome.toUpperCase() : 'Pending';

  return (
    <section className="market-summary" aria-label="Market summary">
      <article><span>IMPACT SPOT</span><strong className={market.impact >= 0 ? 'positive' : 'negative'}>{signedPercent(market.impact)}</strong></article>
      <article><span>STATUS</span><strong>{ended && market.status !== 'resolved' ? 'Ended' : statusLabel[market.status]}</strong></article>
      <article><span>OUTCOME</span><strong className={market.resolvedOutcome ? `outcome-${market.resolvedOutcome}` : ''}>{outcome}</strong></article>
      <article>
        <span>VOLUME <MetricInfo label="Volume" text="Total conditional-token trading volume in collateral." /></span>
        <strong>{compactMoney(market.volume)}</strong>
      </article>
      <article>
        <span>TVL <MetricInfo label="TVL" text="Collateral currently supplied across the market's outcome pools." /></span>
        <strong>{compactMoney(market.tvl)}</strong>
      </article>
      <article><span>REMAINING TIME</span><strong>{countdownLabel(market.closesAt, now)}</strong></article>
      <article><span>RESOLUTION DATE</span><strong className="summary-date">{new Date(market.resolutionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></article>
      <article>
        <span>FINAL RESULT</span>
        <strong className={market.finalResult ? `result-${market.finalResult}` : ''}>{market.finalResult ? resultLabel[market.finalResult] : 'Pending'}</strong>
      </article>
    </section>
  );
}
