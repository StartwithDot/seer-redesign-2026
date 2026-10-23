import { useEffect, useMemo, useState } from 'react';
import { RISK_ASSETS } from '../data/assets';
import { buildPredictionCsv, downloadTextFile, predictionFilename } from '../data/prediction-csv';
import { editedAssetIds, predictionAvailability, predictionLifecycleLabel, restingPredictionState } from '../data/prediction-state';
import type { AssetRecord, PredictionLifecycle, UserEstimates } from '../data/types';
import type { WalletStatus } from '../hooks/useWallet';
import { AggregatePredictionCard } from './AggregatePredictionCard';
import { CsvPredictionModal } from './CsvPredictionModal';
import { PredictionActionPanel } from './PredictionActionPanel';
import { PredictionAssetList } from './PredictionAssetList';

interface PredictionDeskProps {
  assets: AssetRecord[];
  estimates: UserEstimates;
  onConnect: () => void;
  onDetails: (assetId: string) => void;
  onEstimatesChange: (estimates: UserEstimates) => void;
  onEstimateChange: (assetId: string, value: number) => void;
  roundStatus: 'ended' | 'upcoming' | 'active';
  walletAddress: string | null;
  walletOpen: boolean;
  walletStatus: WalletStatus;
}

export function PredictionDesk({ assets, estimates, onConnect, onDetails, onEstimatesChange, onEstimateChange, roundStatus, walletAddress, walletOpen, walletStatus }: PredictionDeskProps) {
  const [lifecycle, setLifecycle] = useState<PredictionLifecycle>(() => restingPredictionState(roundStatus, editedAssetIds(assets, estimates).length));
  const [csvOpen, setCsvOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const editedCount = useMemo(() => editedAssetIds(assets, estimates).length, [assets, estimates]);

  useEffect(() => {
    if (walletOpen) setLifecycle('wallet-connect');
  }, [walletOpen]);

  useEffect(() => {
    if (!walletOpen && !editedCount && lifecycle !== 'exported' && lifecycle !== 'wallet-connect') {
      setLifecycle(restingPredictionState(roundStatus, 0));
    }
  }, [walletOpen, editedCount, roundStatus, lifecycle]);

  useEffect(() => {
    if (lifecycle === 'wallet-connect' && (walletAddress || !walletOpen || walletStatus === 'rejected' || walletStatus === 'error')) {
      setLifecycle(restingPredictionState(roundStatus, editedCount));
      setNotice(walletAddress ? 'Wallet connected. Your draft is unchanged; no prediction has been submitted.'
        : walletStatus === 'rejected' ? 'Wallet request rejected. Your draft is unchanged.'
          : walletStatus === 'error' ? 'Wallet connection failed. Your draft is unchanged.'
            : 'Wallet connection closed. Your draft is unchanged.');
    }
  }, [walletAddress, walletOpen, walletStatus, lifecycle, roundStatus, editedCount]);

  const handleEstimateChange = (assetId: string, value: number) => {
    onEstimateChange(assetId, value);
    const count = editedAssetIds(assets, { ...estimates, [assetId]: value }).length;
    setLifecycle(count ? 'editing-asset' : restingPredictionState(roundStatus, 0));
    setNotice('');
  };

  const handleAggregateChange = (next: UserEstimates) => {
    onEstimatesChange(next);
    setLifecycle(editedAssetIds(assets, next).length ? 'editing-aggregate' : restingPredictionState(roundStatus, 0));
    setNotice('');
  };

  const handleCsvLoad = (next: UserEstimates, loadedCount: number) => {
    onEstimatesChange({ ...estimates, ...next });
    setLifecycle('csv-loaded');
    setCsvOpen(false);
    setNotice(`${loadedCount} predictions loaded. Aggregate, deltas, and group badges are up to date.`);
  };

  const handleExport = () => {
    try { downloadTextFile(predictionFilename(), buildPredictionCsv(RISK_ASSETS, estimates, true)); }
    catch { setNotice('Download could not start. Your saved predictions are unchanged. Try exporting again.'); return; }
    setLifecycle('exported');
    setNotice('Exported all 33 assets and No To All from the current saved snapshot, including your latest draft edits. Prices are not refreshed live.');
  };

  const handleReset = () => {
    onEstimatesChange({});
    setLifecycle(restingPredictionState(roundStatus, 0));
    setNotice('All estimates restored to the market baseline.');
  };

  const handleSubmit = (mode: 'selected' | 'all') => {
    if (!walletAddress) {
      setLifecycle('wallet-connect');
      setNotice('Connect a wallet to submit. No prediction is signed here.');
      onConnect();
      return;
    }
    if (roundStatus !== 'active') {
      setLifecycle(roundStatus === 'ended' ? 'ended' : 'idle');
      setNotice(roundStatus === 'ended' ? 'Q3 2026 is closed. Your draft is preserved for the next published round.' : 'Q4 2026 opens when market terms are published.');
      return;
    }
    setLifecycle(restingPredictionState(roundStatus, editedCount));
    setNotice(`${predictionAvailability(roundStatus, assets.length, editedCount).reason} Your ${mode === 'all' ? 'complete' : 'selected'} draft is unchanged.`);
  };

  return <section id="risk-participate" className="risk-predict-workspace" tabIndex={-1} aria-labelledby="risk-participate-title" data-align>
    <header className="risk-predict-intro">
      <p className="risk-kicker">Participate</p>
      <h2 id="risk-participate-title">Choose any number of protocols.</h2>
      <p>Compare market estimates, edit your draft, then export it. Live submission is closed.</p>
      <div className="risk-predict-intro-meta">
        <span>{editedCount} of {assets.length} edited</span>
        <span role="status">{predictionLifecycleLabel[lifecycle]}</span>
        <span>{roundStatus === 'ended' ? 'Q3 2026 ended · draft mode' : roundStatus === 'upcoming' ? 'Round not open · draft mode' : 'Live submission unavailable · draft mode'}</span>
      </div>
    </header>
    <div className="risk-predict-layout">
      <PredictionAssetList assets={assets} estimates={estimates} onDetails={onDetails} onEstimateChange={handleEstimateChange} />
      <PredictionActionPanel
        assets={assets}
        estimates={estimates}
        lifecycle={lifecycle}
        onConnect={() => { setLifecycle('wallet-connect'); onConnect(); }}
        onCsv={() => setCsvOpen(true)}
        onExport={handleExport}
        onReset={handleReset}
        onSubmit={handleSubmit}
        roundStatus={roundStatus}
        walletAddress={walletAddress}
      >
        <AggregatePredictionCard assets={assets} estimates={estimates} onReset={handleReset} onEstimatesChange={handleAggregateChange} />
      </PredictionActionPanel>
    </div>
    <p className="risk-predict-notice" aria-live="polite">{notice}</p>
    <CsvPredictionModal assets={RISK_ASSETS} open={csvOpen} onClose={() => setCsvOpen(false)} onLoad={handleCsvLoad} />
  </section>;
}
