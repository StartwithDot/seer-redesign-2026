import { useEffect, useMemo, useRef, useState } from 'react';
import type { Market } from '../types';
import { formatCompactMoney, formatPercent } from '../lib/format';
import { getLeadTradeOutcome, outcomeDisplayValue } from '../lib/marketOutcomes';
import { isScalarMarket, scalarValue } from '../lib/marketKind';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface TrendingStripProps {
  markets: Market[];
  onOpen: (market: Market) => void;
  onQuickBuy: (market: Market, outcomeId?: string) => void;
}

export function TrendingStrip({ markets, onOpen, onQuickBuy }: TrendingStripProps) {
  const trending = useMemo(() => [...markets].sort((a, b) => b.volume - a.volume).slice(0, 4), [markets]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const reduced = useReducedMotion();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trending.length || paused || manual || reduced) return;
    timerRef.current = window.setInterval(() => {
      setActive((current) => (current + 1) % trending.length);
    }, 6500);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused, manual, reduced, trending.length]);

  if (!trending.length) return null;
  const current = Math.min(active, trending.length - 1);
  const market = trending[current];
  const lead = getLeadTradeOutcome(market) ?? market.outcomes[0];
  const scalar = isScalarMarket(market);

  return (
    <section
      className="trending-strip"
      aria-label="Trending markets"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div className="trending-label">
        <span className="eyebrow">Trending now</span>
      </div>
      <div className="trending-copy">
        <button type="button" onClick={() => onOpen(market)} title={market.question}>
          {market.question}
        </button>
        <span>{formatCompactMoney(market.volume)} volume · {scalar ? `${scalarValue(market)?.toFixed(2) ?? 'Unavailable'} ${market.unit}` : outcomeDisplayValue(market, lead)} {scalar ? 'estimate' : lead.name}</span>
      </div>
      <button className="primary-button trending-buy" type="button" onClick={() => onQuickBuy(market, lead?.id)}>
        Buy {lead?.name} <span aria-hidden="true">→</span>
      </button>
      <div className="trending-dots" role="group" aria-label="Select trending market">
        {trending.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={index === current}
            aria-label={`Show ${item.subject} trend`}
            onClick={() => { setManual(true); setActive(index); }}
            onKeyDown={(event) => {
              if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
              event.preventDefault(); setManual(true);
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? trending.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + trending.length) % trending.length;
              setActive(next);
              (event.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();
            }}
          />
        ))}
      </div>
    </section>
  );
}
