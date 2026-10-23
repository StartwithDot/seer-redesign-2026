import { useId, useState } from 'react';
import { exactPrice, signedPercent } from '../data/format';
import { getTwapRecommendation } from '../data/twap';
import type { Market } from '../data/types';

const verdictLabel = {
  include: 'Include',
  neutral: 'Neutral',
  exclude: 'Exclude',
} as const;

export function TwapPanel({ market, defaultOpen = false }: { market: Market; defaultOpen?: boolean }) {
  const recommendation = getTwapRecommendation(market);
  const detailsId = useId();
  const [expanded, setExpanded] = useState(defaultOpen);

  return (
    <section className={`twap-panel is-${recommendation.state}`} data-evidence-section="twap" aria-labelledby={`${detailsId}-title`}>
      <button
        className="twap-summary"
        type="button"
        aria-expanded={expanded}
        aria-controls={detailsId}
        onClick={() => setExpanded((open) => !open)}
      >
        <span>
          <small>TWAP RECOMMENDATION</small>
          <strong id={`${detailsId}-title`}>{verdictLabel[recommendation.verdict]}</strong>
        </span>
        <span className={`twap-state is-${recommendation.state}`}>
          <span aria-hidden="true" />{recommendation.stateLabel}
        </span>
        <span className="twap-disclosure" aria-hidden="true">{expanded ? '−' : '+'}</span>
      </button>

      <div className="twap-details" id={detailsId} hidden={!expanded}>
        <div className="twap-metrics" aria-label="TWAP recommendation values">
          <article><span>WINDOW</span><strong>5 days / 24 hours</strong></article>
          <article><span>UPDATED</span><strong>{new Date(recommendation.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</strong></article>
          <article><span>YES TWAP</span><strong>{exactPrice(recommendation.yesTwap, market.collateral)}</strong></article>
          <article><span>NO TWAP</span><strong>{exactPrice(recommendation.noTwap, market.collateral)}</strong></article>
          <article><span>TWAP IMPACT</span><strong className={recommendation.impact >= 0 ? 'positive' : 'negative'}>{signedPercent(recommendation.impact)}</strong></article>
          <article><span>AHEAD OUTCOME</span><strong className={`outcome-${recommendation.aheadOutcome.toLowerCase()}`}>{recommendation.aheadOutcome}</strong></article>
        </div>

        <div className="twap-rule">
          <span className="rule-band is-include">Above +1% <b>Include</b></span>
          <span className="rule-band is-neutral">Within ±1% <b>Neutral</b></span>
          <span className="rule-band is-exclude">Below -1% <b>Exclude</b></span>
        </div>

        <details className="twap-more">
          <summary>More info about mechanics and market metadata</summary>
          <div>
            <p>The recommendation compares five daily observations ending 24 hours before resolution. Each observation uses the median conditional-token reference price in a one-hour sample.</p>
            <dl>
              <div><dt>Observation window</dt><dd>{new Date(recommendation.windowStart).toLocaleDateString()} to {new Date(recommendation.windowEnd).toLocaleDateString()}</dd></div>
              <div><dt>Decision rule</dt><dd>{recommendation.rule}</dd></div>
              <div><dt>Reference pair</dt><dd>{market.token} YES / NO conditional tokens, {market.collateral} collateral</dd></div>
              <div><dt>Market contract</dt><dd>{market.marketAddress}</dd></div>
            </dl>
            <p className="twap-authority">This is an advisory recommendation. Organization voters retain final authority.</p>
          </div>
        </details>
      </div>
    </section>
  );
}
