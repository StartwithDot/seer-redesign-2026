import { copyText, submissionUrl } from '../data/sharing';
import { useEffect, useMemo, useState } from 'react';
import {
  removeShortlist,
  upsertShortlist,
  type ReviewWorkspaceState,
} from '../data/reviewCut';
import { buildSubmissionDossier } from '../data/records';
import { withPrivateReviews } from '../data/reviewDossiers';
import { marketImageFor } from '../data/marketAssets';
import { marketById } from '../data/markets';
import { submissionsForMarket } from '../data/submissions';
import type { TradeMode } from '../data/trade';
import { useReviewPreferences } from '../hooks/useReviewPreferences';
import { useReviewWorkspace } from '../hooks/useReviewWorkspace';
import { useReviewOverlay } from '../hooks/useReviewOverlay';
import type { WalletStatus } from '../hooks/useWallet';
import { DecisionLane } from './DecisionLane';
import { ReviewCompareDialog } from './ReviewCompareDialog';
import { ReviewCutView } from './ReviewCutView';
import { ReviewField } from './ReviewField';
import { ReviewList } from './ReviewList';
import { ReviewSubmissionDossier } from './ReviewSubmissionDossier';
import { ShortlistDrawer } from './ShortlistDrawer';
import { SponsorDecisionDrawer } from './SponsorDecisionDrawer';
import { SubmissionDossierDrawer } from './SubmissionDossierDrawer';
import { TradeDrawer } from './TradeDrawer';

interface ReviewViewProps {
  marketId: string;
  initialSubmissionId: string | null;
  walletStatus: WalletStatus;
  walletAddress: string | null;
  walletBalance: string | null;
  collateralBalance: string | null;
  onSignMessage: (message: string) => Promise<string>;
  onOpenWallet: () => void;
  onNavigate: (href: string, replace?: boolean) => void;
  onBack: () => void;
}

export function ReviewView({
  marketId,
  initialSubmissionId,
  walletStatus,
  walletAddress,
  walletBalance,
  collateralBalance,
  onSignMessage,
  onOpenWallet,
  onNavigate,
  onBack,
}: ReviewViewProps) {
  const market = marketById.get(marketId);
  const submissions = useMemo(() => submissionsForMarket(marketId), [marketId]);
  const sourceDossiers = useMemo(
    () => market ? submissions.map((submission) => buildSubmissionDossier(submission, market)) : [],
    [market, submissions],
  );
  const selectedId = submissions.find(submission => submission.id === initialSubmissionId)?.id ?? submissions[0]?.id ?? '';
  const { overlay, setOverlay } = useReviewOverlay(onNavigate);
  const [bulkIds, setBulkIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const { preferences, setPreferences } = useReviewPreferences(marketId);
  const workspace = useReviewWorkspace(marketId, walletAddress);
  useEffect(() => {
    const prepareTour = (event: Event) => {
      const view = (event as CustomEvent<string>).detail;
      if (view === 'field' || view === 'cut') setPreferences(current => ({ ...current, view }));
      setOverlay(view === 'trade' ? 'trade' : null, true);
    };
    window.addEventListener('opportunity:tour-step', prepareTour);
    return () => window.removeEventListener('opportunity:tour-step', prepareTour);
  }, [setPreferences, setOverlay]);
  const dossiers = useMemo(() => withPrivateReviews(sourceDossiers, workspace.state), [sourceDossiers, workspace.state]);
  const selectedDossier = dossiers.find((dossier) => dossier.submission.id === selectedId) ?? dossiers[0];
  const shortlistIds = workspace.state.shortlist.map((entry) => entry.submissionId);

  const params = new URLSearchParams(window.location.search);
  const tradeMode: TradeMode = params.get('mode') === 'sell' ? 'sell' : 'buy';
  const compareIds = (params.get('compare')?.split(',') ?? shortlistIds).filter(id => dossiers.some(dossier => dossier.submission.id === id));
  useEffect(() => {
    try { window.localStorage.setItem('opportunity-selected-market', marketId); } catch { /* Session selection remains usable. */ }
  }, [marketId]);

  const updateSubmissionUrl = (submissionId: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('submission', submissionId);
    onNavigate(`/opportunity/review/${encodeURIComponent(marketId)}?${params.toString()}`, true);
  };

  const selectSubmission = (submissionId: string) => {
    updateSubmissionUrl(submissionId);
  };

  const updateWorkspace = (
    patch: Partial<ReviewWorkspaceState> | ((current: ReviewWorkspaceState) => Partial<ReviewWorkspaceState>),
  ) => workspace.update(patch);

  const toggleShortlist = (submissionId: string) => {
    updateWorkspace((current) => ({
      shortlist: current.shortlist.some(entry => entry.submissionId === submissionId)
        ? removeShortlist(current.shortlist, submissionId)
        : upsertShortlist(current.shortlist, submissionId),
    }));
  };

  const openDossier = (submissionId: string) => {
    setOverlay('dossier', overlay === 'dossier', { submission: submissionId });
  };

  const closeDossier = () => setOverlay(null);

  const moveDossier = (direction: -1 | 1) => {
    const currentIndex = dossiers.findIndex((dossier) => dossier.submission.id === selectedId);
    const nextIndex = (Math.max(currentIndex, 0) + direction + dossiers.length) % dossiers.length;
    const next = dossiers[nextIndex];
    if (next) openDossier(next.submission.id);
  };

  const openTrade = (mode: TradeMode) => {
    setOverlay('trade', overlay === 'trade', { submission: selectedDossier?.submission.id ?? null, mode });
  };

  const openDecision = (submissionId = selectedDossier?.submission.id ?? '') => {
    if (!submissionId) return;
    setOverlay('decision', overlay === 'decision', { submission: submissionId });
  };

  const openCompare = (ids: string[]) => {
    const nextIds = ids.length ? ids : shortlistIds;
    setOverlay('compare', overlay === 'compare', { submission: nextIds[0] ?? null, compare: nextIds.join(',') });
  };

  const copySubmissionLink = async (submissionId: string) => {
    try {
      await copyText(submissionUrl(marketId, submissionId));
      setCopyStatus(`Link copied for ${submissionId}.`);
    } catch { setCopyStatus('Copy failed. Copy the page address from your browser.'); }
    window.setTimeout(() => setCopyStatus(null), 2400);
  };

  if (!market) {
    return (
      <div className="destination-view review-view">
        <header className="destination-header">
          <div>
            <p className="section-kicker">Review Cut</p>
            <h1>Market record not found.</h1>
            <p>The requested review market is not present in the current opportunity data set.</p>
          </div>
          <button type="button" className="primary-action" onClick={onBack}>Return to board</button>
        </header>
      </div>
    );
  }

  const decisionDossier = selectedDossier;
  const dossierDrawer = selectedDossier;
  const tradeDossier = selectedDossier;
  const winnerDossier = dossiers.find((dossier) => dossier.winner) ?? null;
  const comparedDossiers = compareIds.flatMap((id) => {
    const dossier = dossiers.find((item) => item.submission.id === id);
    return dossier ? [dossier] : [];
  });

  return (
    <div className="destination-view review-view">
      <header className="destination-header review-destination-header">
        <div>
          <button className="back-action" type="button" onClick={onBack}>← Back to board</button>
          <p className="section-kicker">Review Cut · {market.title}</p>
          <h1>Focus the review queue.</h1>
          <p>Compare submissions. The sponsor decides.</p>
        </div>
        <div className="review-summary">
          <strong>{market.submissionCount}</strong>
          <span>submissions in this market</span>
        </div>
      </header>

      <DecisionLane
        market={market}
        winner={winnerDossier}
        winners={dossiers.filter(dossier => dossier.winner)}
        decisions={workspace.state.decisions}
        onOpenDecision={() => openDecision()}
      />

      <div className="review-workspace">
        {initialSubmissionId && !submissions.some(item => item.id === initialSubmissionId) && <p role="alert">Submission not found. Showing the first available candidate.</p>}
        <section className="review-analysis" aria-labelledby="review-analysis-title">
          <h2 id="review-analysis-title" className="sr-only">Submission analysis</h2>
          <div className="review-view-tabs" role="tablist" aria-label="Submission analysis views" onKeyDown={event => {
            const views = ['field', 'list', 'cut'] as const;
            const index = views.indexOf(preferences.view);
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : event.key === 'ArrowRight' ? (index + 1) % 3 : event.key === 'ArrowLeft' ? (index + 2) % 3 : -1;
            if (next < 0) return;
            event.preventDefault();
            setPreferences(current => ({ ...current, view: views[next] }));
            document.getElementById(`review-view-tab-${views[next]}`)?.focus();
          }}>
            {(['field', 'list', 'cut'] as const).map((view) => (
              <button
                key={view}
                id={`review-view-tab-${view}`}
                type="button"
                role="tab"
                tabIndex={preferences.view === view ? 0 : -1}
                aria-selected={preferences.view === view}
                aria-controls="review-view-panel"
                onClick={() => setPreferences((current) => ({ ...current, view }))}
              >
                {view === 'field' ? 'Field' : view === 'list' ? 'List' : 'Review Cut'}
              </button>
            ))}
          </div>
          <div id="review-view-panel" role="tabpanel" aria-labelledby={`review-view-tab-${preferences.view}`}>
            {preferences.view === 'field' && (
              <ReviewField
                dossiers={dossiers}
                selectedId={selectedDossier?.submission.id ?? ''}
                preferences={preferences.field}
                onSelect={selectSubmission}
                onOpen={openDossier}
                onPreferencesChange={(field) => setPreferences((current) => ({ ...current, field }))}
              />
            )}
            {preferences.view === 'list' && (
              <ReviewList
                dossiers={dossiers}
                selectedId={selectedDossier?.submission.id ?? ''}
                sort={preferences.sort}
                density={preferences.listDensity}
                page={workspace.state.listPage}
                pageSize={workspace.state.listPageSize}
                selectedIds={bulkIds}
                expandedId={expandedId}
                shortlistIds={shortlistIds}
                onSelect={selectSubmission}
                onSortChange={(sort) => setPreferences((current) => ({ ...current, sort }))}
                onDensityChange={(listDensity) => setPreferences((current) => ({ ...current, listDensity }))}
                onPageChange={(listPage) => updateWorkspace({ listPage })}
                onPageSizeChange={(listPageSize) => updateWorkspace({ listPageSize, listPage: 1 })}
                onSelectedIdsChange={setBulkIds}
                onExpandedChange={setExpandedId}
                onShortlistToggle={toggleShortlist}
                onCompare={openCompare}
                onOpenDossier={openDossier}
                onCopyLink={copySubmissionLink}
              />
            )}
            {preferences.view === 'cut' && (
              <ReviewCutView
                market={market}
                dossiers={dossiers}
                selectedId={selectedDossier?.submission.id ?? ''}
                workspace={workspace.state}
                onWorkspaceChange={updateWorkspace}
                onSelect={selectSubmission}
                onOpenDossier={openDossier}
                onOpenShortlist={() => setOverlay('shortlist')}
                onOpenCompare={() => openCompare(shortlistIds)}
                onOpenDecision={() => openDecision()}
              />
            )}
          </div>
        </section>
        {selectedDossier && overlay !== 'dossier' && (
          <>
          <aside className="review-selected-preview" aria-label="Selected submission">
            <div><p>Selected submission</p><strong>{selectedDossier.submission.name}</strong><span>{selectedDossier.submission.oddsPercent === null ? 'Unpriced' : `Chance ${selectedDossier.submission.oddsPercent}%`} · Rank {selectedDossier.submission.rank}</span></div>
            <button type="button" className="secondary-action" onClick={() => openDossier(selectedDossier.submission.id)}>View submission <span aria-hidden="true">↗</span></button>
          </aside>
          <div id="review-submission-dossier">
            <ReviewSubmissionDossier key={selectedDossier.submission.id} dossier={selectedDossier} onNavigate={onNavigate} actionBar={<button type="button" className="primary-action" onClick={() => openDossier(selectedDossier.submission.id)}>Open submission</button>} />
          </div>
          </>
        )}
      </div>

      <p className="copy-status" role="status">{copyStatus}</p>
      {selectedDossier && <div className="mobile-review-actions"><button type="button" className="primary-action" onClick={() => openTrade('buy')}>Buy · {selectedDossier.submission.name}</button><button type="button" className="secondary-action" onClick={() => openDossier(selectedDossier.submission.id)}>Submission</button></div>}

      {overlay === 'shortlist' && (
        <ShortlistDrawer
          dossiers={dossiers}
          workspace={workspace.state}
          onWorkspaceChange={updateWorkspace}
          onOpenDossier={openDossier}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay === 'compare' && (
        <ReviewCompareDialog
          key={`${compareIds.join('-')}:${walletAddress ?? 'guest'}`}
          dossiers={comparedDossiers}
          rationale={workspace.state.rationale}
          onRationaleChange={(rationale) => updateWorkspace({ rationale })}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay === 'decision' && decisionDossier && (
        <SponsorDecisionDrawer
          key={`${marketId}:${decisionDossier.submission.id}:${walletAddress ?? 'guest'}`}
          dossier={sourceDossiers.find(item => item.submission.id === decisionDossier.submission.id) ?? decisionDossier}
          workspace={workspace.state}
          walletStatus={walletStatus}
          walletAddress={walletAddress}
          onOpenWallet={onOpenWallet}
          onSignMessage={onSignMessage}
          onWorkspaceChange={updateWorkspace}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay === 'dossier' && dossierDrawer && (
        <SubmissionDossierDrawer
          dossier={dossierDrawer}
          marketImageUrl={marketImageFor(dossierDrawer.market)}
          shortlisted={shortlistIds.includes(dossierDrawer.submission.id)}
          onToggleShortlist={() => toggleShortlist(dossierDrawer.submission.id)}
          onCompare={() =>
            openCompare(
              [dossierDrawer.submission.id, ...shortlistIds.filter((id) => id !== dossierDrawer.submission.id)].slice(0, 3),
            )
          }
          onOpenTrade={openTrade}
          onOpenDecision={() => openDecision(dossierDrawer.submission.id)}
          onPrevious={() => moveDossier(-1)}
          onNext={() => moveDossier(1)}
          onNavigate={onNavigate}
          onClose={closeDossier}
        />
      )}
      {overlay === 'trade' && tradeDossier && (
        <TradeDrawer
          key={tradeDossier.submission.id}
          dossier={tradeDossier}
          initialMode={tradeMode}
          walletStatus={walletStatus}
          walletBalance={walletBalance}
          collateralBalance={collateralBalance}
          onOpenWallet={onOpenWallet}
          onClose={() => setOverlay(null)}
        />
      )}
    </div>
  );
}
