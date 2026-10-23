import { useState } from 'react';
import { chainAddressUrl } from '../data/entities';
import { RISK_ASSETS } from '../data/assets';
import type { POOL_SERIES } from '../data/pool-history';
import { buildHistory } from '../data/history';

export function PoolSeriesInspector({ entry }: { entry: typeof POOL_SERIES[number] }) {
  const [index, setIndex] = useState(entry.points.length - 1);
  const point = entry.points[index];
  const asset = RISK_ASSETS.find(item => item.ticker === entry.ticker);
  return <details>
    <summary>{entry.ticker || 'Empty API series'} · {entry.points.length} points</summary>
    {point ? <>
      <label className="risk-source-point-select">Observation (UTC)<select value={index} onChange={event => setIndex(Number(event.target.value))}>
        {entry.points.map((observation, i) => <option key={i} value={i}>{new Date(observation.periodStartUnix * 1000).toISOString()}</option>)}
      </select></label>
      <dl>
        <div><dt>Pool</dt><dd><a href={chainAddressUrl(point.poolId)} target="_blank" rel="noreferrer">{point.poolId}</a></dd></div>
        <div><dt>Token 0 · {point.token0Name}</dt><dd><a href={chainAddressUrl(point.token0Id)} target="_blank" rel="noreferrer">{point.token0Id}</a></dd></div>
        <div><dt>Token 1 · {point.token1Name}</dt><dd><a href={chainAddressUrl(point.token1Id)} target="_blank" rel="noreferrer">{point.token1Id}</a></dd></div>
        {(['poolLiquidity', 'pointLiquidity', 'sqrtPrice', 'token0Price', 'token1Price', 'periodStartUnix'] as const).map(key => <div key={key}><dt>{key}</dt><dd>{point[key] ?? 'Not provided'}</dd></div>)}
        <div><dt>Observation (UTC)</dt><dd>{new Date(point.periodStartUnix * 1000).toISOString()}</dd></div>
        {asset && <div><dt>Scaled endpoint · Annual PD</dt><dd>{buildHistory(asset).at(-1)?.marketPd.toFixed(3)}%</dd></div>}
      </dl>
    </> : <p>No observations were returned. No history is fabricated for this series.</p>}
  </details>;
}
