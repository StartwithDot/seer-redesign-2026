import type { Market } from '../data/types';

interface DecisionSpineProps {
  market: Market;
  compact?: boolean;
}

export function DecisionSpine({ market, compact = false }: DecisionSpineProps) {
  const impact = market.impact;
  return (
    <figure className={`decision-spine${compact ? ' is-compact' : ''}`} data-tour="spine">
      <svg viewBox="0 0 760 310" role="img" aria-labelledby={`spine-title-${market.id}`}>
        <title id={`spine-title-${market.id}`}>{`Decision Spine for ${market.proposal}: the market expects ${impact > 0.1 ? 'a positive' : impact < -0.1 ? 'a negative' : 'a neutral'} price impact if the proposal passes.`}</title>
        <defs>
          <linearGradient id={`pass-${market.id}`} x1="0" x2="1">
            <stop offset="0" stopColor="#6c47ff" stopOpacity=".24" />
            <stop offset="1" stopColor="#6c47ff" stopOpacity=".88" />
          </linearGradient>
          <linearGradient id={`fail-${market.id}`} x1="0" x2="1">
            <stop offset="0" stopColor="#8c8c98" stopOpacity=".12" />
            <stop offset="1" stopColor="#8c8c98" stopOpacity=".62" />
          </linearGradient>
        </defs>
        <path className="spine-history" d="M20 155 C92 152 128 160 184 154 S272 151 326 155" />
        <path className="spine-fork spine-pass" d="M326 155 C390 155 410 105 474 92 S612 86 724 72" />
        <path className="spine-fork spine-fail" d="M326 155 C390 155 410 205 474 220 S612 228 724 242" />
        <path className="spine-branch spine-branch-pass" stroke={`url(#pass-${market.id})`} d="M326 155 C408 147 452 118 518 110 S640 104 724 99" />
        <path className="spine-branch spine-branch-fail" stroke={`url(#fail-${market.id})`} d="M326 155 C408 163 452 194 518 202 S640 208 724 213" />
        <line className="spine-now" x1="326" y1="56" x2="326" y2="260" />
        <circle className="spine-origin" cx="326" cy="155" r="8" />
        <circle className="spine-end spine-end-pass" cx="724" cy="72" r="7" />
        <circle className="spine-end spine-end-fail" cx="724" cy="242" r="7" />
        <text x="20" y="132">SHARED HISTORY</text>
        <text x="300" y="42">NOW</text>
        <text x="570" y="48">IF IT PASSES</text>
        <text x="570" y="282">IF IT FAILS</text>
      </svg>
      <figcaption>
        <span>±1% decision corridor</span>
        <strong>{impact > 0 ? '+' : ''}{impact.toFixed(2)}% expected impact</strong>
      </figcaption>
    </figure>
  );
}
