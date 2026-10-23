import { useState } from 'react';
import type { MarketRecord } from '../data/types';

interface MarketTickerProps {
  markets: MarketRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function MarketTicker({ markets, selectedId, onSelect }: MarketTickerProps) {
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const tickerMarkets = markets;

  return (
    <section
      className={`market-ticker ${paused || hovered || focused ? 'is-paused' : ''}`}
      aria-label="Market ticker"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <button
        type="button"
        className="ticker-pause"
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? 'Play ticker' : 'Pause ticker'}
      </button>
      <div className="ticker-track">
        {[...tickerMarkets, ...tickerMarkets].map((market, index) => (
          <button
            key={`${market.id}-${index}`}
            type="button"
            className={market.id === selectedId ? 'is-selected' : ''}
            tabIndex={index >= tickerMarkets.length ? -1 : 0}
            aria-hidden={index >= tickerMarkets.length}
            onClick={() => onSelect(market.id)}
          >
            <span>{market.title}</span>
            <small>{market.signal ? `${market.signal.totalOddsPercent.toFixed(1)}% total odds` : 'No live pool'}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
