import { useMemo, useState } from 'react';
import type { AssetRecord, RiskGroup, UserEstimates } from '../data/types';
import { isEstimateEdited } from '../data/prediction-state';
import { GroupGlyph } from './GroupGlyph';
import { PredictionRow } from './PredictionRow';

interface PredictionAssetListProps {
  assets: AssetRecord[];
  estimates: UserEstimates;
  onDetails: (assetId: string) => void;
  onEstimateChange: (assetId: string, value: number) => void;
}

type PredictionFilter = 'All' | 'ETH' | 'USD' | 'BTC' | 'Funds';

const groups: RiskGroup[] = ['ETH Based', 'USD Based', 'BTC Based', 'Funds Based'];
const filters: PredictionFilter[] = ['All', 'ETH', 'USD', 'BTC', 'Funds'];

const filterMatches = (asset: AssetRecord, filter: PredictionFilter) =>
  filter === 'All' || asset.group.startsWith(filter);

export function PredictionAssetList({ assets, estimates, onDetails, onEstimateChange }: PredictionAssetListProps) {
  const [filter, setFilter] = useState<PredictionFilter>('All');
  const [expandedGroups, setExpandedGroups] = useState<Set<RiskGroup>>(() => new Set(groups));
  const [expandedAssets, setExpandedAssets] = useState<Set<string>>(() => new Set());

  const visibleAssets = useMemo(() => assets.filter((asset) => filterMatches(asset, filter)), [assets, filter]);
  const toggleGroup = (group: RiskGroup) => setExpandedGroups((current) => {
    const next = new Set(current);
    if (next.has(group)) next.delete(group);
    else next.add(group);
    return next;
  });
  const toggleAsset = (assetId: string) => setExpandedAssets((current) => {
    const next = new Set(current);
    if (next.has(assetId)) next.delete(assetId);
    else next.add(assetId);
    return next;
  });
  const setAllGroups = (expanded: boolean) => {
    setExpandedGroups(expanded ? new Set(groups) : new Set());
    setExpandedAssets(expanded ? new Set(visibleAssets.map((asset) => asset.id)) : new Set());
  };

  return <div className="risk-prediction-list-wrap">
    <div className="risk-prediction-list-tools">
      <div className="risk-segmented risk-prediction-filters" aria-label="Filter prediction assets">
        {filters.map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}
      </div>
      <div className="risk-prediction-list-actions">
        <button className="risk-text-button" type="button" disabled={!visibleAssets.length || visibleAssets.every(asset => expandedAssets.has(asset.id) && expandedGroups.has(asset.group))} title="Expand every visible selected asset" onClick={() => setAllGroups(true)}>Expand all</button>
        <button className="risk-text-button" type="button" disabled={!visibleAssets.some(asset => expandedGroups.has(asset.group))} title="Collapse every selected group" onClick={() => setAllGroups(false)}>Collapse all</button>
      </div>
    </div>
    <div className="risk-prediction-list">
      {groups.map((group) => {
        const groupAssets = visibleAssets.filter((asset) => asset.group === group);
        if (!groupAssets.length) return null;
        const edited = groupAssets.filter((asset) => isEstimateEdited(asset, estimates)).length;
        const expanded = expandedGroups.has(group);
        const groupId = `prediction-${group.replaceAll(' ', '-').toLowerCase()}`;
        return <section key={group} aria-labelledby={`${groupId}-heading`}>
          <header>
            <button className="risk-prediction-group-toggle" type="button" aria-expanded={expanded} aria-controls={groupId} onClick={() => toggleGroup(group)}>
              <GroupGlyph group={group} />
              <span id={`${groupId}-heading`} className="risk-prediction-group-name">{group}</span>
              <span className={`risk-group-edited ${edited ? 'is-edited' : ''}`}>{edited ? `${edited} edited` : `${groupAssets.length} assets`}</span>
              <span className="risk-prediction-chevron" aria-hidden="true">{expanded ? '−' : '+'}</span>
            </button>
          </header>
          {expanded && <div id={groupId} className="risk-prediction-group-body">
            {groupAssets.map((asset) => <PredictionRow
              key={asset.id}
              asset={asset}
              edited={isEstimateEdited(asset, estimates)}
              expanded={expandedAssets.has(asset.id)}
              estimate={estimates[asset.id] ?? asset.pdAnn}
              onDetails={onDetails}
              onEstimateChange={onEstimateChange}
              onToggle={toggleAsset}
            />)}
          </div>}
        </section>;
      })}
      {!visibleAssets.length && <div className="risk-prediction-empty"><p>{assets.length ? 'No selected assets match this filter.' : 'No assets selected. Use Select assets above to choose a portfolio.'}</p>{filter !== 'All' && <button className="risk-text-button" type="button" onClick={() => setFilter('All')}>Show all selected assets</button>}</div>}
    </div>
  </div>;
}
