import type { LeaderboardWallet } from './types';
export const signedLog = (value: number) => Math.sign(value) * Math.log10(1 + Math.abs(value));
export function walletLayout(wallets: LeaderboardWallet[]) {
    const minimum = Math.min(-1, ...wallets.map(w => signedLog(w.profitLoss)));
    const maximum = Math.max(1, ...wallets.map(w => signedLog(w.profitLoss)));
    const volumeMax = Math.max(1, ...wallets.map(w => Math.log10(1 + w.volume)));
    const placed: {
        x: number;
        y: number;
        radius: number;
    }[] = [];
    return wallets.map(wallet => {
        const x = 90 + Math.log10(1 + wallet.volume) / volumeMax * 710;
        const y = 310 - (signedLog(wallet.profitLoss) - minimum) / (maximum - minimum) * 260;
        const radius = 5 + Math.sqrt(wallet.markets / Math.max(1, ...wallets.map(w => w.markets))) * 7;
        let dx = 0, dy = 0;
        for (let attempt = 0; attempt < 4000; attempt++) {
            if (!placed.some(p => Math.hypot(p.x - x - dx, p.y - y - dy) < p.radius + radius + 4))
                break;
            const angle = attempt * 2.4;
            dx = Math.cos(angle) * Math.sqrt(attempt + 1) * 5;
            dy = Math.sin(angle) * Math.sqrt(attempt + 1) * 5;
        }
        placed.push({ x: x + dx, y: y + dy, radius });
        return { wallet, x, y, dx, dy, radius };
    });
}
export function concentration(wallets: LeaderboardWallet[], positive: boolean) {
    const sorted = wallets.filter(w => positive ? w.profitLoss > 0 : w.profitLoss < 0).sort((a, b) => Math.abs(b.profitLoss) - Math.abs(a.profitLoss));
    const total = sorted.reduce((sum, w) => sum + Math.abs(w.profitLoss), 0);
    return { total, count: sorted.length, topShare: total ? sorted.slice(0, positive ? 3 : 2).reduce((sum, w) => sum + Math.abs(w.profitLoss), 0) / total : 0 };
}
