import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import type { Market } from '../types';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { MarketVisual } from './MarketVisual';
import { getLeadTradeOutcome, outcomeDisplayValue } from '../lib/marketOutcomes';

export function ExplorerStage({ markets, onOpen }: { markets: Market[]; onOpen: (market: Market) => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const visible = useRef(true);
  const manualPause = useRef(false);
  manualPause.current = paused;
  useEffect(() => { animation.current?.paused(paused || !visible.current || document.hidden); }, [paused]);
  const trending = useMemo(() => [...markets].sort((a, b) => (Number.isFinite(b.volume) ? b.volume : -1) - (Number.isFinite(a.volume) ? a.volume : -1)).slice(0, 6), [markets]);
  useEffect(() => {
    const element = root.current;
    if (!element || reduced) return;
    let cleanup: (() => void) | undefined;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ repeat: -1, defaults: { ease: 'power3.inOut' } });
      timeline.fromTo('.stage-pulse', { strokeDashoffset: 520 }, { strokeDashoffset: 0, duration: 3, stagger: .13 }, 0);
      timeline.to('.stage-steps span', { opacity: 1, color: 'var(--violet-ink)', duration: .7, stagger: 1.1 }, 0);
      timeline.to('.stage-steps span', { opacity: .55, color: 'var(--secondary)', duration: .5 }, 4.2);
      animation.current = timeline;
      const sync = () => { timeline.paused(manualPause.current || !visible.current || document.hidden); element.classList.toggle('is-offscreen', !visible.current || document.hidden); };
      sync();
      const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; sync(); });
      observer.observe(element);
      const visibility = sync;
      document.addEventListener('visibilitychange', visibility);
      cleanup = () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
    }, element);
    return () => { cleanup?.(); context.revert(); animation.current = null; };
  }, [reduced]);
  return <section ref={root} className={`explorer-stage ${paused ? 'is-paused' : ''}`} aria-label="Explore the Seer market universe" data-align="container">
    <div className="stage-explainer">
      <div className="stage-heading"><span className="eyebrow">Seer App / The market index</span><h1>One question.<br /><span>Many perspectives.</span></h1></div>
      <span className="stage-example-label">Example outcome prices</span>
      <svg className="stage-fan" viewBox="0 0 600 200" fill="none" aria-hidden="true">
        {[27, 62, 97, 132, 167].map((y, index) => <g key={y}><path className="stage-wire" d={`M0 97 H120 C220 97 245 ${y} 360 ${y} H570`} /><path className="stage-pulse" d={`M0 97 H120 C220 97 245 ${y} 360 ${y} H570`} /><rect x="385" y={y-12} width="114" height="24" rx="5" /><text x="398" y={y+4}>{['Binary', 'Scalar', 'Multi-outcome', 'Futarchy', 'Deep'][index]}</text><text className="fan-price" x="516" y={y+4}>{['63%', '186', '26%', '57%', '0.42'][index]}</text></g>)}
        <circle cx="120" cy="97" r="4" />
      </svg>
      <div className="stage-mobile-types" aria-hidden="true">{["Binary", "Scalar", "Multi-outcome", "Futarchy", "Deep"].map((label) => <span key={label}>{label}</span>)}</div>
      <div className="stage-steps"><span>Asked by</span><i /><span>Priced</span><i /><span>How to read</span><small>People &amp; agents ask. Read without trading.</small></div>
    </div>
    <div className="stage-trending">
      <div className="stage-trending-heading"><span><i /> In focus</span><button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)} aria-label={paused ? 'Play stage animation' : 'Pause stage animation'}>{paused ? 'Play' : 'Pause'} <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button></div>
      <div className="marquee-window"><div className="market-marquee" style={reduced ? { animation: 'none' } : undefined}>{[0, 1].map((copy) => <div className="marquee-group" key={copy} aria-hidden={copy === 1 || undefined} inert={copy === 1}>{trending.map((market, index) => <button tabIndex={copy === 1 ? -1 : 0} className={`marquee-market depth-${index % 3}`} type="button" key={market.id} onClick={() => onOpen(market)}><MarketVisual market={market} compact /><span className="marquee-price">{outcomeDisplayValue(market, getLeadTradeOutcome(market) ?? market.outcomes[0])}</span><strong>{market.question}</strong></button>)}</div>)}</div></div>
      <p>Different questions. One open record. <span>Explore below ↓</span></p>
    </div>
  </section>;
}
