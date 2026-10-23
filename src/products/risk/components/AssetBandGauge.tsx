import { formatPdPercent } from '../data/format';
import { riskBand, logarithmicPdPosition } from '../data/math';
import type { AssetRecord } from '../data/types';

export function AssetBandGauge({ asset }: { asset: AssetRecord }) {
  return <div className="risk-asset-band-gauge" aria-label={`${asset.ticker} ${riskBand(asset.pdAnn)} risk band on logarithmic annual PD scale at ${formatPdPercent(asset.pdAnn)}`}>
    <div className="risk-asset-band-track" aria-hidden="true">
      {[0, 2, 5, 10].map((start, index) => {
        const end = [2, 5, 10, 100][index];
        return <span key={start} className={`is-${['low', 'moderate', 'high', 'critical'][index]}`} style={{ flex: `0 0 ${logarithmicPdPosition(end) - logarithmicPdPosition(start)}%` }} />;
      })}
      <i style={{ left: `${logarithmicPdPosition(asset.pdAnn)}%` }} />
    </div>
    <div className="risk-asset-band-caption"><span>{riskBand(asset.pdAnn)}</span><b>{formatPdPercent(asset.pdAnn)}</b></div>
  </div>;
}
