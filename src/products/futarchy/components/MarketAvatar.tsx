import type { Market } from '../data/types';

const tokenPalette: Record<Market['token'], [string, string]> = {
  ETH: ['#6c47ff', '#b8a6ff'],
  GNO: ['#247a67', '#81c9b5'],
  PNK: ['#9b4f2f', '#e7a37e'],
  AAVE: ['#87549c', '#c7a0d8'],
};

export function MarketAvatar({ market, large = false }: { market: Market; large?: boolean }) {
  const [start, end] = tokenPalette[market.token];
  return (
    <span
      className={`market-avatar${large ? ' is-large' : ''}`}
      style={{ '--avatar-start': start, '--avatar-end': end } as React.CSSProperties}
      aria-hidden="true"
    >
      <span>{market.token.slice(0, 2)}</span>
      <svg viewBox="0 0 48 48">
        <path d="M5 25h15c8 0 11-7 18-13" />
        <path d="M20 25c8 0 11 0 18 0" />
        <path d="M20 25c8 0 11 7 18 13" />
      </svg>
    </span>
  );
}
