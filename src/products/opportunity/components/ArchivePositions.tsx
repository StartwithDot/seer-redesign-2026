import { useState } from 'react';
import { formatTokenAmount, redemptionGuard } from '../data/redemption';
import { useRedeemPositions } from '../hooks/useRedeemPositions';
import { useOpportunityWallet } from '../hooks/WalletContext';
import { RedeemDrawer } from './RedeemDrawer';
import { useUrlDialog } from '../hooks/useUrlDialog';

export function ArchivePositions({ marketId }: { marketId: string }) {
  const wallet = useOpportunityWallet();
  const data = useRedeemPositions(marketId);
  const [redeemId, setRedeemId] = useUrlDialog('redeem');
  const selected = redeemId !== null && /^\d+$/.test(redeemId) ? Number(redeemId) : null;
  const [all, setAll] = useState(false);
  const rows = data.positions.filter(p => all || p.numerator > 0n || (p.balance ?? 0n) > 0n || p.error);
  const confirmed = wallet.receipts.filter(r => r.account.toLowerCase() === wallet.address?.toLowerCase() &&
    data.positions.some(p => r.label === `Redeem ${p.title}`));
  return <section className="archive-positions" aria-label="Wallet holdings and payouts">
    <p className="section-kicker">Your wallet</p><h3>Holdings and payouts</h3>
    {wallet.status !== 'connected' ? <p role="status">{wallet.status === 'wrong-network' ? 'Switch to Gnosis Chain to read holdings.' : 'Connect a wallet from the header to read holdings.'}</p> : <>
      <p>{wallet.shortAddress} · Gnosis Chain</p>
      {data.status === 'loading' && <p role="status">Reading positions from Gnosis Chain…</p>}
      {data.error && <p role="alert">{data.error}</p>}
      <div className="gallery-controls">
        <button type="button" disabled={data.status === 'loading'} title="Wait for the on-chain holdings read." onClick={() => void data.refresh()}>{data.status === 'loading' ? 'Reading…' : 'Refresh holdings'}</button>
        <button type="button" aria-pressed={all} onClick={() => setAll(v => !v)}>{all ? 'Show winners and holdings' : 'Show all outcomes'}</button>
      </div>
      <div className="archive-position-list">{rows.map(p => <article key={p.index}>
        <div><strong>{p.title}</strong><span>{p.error ? 'Read unavailable' : p.numerator > 0n ? 'Winning outcome' : 'No payout'}</span></div>
        <dl><div><dt>Shares</dt><dd>{p.balance === null ? 'Unavailable' : formatTokenAmount(p.balance)}</dd></div>
          <div><dt>Payout</dt><dd>{p.payout === null ? 'Unavailable' : `${formatTokenAmount(p.payout)} sDAI`}</dd></div></dl>
        <button type="button" disabled={Boolean(redemptionGuard(p))} title={redemptionGuard(p) ?? 'Review and redeem this position'} onClick={() => setRedeemId(String(p.index))}>Redeem</button>
        {p.error && <p>{p.error}</p>}
      </article>)}</div>
      {data.status === 'ready' && <p role="status">{data.positions.some(p => p.error) ? 'Some outcome reads failed. Refresh to retry.' : 'Holdings read on-chain.'} Zero shares do not establish prior redemption.</p>}
      {confirmed.length > 0 && <div className="gallery-links" aria-label="Redemptions confirmed this session">{confirmed.map(r =>
        <a key={r.hash} href={`https://gnosisscan.io/tx/${r.hash}`} target="_blank" rel="noreferrer">{r.label} · Confirmed ↗</a>)}</div>}
    </>}
    {selected !== null && <RedeemDrawer marketId={marketId} initialIndex={selected} onClose={() => { setRedeemId(null); void data.refresh(); }} />}
  </section>;
}
