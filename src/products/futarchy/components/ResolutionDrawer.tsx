import { useEffect, useMemo, useState } from 'react';
import { money } from '../data/format';
import { getRedemptionPlan } from '../data/resolution';
import type { Market } from '../data/types';
import type { WalletController } from '../hooks/useWallet';
import { ActionDrawerFrame } from './ActionDrawerFrame';
import { useWalletPortfolio } from '../hooks/useWalletPortfolio';
import { DataList } from './DataList';
import { WalletDataGate } from './WalletDataGate';

interface ResolutionDrawerProps {
  market: Market;
  wallet: WalletController;
  onClose: () => void;
  onOpenWallet: () => void;
}

type RedemptionPhase = 'ready' | 'success' | 'failure';

export function ResolutionDrawer({ market, wallet, onClose, onOpenWallet }: ResolutionDrawerProps) {
  const resource = useWalletPortfolio(wallet, market);
  const portfolio = resource.data;
  const ready = Boolean(portfolio);
  const winningUnits = market.resolvedOutcome === 'yes' ? portfolio?.positions[0]?.yesUnits ?? 0 : market.resolvedOutcome === 'no' ? portfolio?.positions[0]?.noUnits ?? 0 : 0;
  const plan = useMemo(() => getRedemptionPlan(market, winningUnits), [market, winningUnits]);
  const partialPosition = market.status === 'resolved' && winningUnits > 0 && Boolean(portfolio?.positions[0]) && (market.resolvedOutcome === 'yes' ? (portfolio?.positions[0]?.noUnits ?? 0) > 0 : (portfolio?.positions[0]?.yesUnits ?? 0) > 0);
  const [phase, setPhase] = useState<RedemptionPhase>('ready');
  const [notice, setNotice] = useState('');
  useEffect(() => { setPhase('ready'); setNotice(''); }, [wallet.address, ready]);

  const redeem = () => {
    if (!wallet.address) {
      onOpenWallet();
      return;
    }
    if (!ready) return;
    if (!plan.redeemable) {
      setPhase('failure');
      setNotice(plan.explanation);
      return;
    }
    setPhase('success');
    setNotice(`Redemption check completed for ${plan.winningUnits.toFixed(4)} example winning units. No on-chain transaction was sent.`);
  };

  const footer = phase === 'success' ? (
    <div className="trade-drawer-actions"><button className="quiet-button" type="button" onClick={onClose}>Back to market</button><button className="primary-button" type="button" onClick={() => setPhase('ready')}>Check again</button></div>
  ) : (
    <div className="trade-drawer-actions"><button className="quiet-button" type="button" onClick={onClose}>Close</button><button className="primary-button" type="button" onClick={redeem} disabled={Boolean(wallet.address) && !ready} title={wallet.address && !ready ? 'Refresh the account or switch to Gnosis first' : undefined}>{wallet.address ? 'Check redemption' : 'Connect wallet'}</button></div>
  );

  return (
    <ActionDrawerFrame eyebrow="RESOLUTION" title={`Redeem ${market.proposal}`} onClose={onClose} footer={footer}>
      <section className="resolution-summary" aria-labelledby="resolution-summary-title">
        <div className="trade-section-heading"><div><span className="eyebrow">RESOLUTION STATUS</span><h3 id="resolution-summary-title">{market.status === 'resolved' ? 'Outcome confirmed.' : 'Awaiting final outcome.'}</h3></div><span className={`operation-state is-${market.status === 'resolved' ? 'success' : 'waiting'}`}>{market.status === 'resolved' ? 'Resolved' : 'Not resolved'}</span></div>
        <dl>
          <div><dt>Resolved outcome</dt><dd>{market.resolvedOutcome ? market.resolvedOutcome.toUpperCase() : 'Not set'}</dd></div>
          <div><dt>WINNING OUTCOME</dt><dd>{market.resolvedOutcome ? market.resolvedOutcome.toUpperCase() : 'Unavailable'}</dd></div>
        </dl>
        <p className="trade-preview-disclosure">Winning units and values use an account-scoped position example. This check does not send a redemption transaction.</p>
        <WalletDataGate chainId={market.chainId} wallet={wallet} onOpenWallet={onOpenWallet}><DataList label="Redemption position" source={resource} count={portfolio ? 1 : 0} emptyTitle="No redemption position recorded." layout="table">
          <dl>
            <div><dt>Example winning units</dt><dd>{plan.winningUnits.toFixed(4)}</dd></div>
            <div><dt>Example value</dt><dd>{money(plan.value, 2)}</dd></div>
          </dl>
          <p>{partialPosition ? 'The example also holds the losing outcome. The winning side can be redeemed while the remaining pair is closed or merged.' : plan.explanation}</p>
          {!plan.redeemable && <div className="position-empty" role="status"><strong>{plan.state === 'resolved-only' ? 'No redeemable tokens yet' : plan.state === 'empty' ? 'No winning tokens' : 'Partial position'}</strong><p>{plan.explanation}</p></div>}
        </DataList></WalletDataGate>
      </section>
      {partialPosition && <p className="operation-notice" role="status">Partial position detected. The winning outcome is redeemable while the opposite outcome remains unmatched.</p>}
      {phase === 'success' && <p className="operation-notice" role="status">{notice}</p>}
      {phase === 'failure' && <p className="trade-alert" role="alert">{notice}</p>}
    </ActionDrawerFrame>
  );
}
