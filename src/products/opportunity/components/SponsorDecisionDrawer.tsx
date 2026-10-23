import { useEffect, useRef, useState } from 'react';
import {
  makeDecisionId,
  type ReviewWorkspaceState,
  type SponsorDecisionAction,
  type SponsorDecisionRecord,
} from '../data/reviewCut';
import type { SubmissionDossier } from '../data/types';
import type { WalletStatus } from '../hooks/useWallet';
import { OverlayDialog } from './OverlayDialog';

interface SponsorDecisionDrawerProps {
  dossier: SubmissionDossier;
  workspace: ReviewWorkspaceState;
  walletStatus: WalletStatus;
  walletAddress: string | null;
  onOpenWallet: () => void;
  onSignMessage: (message: string) => Promise<string>;
  onWorkspaceChange: (
    patch: Partial<ReviewWorkspaceState> | ((current: ReviewWorkspaceState) => Partial<ReviewWorkspaceState>),
  ) => void;
  onClose: () => void;
}

type DecisionPhase = 'idle' | 'optimistic' | 'pending' | 'confirmed' | 'failed' | 'already-decided';

const actionLabels: Array<{ value: SponsorDecisionAction; label: string }> = [
  { value: 'select', label: 'Confirm selection' },
  { value: 'reject', label: 'Reject' },
  { value: 'defer', label: 'Defer' },
  { value: 'withdraw', label: 'Withdraw decision' },
];

export function SponsorDecisionDrawer({
  dossier,
  workspace,
  walletStatus,
  walletAddress,
  onOpenWallet,
  onSignMessage,
  onWorkspaceChange,
  onClose,
}: SponsorDecisionDrawerProps) {
  const { submission, market } = dossier;
  const [action, setAction] = useState<SponsorDecisionAction>('select');
  const [reason, setReason] = useState('');
  const [validation, setValidation] = useState<string | null>(null);
  const [phase, setPhase] = useState<DecisionPhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const active = useRef(true);
  const signing = useRef(false);
  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);
  const existing = workspace.decisions[submission.id];
  const sourceDecided = ['selected', 'rejected', 'withdrawn'].includes(submission.decision) && !existing;
  const alreadyDecided = sourceDecided || (existing?.status === 'confirmed' && existing.action !== 'withdraw' && existing.action !== 'defer');
  const effectivePhase: DecisionPhase = phase === 'idle' && alreadyDecided ? 'already-decided' : phase;

  const submit = async () => {
    if (signing.current) return;
    setValidation(null);
    setError(null);
    if (alreadyDecided && action !== 'withdraw') {
      setPhase('already-decided');
      setValidation('This submission already has a recorded decision.');
      return;
    }
    if (action === 'withdraw' && (!existing || existing.status !== 'confirmed')) {
      setValidation('Only a signed private review can be withdrawn.');
      return;
    }
    if ((action === 'reject' || action === 'defer') && reason.trim().length < 12) {
      setValidation('Enter at least 12 characters of decision rationale.');
      return;
    }
    if (walletStatus !== 'connected' || !walletAddress) {
      setValidation('Connect on Gnosis Chain to sign a private review.');
      return;
    }

    const optimistic: SponsorDecisionRecord = {
      id: makeDecisionId(submission.id),
      submissionId: submission.id,
      action,
      status: 'optimistic',
      rationale: reason.trim(),
      signature: null,
      createdAt: new Date().toISOString(),
      signedAt: null,
      error: null,
    };
    signing.current = true;
    onWorkspaceChange((current) => ({
      decisions: { ...current.decisions, [submission.id]: optimistic },
    }));
    setPhase('optimistic');
    setPhase('pending');
    onWorkspaceChange(current => ({ decisions: { ...current.decisions, [submission.id]: { ...optimistic, status: 'pending' } } }));
    const message = [
      'Seer Opportunity private review; no sponsor authorization or blockchain transaction',
      `market:${market.id}`,
      `submission:${submission.id}`,
      `reviewer:${walletAddress}`,
      `record:${optimistic.id}`,
      `action:${action}`,
      `rationale:${reason.trim() || 'confirmed without an additional note'}`,
    ].join('\n');
    try {
      const signature = await onSignMessage(message);
      onWorkspaceChange((current) => current.decisions[submission.id]?.id !== optimistic.id ? {} : ({
        decisions: {
          ...current.decisions,
          [submission.id]: {
            ...optimistic,
            status: 'confirmed',
            signature,
            signedAt: new Date().toISOString(),
            error: null,
          },
        },
      }));
      if (active.current) setPhase('confirmed');
    } catch (caught) {
      const messageText = caught instanceof Error ? caught.message : 'The wallet signature failed.';
      onWorkspaceChange((current) => current.decisions[submission.id]?.id !== optimistic.id ? {} : ({
        decisions: {
          ...current.decisions,
          [submission.id]: {
            ...optimistic,
            status: 'failed',
            error: messageText,
          },
        },
      }));
      if (active.current) { setPhase('failed'); setError(messageText); }
    } finally {
      signing.current = false;
    }
  };

  return (
    <OverlayDialog
      title="Private review"
      description="Preview and sign a private review record with your connected wallet."
      variant="drawer"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="secondary-action" onClick={onClose}>Cancel</button>
          {walletStatus !== 'connected' ? (
            <button type="button" className="authority-action" onClick={onOpenWallet}>Connect wallet</button>
          ) : (
            <button type="button" className="authority-action" disabled={phase === 'pending' || phase === 'optimistic'} title={phase === 'pending' || phase === 'optimistic' ? 'Wait for the current signature request.' : undefined} onClick={() => void submit()}>
              {phase === 'pending' ? 'Waiting for wallet' : actionLabels.find((item) => item.value === action)?.label}
            </button>
          )}
        </>
      }
    >
      <section className="decision-preview" aria-labelledby="decision-preview-title">
        <p className="section-kicker">Private review preview</p>
        <h3 id="decision-preview-title">{submission.name}</h3>
        <dl>
          <div><dt>Rank</dt><dd>#{submission.rank}</dd></div>
          <div><dt>Market odds</dt><dd>{submission.oddsPercent === null ? 'Unpriced' : `${submission.oddsPercent}%`}</dd></div>
          <div><dt>Source decision</dt><dd>{submission.decision}</dd></div>
          <div><dt>Final authority</dt><dd>{market.sponsor} sponsor</dd></div>
          <div><dt>Your private review</dt><dd>{existing?.status === 'confirmed' ? existing.action : 'Not signed'}</dd></div>
        </dl>
        <p>Your signed note stays private. {market.sponsor} retains final authority.</p>
      </section>
      <fieldset className="decision-actions" disabled={phase === 'pending' || phase === 'optimistic'}>
        <legend>Decision action</legend>
        {actionLabels.map((item) => (
          <label key={item.value}>
            <input type="radio" name="decision-action" value={item.value} checked={action === item.value} onChange={() => setAction(item.value)} />
            <span>{item.label}</span>
          </label>
        ))}
      </fieldset>
      <label className="review-rationale-field">
        <span>Decision rationale {(action === 'reject' || action === 'defer') ? '(required)' : '(optional)'}</span>
        <textarea
          rows={5}
          disabled={phase === 'pending' || phase === 'optimistic'}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Record your review evidence."
        />
      </label>
      <div className={`decision-state decision-state--${effectivePhase}`} role="status">
        <strong>{effectivePhase.replace('-', ' ')}</strong>
        <p>
          {effectivePhase === 'idle' && 'Review the preview before requesting a wallet signature.'}
          {effectivePhase === 'optimistic' && 'The workspace record is staged for signature.'}
          {effectivePhase === 'pending' && 'The wallet signature request is pending.'}
          {effectivePhase === 'confirmed' && 'Your signed private review is saved.'}
          {effectivePhase === 'failed' && (error ?? 'The decision signature failed.')}
          {effectivePhase === 'already-decided' && 'This submission already has a recorded decision.'}
        </p>
      </div>
      {validation && <p className="form-error" role="alert">{validation}</p>}
      <p className="decision-honesty">Signs a private review. Source decisions and settlement stay unchanged.</p>
    </OverlayDialog>
  );
}
