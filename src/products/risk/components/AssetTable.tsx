import { AssetBandGauge } from './AssetBandGauge';
import { assetRiskRank } from '../data/asset-rank';
import { formatPdPercent, formatSignedPoints } from '../data/format';
import { historyChange } from '../data/history';
import { pdAtHorizon } from '../data/math';
import type { AssetRecord, AssetSort, UserEstimates } from '../data/types';
import { AssetSparkline } from './AssetSparkline';
import { CheckIcon } from './Icons';
import { AssetPortrait } from './AssetPortrait';
import { GroupGlyph } from './GroupGlyph';
import { isEstimateEdited } from '../data/prediction-state';

interface AssetTableProps {
  assets: AssetRecord[];
  estimates: UserEstimates;
  horizon: number;
  onOpen: (assetId: string) => void;
  onSort: (sort: AssetSort) => void;
  onToggle: (assetId: string) => void;
  selected: string[];
  sort: AssetSort;
}

const headers: Array<[string, AssetSort | null, string?]> = [
  ['Asset', 'name'],
  ['Survival line', null],
  ['Peer / risk rank', null],
  ['PD at horizon', 'pd'],
  ['24h move', 'mover'],
  ['Grade', 'grade'],
  ['Band', null],
  ['Focus', null],
];

export function AssetTable({ assets, estimates, horizon, onOpen, onSort, onToggle, selected, sort }: AssetTableProps) {
  return <div className="risk-table-wrap">
    <table className="risk-asset-table">
      <caption className="sr-only">Sortable risk asset table</caption>
      <thead><tr>{headers.map(([label, sortable, className]) => <th
        key={label}
        className={className}
        aria-sort={sortable === sort ? sort === 'name' || sort === 'grade' ? 'ascending' : 'descending' : undefined}
      >
        {sortable ? <button type="button" onClick={() => onSort(sortable)}>{label}<span aria-hidden="true">{sortable === sort ? sort === 'name' || sort === 'grade' ? '↑' : '↓' : '↕'}</span></button> : label}
      </th>)}</tr></thead>
      <tbody>{assets.map((asset) => {
        const isSelected = selected.includes(asset.id);
        const estimate = estimates[asset.id];
        const edited = isEstimateEdited(asset, estimates);
        const rank = assetRiskRank(asset);
        return <tr key={asset.id} className={`${isSelected ? 'is-selected' : ''} ${edited ? 'is-edited' : ''}`}>
          <th scope="row">
            <span className="risk-table-identity"><AssetPortrait asset={asset} /><GroupGlyph group={asset.group} size={12} /></span>
            <span><button type="button" onClick={() => onOpen(asset.id)}><strong>{asset.ticker}</strong><small>{asset.name}</small></button></span>
          </th>
          <td className="risk-table-spark"><AssetSparkline asset={asset} compact /></td>
          <td><strong>#{rank.peer} of {rank.peerCount}</strong><small>#{rank.overall} risk of 33</small></td>
          <td><strong>{formatPdPercent(pdAtHorizon(asset.pdAnn, horizon))}</strong><small>{edited ? `Your ${formatPdPercent(pdAtHorizon(estimate!, horizon))}` : `${horizon} month horizon`}</small></td>
          <td>{formatSignedPoints(historyChange(asset, 24))}</td>
          <td><span className="risk-grade-chip">{asset.grade || 'Not rated'}</span></td>
          <td><AssetBandGauge asset={asset} /></td>
          <td><button
            className={`risk-check-button ${isSelected ? 'is-selected' : ''}`}
            type="button"
            aria-pressed={isSelected}
            aria-label={`${isSelected ? 'Remove' : 'Add'} ${asset.ticker} focus`}
            onClick={() => onToggle(asset.id)}
          >{isSelected ? <CheckIcon /> : <span aria-hidden="true">+</span>}</button></td>
        </tr>;
      })}{!assets.length && <tr><td colSpan={headers.length}><span className="risk-table-empty">No assets match the current filters.</span></td></tr>}</tbody>
    </table>
  </div>;
}
