import { useEffect, useState } from 'react';
import { encodeApproval, encodeRedemption, gnosisRouter } from '../data/contractRpc';
import { formatTokenAmount, redemptionGuard } from '../data/redemption';
import { useRedeemPositions } from '../hooks/useRedeemPositions';
import { useOpportunityWallet } from '../hooks/WalletContext';
import { OverlayDialog } from './OverlayDialog';
import { TransactionStatus } from './TransactionStatus';

export function RedeemDrawer({ marketId, initialIndex, onClose }: { marketId: string; initialIndex: number; onClose: () => void }) {
  const wallet = useOpportunityWallet();
  const data = useRedeemPositions(marketId);
  const [index, setIndex] = useState(initialIndex);
  const [reviewed, setReviewed] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const position = data.positions.find(p => p.index === index) ?? null;
  const guard = redemptionGuard(position);
  const busy = preparing || ['confirming', 'pending'].includes(wallet.transaction.status);
  const needsApproval = Boolean(position && position.balance !== null && position.allowance !== null && position.allowance < position.balance);
  const readState = `${position?.block}:${position?.allowance}:${position?.balance}:${position?.payout}`;
  useEffect(() => { setReviewed(false); }, [readState]);
  useEffect(() => { setReviewed(false); setMessage(null); }, [index, wallet.address, wallet.status]);
  const execute = async () => {
    if (!position || guard || busy) return;
    setPreparing(true);
    try {
      // Re-read before every write so a stale preview never spends a previous balance.
      setReviewed(false);
      const provider = { request: (args: { method: string; params?: unknown[] | Record<string, unknown> }) => wallet.read(args.method, Array.isArray(args.params) ? args.params : []) };
      const { readRedeemPositions } = await import('../data/redemption');
      const fresh = (await readRedeemPositions(provider, wallet.address!, marketId)).find(p => p.index === index) ?? null;
      const freshGuard = redemptionGuard(fresh);
      if (freshGuard || !fresh) throw new Error(freshGuard ?? 'Position unavailable.');
      if (fresh.balance !== position.balance || fresh.payout !== position.payout) { await data.refresh(); throw new Error('Your position changed. Review the updated payout.'); }
      const approve = fresh.allowance! < fresh.balance!;
      await wallet.sendTransaction({
        to: approve ? fresh.token : gnosisRouter,
        data: approve ? encodeApproval(fresh.balance!) : encodeRedemption(fresh.collateral, fresh.contract, fresh.index, fresh.balance!),
        label: approve ? `Approve ${fresh.title}` : `Redeem ${fresh.title}`,
      });
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Wallet request failed.'); }
    finally { setPreparing(false); }
  };
  const receipt = [...wallet.receipts].reverse().find(r => r.account.toLowerCase() === wallet.address?.toLowerCase() && r.label === `Redeem ${position?.title}`);
  return <OverlayDialog title="Redeem winning shares" description="Review payout, approve outcome tokens, and confirm in your wallet." variant="drawer" onClose={onClose}>
    <div className="redeem-ticket">
      {wallet.status !== 'connected' ? <p role="status">{wallet.status === 'wrong-network' ? 'Switch to Gnosis Chain in the wallet panel.' : 'Connect your wallet from the header.'}</p> : <>
        <label className="trade-field"><span>Outcome</span><select value={index} disabled={busy} onChange={e => setIndex(Number(e.target.value))}>
          {data.positions.map(p => <option key={p.index} value={p.index}>{p.title}{p.numerator > 0n ? ' · Winner' : ''}</option>)}
        </select></label>
        {data.status === 'loading' && <p role="status">Reading on-chain positions…</p>}
        {data.error && <p role="alert">{data.error}</p>}
        {position && <dl>
          <div><dt>Shares held</dt><dd>{position.balance === null ? 'Unavailable' : formatTokenAmount(position.balance)}</dd></div>
          <div><dt>Payout</dt><dd>{position.payout === null ? 'Unavailable' : `${formatTokenAmount(position.payout)} sDAI`}</dd></div>
          <div><dt>Settlement fraction</dt><dd>{position.numerator.toString()} / {position.denominator.toString()}</dd></div>
          <div><dt>Approval</dt><dd>{position.allowance === null ? 'Unavailable' : needsApproval ? 'Required for this amount' : 'Available'}</dd></div>
        </dl>}
        {guard && <p role="status">{guard}</p>}
        {receipt && <p role="status">Redemption confirmed this session. <a href={`https://gnosisscan.io/tx/${receipt.hash}`} target="_blank" rel="noreferrer">View receipt ↗</a></p>}
        <button type="button" className="secondary-action" disabled={data.status === 'loading' || busy} title={busy ? 'Wait for the pending wallet transaction.' : 'Read the current on-chain position.'} onClick={() => void data.refresh()}>Refresh position</button>
        {!guard && <>
          <label><input type="checkbox" checked={reviewed} disabled={busy} onChange={e => setReviewed(e.target.checked)} />
            {needsApproval ? 'Allow the Seer router to spend these shares.' : 'Redeem all of these winning shares for sDAI.'}</label>
          <a href={`https://gnosisscan.io/address/${gnosisRouter}`} target="_blank" rel="noreferrer">Inspect Seer router ↗</a>
          <button type="button" className="primary-action" disabled={!reviewed || busy} title={!reviewed ? 'Review and acknowledge the payout first.' : undefined} onClick={() => void execute()}>
            {preparing ? 'Checking position…' : busy ? 'Transaction in progress…' : needsApproval ? 'Approve outcome tokens' : 'Confirm redemption'}</button>
        </>}
      </>}
      {message && <p role="alert">{message}</p>}
      <TransactionStatus />
    </div>
  </OverlayDialog>;
}
