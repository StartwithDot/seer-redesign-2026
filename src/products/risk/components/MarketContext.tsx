import { RISK_ROUNDS } from '../data/market';
import { formatDate, formatPercent } from '../data/math';
import type { RiskRound, RoundId } from '../data/types';
import { ChevronIcon } from './Icons';
import { Tooltip } from './Tooltip';
import { useState } from 'react';
import { MarketProvenance } from './MarketProvenance';

const isEnded = (round: RiskRound) => round.status === 'ended' || new Date(round.closesAt).getTime() <= Date.now();

export function MarketContext({ compact = false, onRoundChange, roundId }: { compact?: boolean; onRoundChange: (round: RoundId) => void; roundId: RoundId; }) {
  const [provenanceOpen, setProvenanceOpen] = useState(false);
  const round = RISK_ROUNDS.find((item) => item.id === roundId) || RISK_ROUNDS[0];
  const ended = round.status !== 'upcoming' && isEnded(round);
  const upcoming = round.status === 'upcoming';

  return <section className={`risk-market-context ${compact ? 'is-compact' : ''}`} aria-label={`${round.label} market context`} data-align>
    <div className="risk-round-row">
      <div className="risk-round-switcher" aria-label="Trading round">
        {RISK_ROUNDS.map((item) => {
          const disabled = item.status === 'upcoming';
          return <button key={item.id} type="button" aria-pressed={item.id === roundId} aria-disabled={disabled} disabled={disabled} title={disabled ? 'Coming soon' : undefined} aria-describedby={disabled ? 'risk-q4-status' : undefined} onClick={() => onRoundChange(item.id)}>
            {item.label}<span>{item.status === 'ended' ? 'Final' : 'Coming soon'}</span>
          </button>;
        })}
        <span id="risk-q4-status" className="sr-only">Q4 2026 terms are coming soon and cannot be selected.</span>
      </div>
      <div className="risk-round-meta">
        <div className={`risk-status ${ended ? 'is-ended' : ''}`}>
          <span className="risk-status-dot" aria-hidden="true" />
          <strong>{upcoming ? 'Coming soon' : ended ? 'Ended' : 'Trading open'}</strong>
          <span>{upcoming ? 'Terms not published' : ended ? `Closed ${formatDate(round.closedAt || round.closesAt)}` : `Closes ${formatDate(round.closesAt)}`}</span>
        </div>
        {!upcoming && <button className="risk-inline-button risk-resolution-trigger" type="button" onClick={() => setProvenanceOpen(true)} aria-haspopup="dialog">Reality.eth / Kleros</button>}
      </div>
    </div>

    <MarketProvenance open={provenanceOpen} onClose={() => setProvenanceOpen(false)} />
    <details className="risk-context-disclosure"><summary>Market terms and closing prices</summary>
      <h2>Risk Pricing Predictions</h2>
      <p className="risk-question-copy">{round.question} Estimate the likelihood that an asset fails to preserve its stated redemption or credit obligations during the round.
        <Tooltip label="About Probability of Default">Default (PD) is the market estimate of a failure to meet the published asset terms. The precise trigger is defined by each market.</Tooltip>
      </p>
      <div className="risk-context-strip">
      <div><span>Asked by</span><strong>Kleros Foresight</strong></div>
      <div><span>Priced</span><strong>{upcoming ? 'Asset roster not published' : '33 DeFi assets'}</strong></div>
      <div><span>How to use</span><strong>Compare portfolio survival and asset-level hazard.</strong></div>
      <div><span>Trading period</span><strong>{upcoming ? 'Terms not published' : 'Until Wednesday, 30 September 2026 at 23:59 UTC'}</strong></div>
    </div>
    <p className="risk-snapshot-note">Saved market snapshot for the redesign prototype. Cross-check live terms and prices before making a financial decision.</p>

    {ended && round.finalAnnualSurvival && <div className="risk-closing-strip">
      <span>Closing market estimate</span>
      <strong>{formatPercent(round.finalAnnualSurvival * 100)} chance no listed asset defaults</strong>
      <span>{formatPercent(round.finalQuarterlySurvival! * 100)} at the quarterly horizon</span>
      <ChevronIcon />
    </div>}</details>
  </section>;
}
