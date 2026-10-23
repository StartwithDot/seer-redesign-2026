import type { ReactNode } from 'react';
import { editedAssetIds, predictionAvailability, predictionLifecycleLabel } from '../data/prediction-state';
import type { AssetRecord, PredictionLifecycle, UserEstimates } from '../data/types';
import { ArrowUpRight, WalletIcon } from './Icons';

interface PredictionActionPanelProps {
  assets: AssetRecord[];
  children?: ReactNode;
  estimates: UserEstimates;
  lifecycle: PredictionLifecycle;
  onConnect: () => void;
  onCsv: () => void;
  onExport: () => void;
  onReset: () => void;
  onSubmit: (mode: 'selected' | 'all') => void;
  roundStatus: 'ended' | 'upcoming' | 'active';
  walletAddress: string | null;
}

export function PredictionActionPanel({ assets, children, estimates, lifecycle, onConnect, onCsv, onExport, onReset, onSubmit, roundStatus, walletAddress }: PredictionActionPanelProps) {
  const edited = editedAssetIds(assets, estimates);
  const hasEdits = edited.length > 0;
  const connected = Boolean(walletAddress);
  const { allowed: canSubmit, reason } = predictionAvailability(roundStatus, assets.length, edited.length);
  const submitButton = <button className="risk-primary-button" type="button" title={reason} aria-describedby="risk-prediction-action-reason" disabled={connected && !canSubmit} onClick={() => connected ? onSubmit('selected') : onConnect()}>
    <WalletIcon /> {connected ? 'Predict selected' : 'Connect to predict'}
  </button>;

  return <aside className="risk-predict-panel">
    {children}
    <div className="risk-predict-state"><span>Draft state</span><strong>{predictionLifecycleLabel[lifecycle]}</strong></div>
    <div className="risk-predict-summary">
      <span>Selected set</span><strong>{assets.length} assets</strong>
      <span>Edited</span><strong>{edited.length}</strong>
      <span>Network</span><strong>Gnosis Chain</strong>
    </div>
    {submitButton}
    <p id="risk-prediction-action-reason" className="risk-predict-action-note" aria-live="polite">{reason}</p>
    <details className="risk-predict-utilities"><summary>CSV and draft tools</summary>
    <button className="risk-secondary-button" type="button" onClick={onCsv}>Upload CSV predictions</button>
    <div className="risk-predict-edit-actions">
      {hasEdits && <button className="risk-text-button" type="button" onClick={onReset}>Reset predictions</button>}
      <button className="risk-text-button" type="button" onClick={onExport}>{hasEdits ? 'Export predictions' : 'Download latest data'}</button>
    </div>
    <button className="risk-secondary-button" type="button" title={reason} aria-describedby="risk-prediction-action-reason" disabled={!canSubmit} onClick={() => onSubmit('all')}>Predict all the estimates above</button>
    <details className="risk-predict-advanced">
      <summary>Advanced LP / Trade</summary>
      <div><span className="risk-kicker">Advanced</span><strong>Outcome-token opportunity</strong></div>
      <p>LP or trade specific outcome tokens in the saved Seer market.</p>
      {assets.map((asset) => <a key={asset.id} className="risk-inline-button" href={asset.marketUrl} target="_blank" rel="noreferrer">{asset.ticker} outcome market <ArrowUpRight /></a>)}
    </details>
    </details>
    <span className="sr-only" aria-live="polite">{canSubmit ? 'Prediction actions enabled.' : reason}</span>
    <div className="risk-predict-mobile-action">{submitButton}<span>{roundStatus === 'ended' ? 'Q3 closed · estimates saved as a draft' : reason}</span></div>
  </aside>;
}
