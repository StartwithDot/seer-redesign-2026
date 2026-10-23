import type { MarketRecord } from '../data/types';

interface BoardSignalStripProps {
  market: MarketRecord;
}

export function BoardSignalStrip({ market }: BoardSignalStripProps) {
  const signal = market.signal;
  const priced = signal ? signal.pricedOutcomes + signal.tiedOutcomes : 0;
  return (
    <details className="signal-pricing-details">
      <summary><span>Pricing coverage</span><strong>{signal ? `${priced} of ${market.submissionCount} priced` : 'No priced signal'}</strong><span className="disclosure-mark" aria-hidden="true">+</span></summary>
      <section className={`board-signal-strip ${signal ? '' : 'board-signal-strip--unpriced'}`} aria-label="Market odds and pricing coverage">
      <div className="headline-metric">
        <span>Submissions with a price</span>
        <strong>{signal ? priced : 'No priced signal'}</strong>
        <small>{signal ? `of ${market.submissionCount} submissions · ${((priced / Math.max(1, market.submissionCount)) * 100).toFixed(1)}% coverage` : 'Resolution record only'}</small>
      </div>
      <div className="headline-tiers">
        <div><strong>{signal?.aboveFloor ?? 0}</strong><span>above minimum price <abbr title="Above the lowest recorded chance, 0.4% in the pilot snapshot.">ⓘ</abbr></span></div>
        <div><strong>{signal?.tiedOutcomes ?? 0}</strong><span>at minimum price <abbr title="Tied at the lowest recorded chance, 0.4% in the pilot snapshot.">ⓘ</abbr></span></div>
        <div><strong>{signal?.unpricedOutcomes ?? market.submissionCount}</strong><span>unpriced or no pool</span></div>
        <div><strong>{signal ? `${signal.totalOddsPercent.toFixed(1)}%` : 'Unavailable'}</strong><span>recorded odds total <abbr title="The sum across priced outcomes, not the chance of any single submission being selected.">ⓘ</abbr></span></div>
      </div>
      </section>
    </details>
  );
}
