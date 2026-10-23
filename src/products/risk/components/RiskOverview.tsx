import type { AssetRecord, RiskUrlState, UserEstimates } from '../data/types';
import { AggregateGauge, RiskBandLadder, RiskBars, SurvivalReadout } from './RiskVisuals';
import { SurvivalTide } from './SurvivalTide';
import { HazardRain } from './HazardRain';
import { HistoryTrend } from './HistoryTrend';
import { AssetPreviewCard } from './AssetPreviewCard';
import { OverviewControls } from './OverviewControls';
import { ArrowUpRight } from './Icons';
import { hazardShares } from '../data/math';

interface Props {
  assets: AssetRecord[];
  activeAsset: AssetRecord;
  estimates: UserEstimates;
  hazardHighlight: boolean;
  onToggleHazard: () => void;
  onSelect: () => void;
  onOpenAsset: (id: string) => void;
  onPreviewAsset: (id: string | null) => void;
  onParticipate: () => void;
  state: RiskUrlState;
  update: (patch: Partial<RiskUrlState>, mode?: 'push' | 'replace') => void;
}

export function RiskOverview({ assets, activeAsset, estimates, hazardHighlight, onToggleHazard, onSelect, onOpenAsset, onPreviewAsset, onParticipate, state, update }: Props) {
  const selected = assets.map(asset => asset.id);
  const signatureSwitch = <div className="risk-signature-switch" aria-label="Survival view">
    {(['tide', 'rain'] as const).map(view => <button key={view} type="button" aria-pressed={state.signatureView === view} onClick={() => update({ signatureView: view }, 'replace')}>{view === 'tide' ? 'Curve' : 'Rain'}</button>)}
  </div>;

  return <>
    <section id="risk-overview" className="risk-overview" tabIndex={-1} aria-labelledby="risk-overview-title" data-align>
      <header className="risk-overview-heading">
        <div><p className="risk-kicker">Risk pricing · Q3 final</p><h1 id="risk-overview-title">Portfolio survival</h1></div>
        <button className={assets.length ? 'risk-primary-button' : 'risk-secondary-button'} type="button" onClick={onParticipate}>Review participation <ArrowUpRight /></button>
      </header>
      {assets.length ? <AggregateGauge assets={assets} estimates={estimates} hazardHighlight={hazardHighlight} horizon={state.horizon} onToggleHazard={() => {
        if (state.view === 'time' || state.view === 'survival' && state.signatureView === 'rain') update({ view: 'survival', signatureView: 'tide' }, 'replace');
        onToggleHazard();
      }} /> : <div className="risk-empty-selection">
        <div><h2>No assets selected</h2><p>Choose assets to compare portfolio survival.</p></div>
        <button className="risk-primary-button" type="button" onClick={() => update({ selection: 'all', assets: [] })}>Select all</button>
      </div>}
    </section>
    <OverviewControls state={state} count={assets.length} onSelect={onSelect} update={update} />
    {assets.length > 0 && <div className="risk-overview-grid" data-align>
      {state.view === 'survival' && <div className="risk-signature-panel">
        {state.signatureView === 'tide'
          ? <SurvivalTide assets={assets} estimates={estimates} hazardHighlight={hazardHighlight} horizon={state.horizon} onOpenAsset={onOpenAsset} onPreviewAsset={onPreviewAsset} previewAssetId={state.preview} controls={signatureSwitch} />
          : <><div className="risk-rain-controls">{signatureSwitch}</div><HazardRain assets={assets} estimates={estimates} horizon={state.horizon} onOpenAsset={onOpenAsset} /></>}
      </div>}
      {state.view === 'bars' && <RiskBars assets={assets} estimates={estimates} hazardHighlight={hazardHighlight} horizon={state.horizon} selected={selected} onPreviewAsset={onPreviewAsset} onOpenAsset={onOpenAsset} previewAssetId={activeAsset.id} />}
      {state.view === 'time' && <div className="risk-overview-history"><HistoryTrend assets={assets} estimates={estimates} /></div>}
      {state.view === 'bars' && <AssetPreviewCard asset={activeAsset} estimate={estimates[activeAsset.id]} hazardShare={hazardShares(assets, state.horizon)[activeAsset.id] || 0} onOpen={() => onOpenAsset(activeAsset.id)} />}
      <details className="risk-overview-disclosure"><summary>Risk bands and asset survival</summary><div className="risk-overview-secondary">
        <RiskBandLadder activeAsset={activeAsset} assets={assets} estimates={estimates} selected={selected} />
        <SurvivalReadout assets={assets} horizon={state.horizon} />
      </div></details>
    </div>}
  </>;
}
