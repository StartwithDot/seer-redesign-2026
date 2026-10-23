import { useId } from 'react';

export function WalletIdenticon({ address }: { address: string }) {
  const id = useId();
  let seed = 2166136261;
  for (const char of address.toLowerCase()) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619) >>> 0;
  const cells: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < 5; y++) for (let x = 0; x < 3; x++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    if (seed & 0x80000000) { cells.push({ x, y }); if (x < 2) cells.push({ x: 4 - x, y }); }
  }
  return <svg className="deep-wallet-identicon" viewBox="0 0 7 7" role="img" aria-labelledby={id}>
    <title id={id}>Wallet identicon</title>
    {cells.map(({ x, y }) => <rect key={`${x}:${y}`} x={x + 1} y={y + 1} width="1" height="1" fill="currentColor" />)}
  </svg>;
}
