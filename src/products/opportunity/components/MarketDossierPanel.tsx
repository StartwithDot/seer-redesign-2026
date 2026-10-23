import { ArchiveResolution } from './ArchiveResolution';
import { useState } from 'react';
import { MarketAnalytics } from './MarketAnalytics';
import { MarketArtwork } from './MarketArtwork';
import type { MarketDossier } from '../data/types';
import { MarketTimeline } from './MarketTimeline';
import { RecordActions } from './RecordActions';
import { ArchiveGallery } from './ArchiveGallery';
import { ArchivePositions } from './ArchivePositions';
import { archiveEvidenceFor } from '../data/archive';

interface MarketDossierPanelProps {
  dossier: MarketDossier;
}

export function MarketDossierPanel({ dossier }: MarketDossierPanelProps) {
  const [tab, setTab] = useState<'overview' | 'analytics' | 'gallery' | 'positions'>('overview');
  const market = dossier.market;
  const params = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search);
  const activeTab = params?.has('redeem') ? 'positions' : params?.has('galleryImage') ? 'gallery' : tab;
  const completion = Math.min(100, dossier.outcomeCompletionPercent);
  return (
    <article className="record-dossier market-dossier">
      <div className="analysis-controls" role="group" aria-label="Market dossier view">
        <button type="button" aria-pressed={activeTab === 'overview'} onClick={() => setTab('overview')}>Overview</button>
        <button type="button" aria-pressed={activeTab === 'analytics'} onClick={() => setTab('analytics')}>Analytics</button>
        {archiveEvidenceFor(market.id) && <>
          <button type="button" aria-pressed={activeTab === 'gallery'} onClick={() => setTab('gallery')}>Gallery</button>
          <button type="button" aria-pressed={activeTab === 'positions'} onClick={() => setTab('positions')}>Payouts</button>
        </>}
      </div>
      {activeTab === 'overview' && <ArchiveResolution marketId={market.id} />}
      <a className="secondary-action" href={`/opportunity/review/${encodeURIComponent(market.id)}`}>Open opportunity</a>
      {market.source === 'verified' && market.contract && <a className="text-action" href={`https://app.seer.pm/markets/100/${market.contract}`} target="_blank" rel="noreferrer">Source market ↗</a>}
      {activeTab === 'gallery' ? <ArchiveGallery key={market.id} marketId={market.id} /> : activeTab === 'positions' ? <ArchivePositions key={market.id} marketId={market.id} /> : activeTab === 'analytics' ? <MarketAnalytics market={market}/> : <>
      <figure className="record-visual">
        <MarketArtwork market={market} compact />
        <figcaption>
          <span>{dossier.verificationLabel}</span>
          <strong>{market.id === 'seer-ai-job-board-name' ? 'Opportunity Markets' : market.source === 'sample' ? 'Sample record' : 'Submitted work'}</strong>
        </figcaption>
      </figure>

      <section aria-labelledby="market-identity-title">
        <p className="section-kicker">Market identity</p>
        <h3 id="market-identity-title">{market.title}</h3>
        <p>{market.description}</p>
        <dl>
          <div><dt>Market ID</dt><dd>{market.id}</dd></div>
          <div><dt>Creator</dt><dd>{market.creator}</dd></div>
          <div><dt>Sponsor</dt><dd>{market.sponsor}</dd></div>
          <div><dt>Created</dt><dd>{market.createdAt ?? 'Unavailable in source evidence'}</dd></div>
          <div><dt>Status</dt><dd>{market.status}</dd></div>
          <div><dt>Source application</dt><dd>{market.source === 'sample' ? 'Deterministic sample' : 'Seer Opportunity Markets'}</dd></div>
        </dl>
      </section>

      <section aria-labelledby="market-contract-title">
        <p className="section-kicker">Contract and provenance</p>
        <h3 id="market-contract-title">{market.network} · {market.collateral}</h3>
        <dl>
          <div><dt>Contract address</dt><dd>{market.contract ?? 'Unavailable in source evidence'}</dd></div>
          <div><dt>Verification</dt><dd>{dossier.verificationLabel}</dd></div>
          <div><dt>Pool status</dt><dd>{dossier.poolStatus}</dd></div>
          <div><dt>Floor price</dt><dd>{dossier.floorPriceUsd === null ? 'No priced outcomes' : `$${dossier.floorPriceUsd.toFixed(3)}`}</dd></div>
        </dl>
      </section>

      <section aria-labelledby="market-metrics-title">
        <p className="section-kicker">Market activity</p>
        <h3 id="market-metrics-title">Volume, liquidity, and outcome-set completion</h3>
        <dl>
          <div><dt>Trading volume</dt><dd>${market.volumeUsd.toLocaleString()}</dd></div>
          <div><dt>Available liquidity</dt><dd>${market.liquidityUsd.toLocaleString()}</dd></div>
          <div><dt>Outcomes</dt><dd>{market.submissionCount}</dd></div>
          <div><dt>Decided outcomes</dt><dd>{market.decidedCount}</dd></div>
        </dl>
        <div className="completion-readout">
          <div><span>Outcome-set completion</span><strong>{completion}%</strong></div>
          <progress value={completion} max={100}>{completion}%</progress>
          <p>{market.decisions.undecided} undecided · {market.decisions.shortlisted} shortlisted · {market.decisions.selected} selected</p>
        </div>
      </section>

      <RecordActions
        recordId={`market-${market.id}`}
        values={[
          { label: 'Market ID', value: market.id },
          {
            label: 'Contract',
            value: market.contract ?? 'Unavailable',
            note: market.contract ? 'Copy the address exactly as supplied by the source record.' : 'No full address is included in the current evidence.',
          },
          { label: 'Network', value: market.network },
        ]}
      />
      <MarketTimeline events={dossier.events} />
      </>}
    </article>
  );
}
