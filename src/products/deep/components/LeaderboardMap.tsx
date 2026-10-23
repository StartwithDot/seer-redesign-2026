import { useId, useState } from 'react';
import { signedLog, walletLayout } from '../data/wallet-analysis';
import type { LeaderboardWallet } from '../data/types';
export function LeaderboardMap({ wallets, selected, onSelect, onHover }: {
    wallets: LeaderboardWallet[];
    selected: LeaderboardWallet;
    onSelect: (wallet: LeaderboardWallet) => void;
    onHover?: (wallet: LeaderboardWallet | null) => void;
}) {
    const id = useId();
    const [hovered, setHovered] = useState<LeaderboardWallet | null>(null);
    const points = walletLayout(wallets);
    const low = Math.min(-1, ...wallets.map(w => signedLog(w.profitLoss)));
    const high = Math.max(1, ...wallets.map(w => signedLog(w.profitLoss)));
    const maxVolume = Math.max(1, ...wallets.map(w => w.volume));
    const labels = new Set([...wallets.filter(w => w.profitLoss > 0).sort((a, b) => b.profitLoss - a.profitLoss).slice(0, 3), ...wallets.filter(w => w.profitLoss < 0).sort((a, b) => a.profitLoss - b.profitLoss).slice(0, 2)].map(w => w.address));
    const labelSlots: number[] = [];
    const labelY = new Map<string, number>();
    points.filter(p => labels.has(p.wallet.address)).sort((a, b) => a.y - b.y).forEach(p => {
        let y = p.y + p.dy - 15;
        while (labelSlots.some(slot => Math.abs(slot - y) < 18))
            y += 18;
        labelSlots.push(y);
        labelY.set(p.wallet.address, y);
    });
    const active = hovered ?? selected;
    return <figure className="deep-leaderboard-map">
    <svg viewBox="0 0 900 390" role="group" aria-labelledby={id}>
      <title id={id}>Profit / loss against trading volume</title>
      {[0, 1, 2, 3, 4].map(i => { const value = low + (high - low) * i / 4; const y = 310 - i * 65; return <g key={i}><line className="deep-map__grid" x1="90" x2="800" y1={y} y2={y}/><text x="80" y={y + 4} textAnchor="end">{(Math.sign(value) * (10 ** Math.abs(value) - 1)).toFixed(0)}</text><text x={90 + i * 177.5} y="335" textAnchor="middle">{(10 ** (Math.log10(1 + maxVolume) * i / 4) - 1).toFixed(0)}</text></g>; })}
      <text x="90" y="24">P/L (USD, signed log)</text><text x="800" y="369" textAnchor="end">Volume (USD, log)</text>
      {points.map(({ wallet: w, x, y, dx, dy, radius }) => <g key={w.address}>
        {(dx !== 0 || dy !== 0) && <line className="deep-map__grid" x1={x} y1={y} x2={x + dx} y2={y + dy}/>}
        <g className={`deep-map__wallet ${active.address === w.address ? 'is-selected' : ''}`} transform={`translate(${x + dx} ${y + dy})`} role="button" tabIndex={0} aria-pressed={selected.address === w.address} aria-label={`Rank ${w.rank}, ${w.ensName ?? w.address}, P/L ${w.profitLoss} USD, volume ${w.volume} USD`} onMouseEnter={() => { setHovered(w); onHover?.(w); }} onMouseLeave={() => { setHovered(null); onHover?.(null); }} onFocus={() => { setHovered(w); onHover?.(w); }} onBlur={() => { setHovered(null); onHover?.(null); }} onClick={() => onSelect(w)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(w);
        } }}>
          <title>{w.address}: {w.profitLoss.toFixed(2)} USD P/L · {w.volume.toFixed(2)} USD volume · {w.roi == null ? 'Unavailable' : `${(w.roi * 100).toFixed(1)}%`} ROI</title>
          <circle r={radius}/>{w.mergedWallets > 1 && <circle r={radius + 4} style={{ fill: 'none', strokeDasharray: '3 2' }}/>}
          {labels.has(w.address) && <text textAnchor={x > 650 ? 'end' : 'start'} x={x > 650 ? -radius - 8 : radius + 8} y={(labelY.get(w.address) ?? y) - y - dy}>{w.ensName ?? `#${w.rank}`}</text>}
        </g>
      </g>)}
    </svg>
    <figcaption><span>Size: markets · Dashed ring: merged wallets · Displaced dots connect to exact values</span><span aria-live="polite">#{active.rank} {active.ensName ?? active.address} · P/L ${active.profitLoss.toFixed(2)} · Volume ${active.volume.toFixed(2)} · ROI {active.roi == null ? 'Unavailable' : `${(active.roi * 100).toFixed(1)}%`}</span></figcaption>
  </figure>;
}
