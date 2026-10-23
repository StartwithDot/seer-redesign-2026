import type { AssetRecord } from '../data/types';
import { annualToQuarterlyPd, formatPercent, riskBand } from '../data/math';
import { CheckIcon } from './Icons';
import { AssetPortrait } from './AssetPortrait';
import { formatGrade } from '../data/format';

interface AssetPreviewCardProps {
  asset: AssetRecord;
  estimate?: number;
  hazardShare: number;
  onOpen: () => void;
}

export function AssetPreviewCard({ asset, estimate, hazardShare, onOpen }: AssetPreviewCardProps) {
  return <article className="risk-asset-preview" aria-live="polite">
    <div className="risk-asset-preview-head">
      <AssetPortrait key={asset.id} asset={asset} />
      <div><strong>{asset.ticker}</strong><span title={asset.name}>{asset.name}</span></div>
      <span className="risk-grade">{formatGrade(asset)}</span>
    </div>
    <dl>
      <div><dt>PD Ann.</dt><dd>{formatPercent(asset.pdAnn)}</dd></div>
      <div><dt>PD Quart.</dt><dd>{formatPercent(annualToQuarterlyPd(asset.pdAnn))}</dd></div>
      <div><dt>Risk band</dt><dd>{riskBand(asset.pdAnn)}</dd></div>
      <div><dt>Hazard share</dt><dd>{formatPercent(hazardShare * 100, 1)}</dd></div>
    </dl>
    {estimate !== undefined && <p className="risk-preview-estimate"><CheckIcon /> Your estimate: {formatPercent(estimate)} Ann. / {formatPercent(annualToQuarterlyPd(estimate))} Quart.</p>}
    <button className="risk-secondary-button" type="button" onClick={onOpen}>Open details</button>
  </article>;
}
