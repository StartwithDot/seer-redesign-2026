import { formatPdPercent, formatSignedPoints } from '../data/format';
import { historyChange } from '../data/history';
import { pdAtHorizon, riskBand } from '../data/math';
import type { AssetRecord, UserEstimates } from '../data/types';
import { AssetPortrait } from './AssetPortrait';
import { AssetSparkline } from './AssetSparkline';
import { CheckIcon } from './Icons';
import { assetRiskRank } from '../data/asset-rank';
import { GroupGlyph } from './GroupGlyph';

interface Props { assets: AssetRecord[]; estimates: UserEstimates; horizon: number; selected: string[]; onOpen: (id: string) => void; onToggle: (id: string) => void; }
export function AssetMobileList({ assets, estimates, horizon, selected, onOpen, onToggle }: Props) {
  return <ol className="risk-mobile-asset-list" aria-label="Risk assets">
    {assets.map(asset => {
      const rank = assetRiskRank(asset);
      return <li key={asset.id}>
      <div className="risk-mobile-asset-heading">
        <AssetPortrait asset={asset} />
        <button type="button" className="risk-inline-button" onClick={() => onOpen(asset.id)}><strong>{asset.ticker}</strong><small>{asset.name}</small><small className="risk-mobile-asset-group"><GroupGlyph group={asset.group} size={14} />{asset.group}</small></button>
        <button type="button" className="risk-check-button" aria-pressed={selected.includes(asset.id)} aria-label={`${selected.includes(asset.id) ? 'Remove' : 'Add'} ${asset.ticker} focus`} onClick={() => onToggle(asset.id)}>{selected.includes(asset.id) ? <CheckIcon /> : '+'}</button>
      </div>
      <dl>
        <div><dt>PD · {horizon} months</dt><dd>{formatPdPercent(pdAtHorizon(asset.pdAnn, horizon))}</dd></div>
        <div><dt>24h move</dt><dd>{formatSignedPoints(historyChange(asset, 24))}</dd></div>
        <div><dt>Grade / band</dt><dd>{asset.grade || 'Not rated'} · {riskBand(asset.pdAnn)}</dd></div>
        <div><dt>Survival history</dt><dd><AssetSparkline asset={asset} compact /></dd></div>
        <div><dt>Peer / overall risk rank</dt><dd>#{rank.peer} of {rank.peerCount} · #{rank.overall} of 33</dd></div>
        {estimates[asset.id] !== undefined && <div><dt>Your PD</dt><dd>{formatPdPercent(pdAtHorizon(estimates[asset.id], horizon))}</dd></div>}
      </dl>
    </li>;
    })}
  </ol>;
}
