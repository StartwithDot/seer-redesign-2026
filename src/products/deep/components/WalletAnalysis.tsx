import { concentration } from '../data/wallet-analysis';
import type { LeaderboardWallet } from '../data/types';
export function WalletAnalysis({ wallets }: {
    wallets: LeaderboardWallet[];
}) {
    const extent = Math.max(.01, ...wallets.map(w => Math.abs(w.roi ?? 0)));
    return <details className="deep-analysis"><summary>Distribution and concentration</summary>
    {[true, false].map(positive => { const c = concentration(wallets, positive); return <div key={String(positive)}><p>{positive ? 'Winners' : 'Losers'}: {c.count} wallets · ${c.total.toFixed(2)} absolute P/L</p><meter aria-label={`${positive ? 'Winner' : 'Loser'} concentration`} min={0} max={1} value={c.topShare}/><span> Top {positive ? 'three' : 'two'} account for {(c.topShare * 100).toFixed(1)}%</span></div>; })}
    <svg viewBox="0 0 700 90" role="img" aria-label="ROI distribution, each mark represents one wallet"><line x1="20" x2="680" y1="45" y2="45" stroke="currentColor"/>{wallets.filter((w): w is LeaderboardWallet & { roi: number } => w.roi != null).map(w => <line key={w.address} x1={350 + w.roi / extent * 320} x2={350 + w.roi / extent * 320} y1="30" y2="60" stroke="currentColor"><title>{w.address}: {(w.roi * 100).toFixed(1)}% ROI</title></line>)}<text x="20" y="85">−{(extent * 100).toFixed(1)}%</text><text x="350" y="85" textAnchor="middle">0% ROI</text><text x="680" y="85" textAnchor="end">+{(extent * 100).toFixed(1)}%</text></svg>
  </details>;
}
