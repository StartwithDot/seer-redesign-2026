import { SourceDataPanel } from './SourceDataPanel';
import { buildHistory } from '../data/history';
import { RISK_ASSETS } from '../data/assets';
import { RiskRatingPanel } from './RiskRatingPanel';
import { AssetProvenance } from './AssetProvenance';
import { ProbabilityEditor } from './ProbabilityEditor';
import {
  annualToQuarterlyPd,
  formatPercent,
  hazardAtHorizon,
  pdAtHorizon,
  riskBand,
  survivalAtHorizon,
} from '../data/math';
import type { AssetRecord, UserEstimates } from '../data/types';
import { ArrowUpRight } from './Icons';
import { Modal } from './Modal';
import { AssetPortrait } from './AssetPortrait';

interface AssetDossierProps {
  asset: AssetRecord;
  clearEstimate: (assetId: string) => void;
  estimate?: number;
  onClose: () => void;
  open: boolean;
  setEstimate: (assetId: string, value: number) => void;
}

export function AssetDossier({ asset, clearEstimate, estimate, onClose, open, setEstimate }: AssetDossierProps) {
  const history = buildHistory(asset);
  const historyMax = Math.max(0.001, ...history.map((point) => point.marketPd));
  const marketChange = history.length > 1 ? history[history.length - 1].marketPd - history[0].marketPd : 0;
  const value = estimate ?? asset.pdAnn;
  const outcomeMarketUrl = asset.marketUrl;
  const peers = RISK_ASSETS.filter((candidate) => candidate.group === asset.group && candidate.id !== asset.id).slice(0, 3);

  return <Modal className="risk-asset-dossier" label={`${asset.ticker} asset dossier`} onClose={onClose} open={open}>
    <nav className="risk-dossier-breadcrumb" aria-label="Breadcrumb"><button type="button" className="risk-inline-button" onClick={onClose}>← Back to results</button><span>/</span><span aria-current="page">{asset.ticker}</span></nav>
    <header className="risk-dossier-header">
      <AssetPortrait key={asset.id} asset={asset} />
      <div>
        <p className="risk-kicker">{asset.group} · {asset.category || 'Category not published'}</p>
        <h2>{asset.ticker}</h2>
        <span>{asset.name}</span>
      </div>
    </header>

    <div className="risk-dossier-summary">
      <div><span>Grade</span><strong>{asset.grade || 'Not rated'}</strong></div>
      <div><span>Market PD Ann.</span><strong>{asset.marketPd.toFixed(3)}%</strong></div>
      <div><span>Market PD Quart.</span><strong>{annualToQuarterlyPd(asset.marketPd).toFixed(3)}%</strong></div>
      <div><span>Risk band</span><strong>{riskBand(asset.pdAnn)}</strong></div>
    </div>

    <RiskRatingPanel key={asset.id} asset={asset} />
    <section className="risk-dossier-section">
      <h3>What the estimate covers</h3>
      <p>{asset.note}</p>
      <p>At the current quarterly horizon, the market estimate implies {formatPercent(pdAtHorizon(asset.pdAnn, 3))} probability of the published default event and {formatPercent(survivalAtHorizon(asset.pdAnn, 3) * 100)} survival. The exact resolution trigger is governed by the Seer market terms.</p>
    </section>

    <section className="risk-dossier-section">
      <div className="risk-dossier-section-head">
        <h3>Your annual estimate</h3>
        <output>{value.toFixed(3)}%</output>
      </div>
      <ProbabilityEditor key={asset.id} asset={asset} value={value} onChange={(next) => setEstimate(asset.id, next)} />
      <div className="risk-dossier-actions">
        <span>Quart. equivalent: <strong>{formatPercent(annualToQuarterlyPd(value))}</strong></span>
        {estimate !== undefined && <button className="risk-inline-button" type="button" onClick={() => clearEstimate(asset.id)}>Reset to market</button>}
      </div>
    </section>

    <section className="risk-dossier-section">
      <h3>Saved history context</h3>
      <p>Consensus PD (Ann.): <strong>{asset.consensusPd.toFixed(3)}%</strong></p>
      {history.length ? <div className="risk-history-spark">
        <svg viewBox="0 0 320 82" role="img" aria-label={`${asset.ticker} saved market estimate history`}>
          <path d={history.map((point, index) => `${index ? 'L' : 'M'} ${8 + index / Math.max(1, history.length - 1) * 304} ${70 - point.marketPd / historyMax * 52}`).join(' ')} />
        </svg>
        <span>{marketChange >= 0 ? '+' : ''}{marketChange.toFixed(2)} points across the saved series</span>
      </div> : <p role="status">No pool observations are available for this asset. The market estimate remains visible above.</p>}
    </section>

    <section className="risk-dossier-section">
      <h3>Peers and provenance</h3>
      <div className="risk-peer-list">
        {peers.map((peer) => <div key={peer.id}><span>{peer.ticker}</span><strong>{formatPercent(peer.pdAnn)}</strong></div>)}
      </div>
      <div className="risk-provenance-links">
        <a href={outcomeMarketUrl} target="_blank" rel="noreferrer">Seer outcome market <ArrowUpRight /></a>

      </div>
    </section>

    <AssetProvenance key={asset.id} asset={asset} />
    <SourceDataPanel ticker={asset.ticker} />
    <footer className="risk-dossier-footer">
      <div>
        <span>Annual hazard</span>
        <strong>{hazardAtHorizon(asset.pdAnn).toFixed(4)}</strong>
      </div>
      <a className="risk-primary-button" href={outcomeMarketUrl} target="_blank" rel="noreferrer">LP / Trade on Seer <ArrowUpRight /></a>
    </footer>
  </Modal>;
}

export const getAssetEstimate = (asset: AssetRecord, estimates: UserEstimates): number | undefined => estimates[asset.id];
