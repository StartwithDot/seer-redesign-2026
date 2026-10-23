import { useState } from 'react';
import { profileFor, credoraUrl } from '../data/profiles';
import type { AssetRecord } from '../data/types';
import { ArrowUpRight } from './Icons';

export function RiskRatingPanel({ asset }: { asset: AssetRecord }) {
  const profile = profileFor(asset.ticker);
  const [expanded, setExpanded] = useState<string | null>(null);
  return <section className="risk-dossier-section" aria-label="Credora risk rating">
    <div className="risk-dossier-section-head"><div><p className="risk-kicker">Credora by RedStone</p><h3>Risk rating</h3></div><strong className="risk-grade">{profile?.metrics_rating || 'Not rated'}</strong></div>
    <p>{profile?.rating_type || 'Category not published'}</p>
    <p>Average risk score: <strong>{profile?.avg_risk_score == null ? 'Not published' : `${profile.avg_risk_score.toFixed(2)}/5`}</strong></p>
    {!profile && <p>LBTC risk rating not published.</p>}
    {asset.ticker === 'NUSD' && <p>Metric breakdown not published. Analysis dismissed following the August 2026 incident.</p>}
    {profile && <div className="risk-metric-list">
      {[...profile.risk_profiles].sort((a, b) => a.display_order - b.display_order).map((metric, index) => {
        const id = `risk-metric-${asset.id}-${index}`;
        return <div className="risk-metric" key={metric.metric_name}>
          <button type="button" aria-label={`${metric.metric_name}: ${metric.score ?? "not published"} out of ${metric.max_score ?? 5}`} aria-describedby={expanded === id ? id : `${id}-tooltip`} aria-expanded={expanded === id} aria-controls={id} onClick={() => setExpanded(expanded === id ? null : id)}>
            <span>{metric.metric_name}</span><strong>{metric.score == null ? '-' : metric.score}/{metric.max_score ?? 5}</strong><span aria-hidden="true">{expanded === id ? '−' : '+'}</span>
            <span id={`${id}-tooltip`} className="risk-metric-tooltip" role="tooltip">{metric.content}</span>
          </button>
          {expanded === id && <p id={id}>{metric.content}</p>}
        </div>;
      })}
    </div>}
    {profile && <a className="risk-inline-button" href={credoraUrl(profile)} target="_blank" rel="noreferrer">View on Credora <ArrowUpRight /></a>}
  </section>;
}
