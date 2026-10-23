import type { TraderResult } from '../data/leaderboardService';
import { scoreTier } from '../data/leaderboardService';
import { Popover } from './Popover';

export function TraderScore({ row }: { row: TraderResult }) {
  return <Popover id={`score-${row.address}`} label={`${row.score?.toFixed(1) ?? 'Unavailable'} · ${scoreTier(row.score)}`}>
    {() => <div className="score-anatomy"><strong>Score anatomy · sample formula</strong>
      <dl className="quote-metrics">
        <div><dt>Returns (ROI)</dt><dd>{row.roi?.toFixed(1) ?? 'Unavailable'}%</dd></div>
        <div><dt>Profit factor</dt><dd>{row.factor?.toFixed(2) ?? 'No realized losses'}</dd></div>
        <div><dt>Hit rate</dt><dd>{row.hitRate.toFixed(1)}%</dd></div>
        <div><dt>Loss burn</dt><dd>{row.burn.toFixed(2)}</dd></div>
        <div><dt>Breadth</dt><dd>{row.markets} markets</dd></div>
        <div><dt>Sample shrink</dt><dd>{(row.shrink * 100).toFixed(0)}%</dd></div>
      </dl>
      <p>Illustrative score: (50 + ROI × 0.2 + (hit rate − 50) × 0.5) × sample shrink, capped at 100. Shrink reaches 100% at 30 settled markets. This is not Seer’s official Trader Score.</p>
      <p>{row.score === null ? 'Score unavailable: fewer than five settled sample markets.' : 'ELITE ≥ 80 · GREAT ≥ 60 · GOOD below 60.'} ROI is unavailable when settled cost is zero.</p>
    </div>}
  </Popover>;
}
