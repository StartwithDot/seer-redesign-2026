import { useEffect, useState } from 'react';
import { signedPercent } from '../data/format';
import { getTwapRecommendation } from '../data/twap';
import type { Market } from '../data/types';
import { RollingValue } from './RollingValue';

const verdictLabel = { include: 'Include', neutral: 'Neutral', exclude: 'Exclude' } as const;

export function TwapGauge({ market, impact }: { market: Market; impact: number }) {
  const recommendation = getTwapRecommendation(market);
  const [haptics, setHaptics] = useState(false);
  const clamped = Math.max(-1.5, Math.min(1.5, impact));
  const angle = -90 + (clamped / 1.5) * 72;
  const locked = recommendation.state === 'locked';
  const canVibrate = typeof navigator.vibrate === 'function';

  useEffect(() => {
    if (locked && haptics && canVibrate) navigator.vibrate([18, 32, 18]);
  }, [locked, haptics, canVibrate]);

  return (
    <aside className="twap-gauge" aria-labelledby="twap-gauge-title">
      <header>
        <div><span className="eyebrow">FIVE-DAY SIGNAL</span><h2 id="twap-gauge-title">TWAP gauge</h2></div>
        <span className={`gauge-lock${locked ? ' is-locked' : ''}`} aria-label={locked ? 'Verdict locked' : 'Verdict open'}>
          {locked ? '▣' : '□'}
        </span>
      </header>

      <div className="gauge-visual">
        <svg viewBox="0 0 320 194" role="img" aria-label={`TWAP gauge reads ${signedPercent(impact)} and recommends ${verdictLabel[recommendation.verdict]}`}>
          <path className="gauge-track" d="M48 158 A112 112 0 0 1 272 158" />
          <path className="gauge-zone is-exclude" d="M48 158 A112 112 0 0 1 86 73" />
          <path className="gauge-zone is-neutral" d="M92 68 A112 112 0 0 1 228 68" />
          <path className="gauge-zone is-include" d="M234 73 A112 112 0 0 1 272 158" />
          <line className={`gauge-needle${locked ? ' is-locked' : ''}`} x1="160" y1="158" x2="160" y2="58" transform={`rotate(${angle} 160 158)`} />
          <circle className="gauge-pin" cx="160" cy="158" r="12" />
          <text x="42" y="181">Exclude</text>
          <text x="137" y="34">Neutral</text>
          <text x="250" y="181">Include</text>
        </svg>
        <RollingValue value={impact} format={(value) => signedPercent(value)} className="gauge-value" />
      </div>

      <footer>
        <div><span>RECOMMENDATION</span><strong>{verdictLabel[recommendation.verdict]}</strong></div>
        <div><span>WINDOW</span><strong>5 days / 24 hours</strong></div>
        <div><span>STATE</span><strong>{recommendation.stateLabel}</strong></div>
      </footer>

      {canVibrate && (
        <label className="haptic-toggle">
          <input
            type="checkbox"
            checked={haptics}
            onChange={(event) => {
              setHaptics(event.target.checked);
            }}
          />
          Haptic lock feedback
        </label>
      )}
    </aside>
  );
}
