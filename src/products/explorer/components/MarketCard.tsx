import { useEffect, useRef, useState } from 'react';
import type { Market } from '../types';
import { formatCompactMoney, formatCreator } from '../lib/format';
import { marketStateLabels } from '../lib/marketFilters';
import { MarketCardDrawer } from './MarketCardDrawer';
import { MarketVisual } from './MarketVisual';
import { VerificationMark } from './VerificationMark';
import { CardOutcomeInstrument } from './CardOutcomeInstrument';

interface Props {
  market: Market; featured?: boolean; saved: boolean; onOpen: (market: Market) => void;
  onQuickBuy: (market: Market, outcomeId?: string) => void; onToggleSaved: (market: Market) => void;
}
export function MarketCard({ market, featured = false, saved, onOpen, onQuickBuy, onToggleSaved }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const details = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | null>(null);
  const suppressFocusOpen = useRef(false);
  const cancelHover = () => {
    if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  const scheduleDrawer = () => {
    cancelHover();
    if (pinned) return;
    hoverTimer.current = window.setTimeout(() => setDrawerOpen(true), 320);
  };
  const close = () => { setDrawerOpen(false); setPinned(false); };
  useEffect(() => cancelHover, []);
  const outcomeCount = market.outcomes.filter((outcome) => outcome.id !== 'estimate').length;
  return <article
    className={`market-card ${featured ? 'is-featured' : ''} ${drawerOpen ? 'has-open-drawer' : ''}`}
    onPointerLeave={(event) => {
      cancelHover();
      if (event.pointerType !== 'touch' && !pinned) setDrawerOpen(false);
    }}
    onPointerDown={cancelHover}
    onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node) && !pinned) setDrawerOpen(false);
    }}
    onClick={(event) => {
    if ((event.target as Element).closest('button, a, [role="img"], [role="tooltip"], .explorer-dialog-layer')) return;
    onOpen(market);
  }}>
    <MarketVisual market={market} compact />
    <div className="market-card-body">
      <div className="market-card-meta"><span className="card-subject">{market.subject}</span><VerificationMark status={market.verification} />
        <button className={`save-button ${saved ? 'is-saved' : ''}`} type="button" aria-pressed={saved} data-tooltip={saved ? 'Remove from collection' : 'Save to collection'} aria-label={saved ? 'Remove from collection' : 'Save to collection'} onClick={() => onToggleSaved(market)}>{saved ? '★' : '☆'}</button></div>
      <div className="card-question">
        <h3><button type="button" title={market.question} onClick={() => onOpen(market)}>{market.question}</button></h3></div>
      <p className="creator-line" title={`Asked by ${formatCreator(market.creator, market.creatorAddress)} · ${market.creatorAddress}`}>Asked by <strong>{formatCreator(market.creator, market.creatorAddress)}</strong></p>
      <CardOutcomeInstrument market={market} onQuickBuy={onQuickBuy} onOpen={onOpen} />
      <div className="market-card-footer"><span>{formatCompactMoney(market.volume)} volume</span><span title={marketStateLabels[market.marketState]}>{market.status === 'open' ? 'Open' : market.status === 'resolved' ? 'Resolved' : 'Resolving'}</span>{outcomeCount > 2 && <span>+{outcomeCount - 2} outcomes</span>}</div>
      <div className="market-card-actions"><button ref={details} type="button" className="secondary-button" aria-expanded={drawerOpen} aria-haspopup="dialog" onPointerEnter={(event) => { if (event.pointerType !== 'touch') scheduleDrawer(); }} onFocus={() => { if (suppressFocusOpen.current) suppressFocusOpen.current = false; else scheduleDrawer(); }} onClick={() => { cancelHover(); if (pinned) close(); else { setPinned(true); setDrawerOpen(true); } }}>Details</button><button className="secondary-button" type="button" onClick={() => onOpen(market)}>Open record →</button></div>
    </div>
    <MarketCardDrawer market={market} open={drawerOpen} pinned={pinned} onClose={() => { close(); suppressFocusOpen.current = true; window.requestAnimationFrame(() => details.current?.focus()); }} onTogglePinned={() => setPinned((current) => !current)} onOpenRecord={onOpen} />
  </article>;
}
