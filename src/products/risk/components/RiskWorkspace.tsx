import { LazyAssetDossier, LazyAssetExplorer, LazyHistoryDashboard, LazyPredictionDesk } from './LazyRiskViews';
import { useMemo, useState } from 'react';
import { RISK_ROUNDS } from '../data/market';
import { RISK_ASSETS } from '../data/assets';
import { selectionPatch, selectedAssetIds, toggleAssetSelection } from '../data/selection';
import type { RiskUrlState } from '../data/types';
import { useUserEstimates } from '../hooks/useUserEstimates';
import type { WalletStatus } from '../hooks/useWallet';
import { focusRiskSection } from '../data/route-focus';
import { AssetSelector } from './AssetSelector';
import { HorizonControl } from './HorizonControl';
import { RiskOverview } from './RiskOverview';

interface RiskWorkspaceProps {
  onConnect: () => void;
  state: RiskUrlState;
  update: (patch: Partial<RiskUrlState>, mode?: 'push' | 'replace') => void;
  walletAddress: string | null;
  walletOpen: boolean;
  walletStatus: WalletStatus;
}

export function RiskWorkspace({ onConnect, state, update, walletAddress, walletOpen, walletStatus }: RiskWorkspaceProps) {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [hazardHighlight, setHazardHighlight] = useState(false);
  const { estimates, setEstimate, setEstimates, clearEstimate } = useUserEstimates();
  const selectedIds = selectedAssetIds(state);
  const selectedAssets = useMemo(() => RISK_ASSETS.filter((asset) => selectedIds.includes(asset.id)), [selectedIds]);
  const focusAssets = selectedAssets;
  const dossierAsset = RISK_ASSETS.find((asset) => asset.id === state.dossier) || null;
  const activeAsset = focusAssets.find((asset) => asset.id === state.preview) || [...focusAssets].sort((a, b) => b.pdAnn - a.pdAnn)[0] || dossierAsset || RISK_ASSETS[0];
  const pickerSelection = selectedIds;

  const toggleAsset = (assetId: string) => {
    update({ ...toggleAssetSelection(state, assetId), preview: assetId });
  };

  const openAsset = (assetId: string) => update({ preview: assetId, dossier: assetId });

  if (state.round === 'q4-2026') return <section className="risk-empty-recovery risk-upcoming-workspace" aria-labelledby="risk-upcoming-title" data-align>
    <h2 id="risk-upcoming-title">Q4 terms are coming soon.</h2><p>Terms are unpublished. Your Q3 draft and selection remain saved.</p>
    <button className="risk-secondary-button" type="button" onClick={() => update({ round: 'q3-2026' })}>View Q3 closing estimates</button>
  </section>;

  return <div className="risk-workspace">
    {state.section === 'overview' && <RiskOverview assets={focusAssets} activeAsset={activeAsset} estimates={estimates} hazardHighlight={hazardHighlight}
      onToggleHazard={() => setHazardHighlight(current => !current)} onSelect={() => setSelectorOpen(true)} onOpenAsset={openAsset}
      onPreviewAsset={assetId => update({ preview: assetId }, 'replace')} onParticipate={() => { update({ section: 'participate' }); focusRiskSection('participate'); }}
      state={state} update={update} />}

    {state.section !== 'overview' && <section className="risk-toolbar risk-route-toolbar" aria-label="Selected portfolio controls">
      {state.section === 'assets' && state.assetView === 'table' && <HorizonControl value={state.horizon} onChange={(horizon) => update({ horizon }, 'replace')} />}
      <button className="risk-secondary-button" type="button" onClick={() => setSelectorOpen(true)}>{selectedIds.length ? `${selectedIds.length} assets selected` : 'Select assets'}</button>
    </section>}

    {state.section === 'assets' && <LazyAssetExplorer
      onCompare={(assetIds) => { update({ ...selectionPatch(assetIds), section: 'overview', preview: assetIds[0] }); focusRiskSection('overview'); }}
      onIsolate={(assetId) => { update({ assets: [assetId], count: null, selection: 'focus', section: 'overview', preview: assetId }); focusRiskSection('overview'); }}
      onOpen={openAsset}
      onSelectionChange={(assetIds) => update(selectionPatch(assetIds))}
      onToggle={toggleAsset}
      estimates={estimates}
      selected={selectedIds}
      state={state}
      update={update}
    />}

    {state.section === 'history' && <section id="risk-history-section" className="risk-history-section" tabIndex={-1} aria-labelledby="risk-history-title" data-align>
      <header className="risk-section-header">
        <div><p className="risk-kicker">Movers and time</p><h2 id="risk-history-title">Read the market as it moved.</h2></div>
        <p>Normalized ridges retain exact pool-derived values at every crosshair point.</p>
      </header>
      {focusAssets.length ? <LazyHistoryDashboard assets={focusAssets} estimates={estimates} /> : <div className="risk-history-empty"><strong>No assets selected</strong><p>Select assets to inspect their history and movers.</p><button type="button" className="risk-secondary-button" onClick={() => update({ selection: 'all', assets: [] })}>Select all assets</button></div>}
    </section>}

    {state.section === 'participate' && <LazyPredictionDesk
      assets={focusAssets}
      roundStatus={RISK_ROUNDS.find((round) => round.id === state.round)!.status}
      estimates={estimates}
      onConnect={onConnect}
      onDetails={openAsset}
      onEstimatesChange={setEstimates}
      onEstimateChange={setEstimate}
      walletAddress={walletAddress}
      walletOpen={walletOpen}
      walletStatus={walletStatus}
    />}

    <AssetSelector
      selected={pickerSelection}
      onChange={(assets) => update(selectionPatch(assets))}
      onClose={() => setSelectorOpen(false)}
      onGroupChange={(assets) => update(selectionPatch(assets))}
      open={selectorOpen}
      state={state}
      update={update}
    />
    {dossierAsset && <LazyAssetDossier
      asset={dossierAsset || activeAsset}
      clearEstimate={clearEstimate}
      estimate={dossierAsset ? estimates[dossierAsset.id] : undefined}
      onClose={() => update({ dossier: null }, 'replace')}
      open={Boolean(dossierAsset)}
      setEstimate={setEstimate}
    />}
    <span className="sr-only" aria-live="polite">{Object.keys(estimates).length ? `${Object.keys(estimates).length} estimates saved locally` : ''}</span>
  </div>;
}
