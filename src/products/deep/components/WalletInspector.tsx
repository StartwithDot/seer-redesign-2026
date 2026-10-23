import { useState } from 'react';
import { readPreference, writePreference } from '../data/local-preferences';
import { walletsForPeriod } from '../data/leaderboard-periods';
import type { LeaderboardWallet } from '../data/types';
import { Dialog } from './Dialog';
import { WalletIdentity } from './LeaderboardTable';
export function WalletInspector({ wallet, open, onClose, onSelect }: {
    wallet: LeaderboardWallet;
    open: boolean;
    onClose: () => void;
    onSelect: (wallet: LeaderboardWallet) => void;
}) {
    const [following, setFollowing] = useState<string[]>(() => { const value = readPreference<unknown>('deep-following', []); return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []; });
    const [comparison, setComparison] = useState<string[]>([]);
    const [status, setStatus] = useState('');
    const all = [...new Map((['1d', '1w', '1m', 'all'] as const).flatMap(walletsForPeriod).map(item => [item.address, item])).values()];
    const toggle = () => { const next = following.includes(wallet.address) ? following.filter(a => a !== wallet.address) : [...following, wallet.address]; setFollowing(next); setStatus(writePreference('deep-following', next) ? 'Following list saved on this device.' : 'Following list kept for this session.'); };
    return <><div className="deep-following"><strong>Following ({following.length})</strong>{following.map(address => <button className="deep-button" key={address} disabled={!all.some(item => item.address === address)} title="Open the saved wallet ranking; unavailable wallets cannot be opened" onClick={() => { const w = all.find(w => w.address === address); if (w) onSelect(w); }}>{all.find(w => w.address === address)?.ensName ?? address.slice(0, 10)}</button>)}{!following.length && <span>Follow a wallet from its inspector.</span>}</div>
    <Dialog open={open} onClose={onClose} title="Wallet inspector" description="Bundled reference dataset. Missing periods are unavailable.">
      <WalletIdentity wallet={wallet}/><code className="deep-address">{wallet.address}</code>
      <dl className="deep-wallet-metrics">{[['Rank', `#${wallet.rank}`], ['Profit / loss', `$${wallet.profitLoss.toFixed(2)}`], ['Volume', `$${wallet.volume.toFixed(2)}`], ['ROI', `${wallet.roi == null ? 'Unavailable' : `${(wallet.roi * 100).toFixed(1)}%`}`], ['Markets', wallet.markets], ['Merged wallets', wallet.mergedWallets]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <p>Period ranks: {(['1d', '1w', '1m', 'all'] as const).map(p => `${p.toUpperCase()}: ${walletsForPeriod(p).find(w => w.address === wallet.address)?.rank ?? 'unavailable'}`).join(' · ')}</p>
      <a href={`https://optimistic.etherscan.io/address/${wallet.address}`} target="_blank" rel="noreferrer">View on Optimism ↗</a>
      {!!wallet.mergedWalletAddresses?.length && <details className="deep-merged-wallets"><summary>Merged wallet addresses ({wallet.mergedWalletAddresses.length})</summary>
        <ul>{wallet.mergedWalletAddresses.map(address => <li key={address}><a href={`https://optimistic.etherscan.io/address/${address}`} target="_blank" rel="noreferrer"><code>{address}</code> ↗</a></li>)}</ul>
      </details>}
      <div className="deep-profile__actions"><button className="deep-button" aria-pressed={following.includes(wallet.address)} onClick={toggle}>{following.includes(wallet.address) ? 'Unfollow' : 'Follow'}</button><button className="deep-button" disabled={comparison.includes(wallet.address) || comparison.length >= 3} title={comparison.includes(wallet.address) ? 'Wallet already compared' : comparison.length >= 3 ? 'Remove a wallet to compare another' : 'Compare this wallet'} onClick={() => setComparison([...comparison, wallet.address])}>Compare wallet ({comparison.length}/3)</button></div>
      <p role="status">{status}</p>
      {comparison.length > 0 && <div className="deep-comparison"><p>Compare all-time reference results</p>{comparison.map(a => { const w = all.find(w => w.address === a) ?? (wallet.address === a ? wallet : null); if (!w) return <button key={a} className="deep-button" onClick={() => setComparison(comparison.filter(v => v !== a))}>Remove unavailable wallet {a.slice(0, 10)}</button>; return <div key={a}><button className="deep-button" aria-label={`Remove ${w.ensName ?? a} from comparison`} onClick={() => setComparison(comparison.filter(v => v !== a))}>{w.ensName ?? a.slice(0, 10)} ×</button><p>P/L ${w.profitLoss.toFixed(2)} · Volume ${w.volume.toFixed(2)} · ROI {w.roi == null ? 'Unavailable' : `${(w.roi * 100).toFixed(1)}%`} · {w.markets} markets</p></div>; })}</div>}
    </Dialog></>;
}
