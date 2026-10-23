import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { MarketRecord } from '../data/types';

interface MarketRailProps {
  markets: MarketRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function MarketRail({ markets, selectedId, onSelect }: MarketRailProps) {
  const [status, setStatus] = useState(() => markets.find(market => market.id === selectedId)?.status === 'active' ? 'active' : 'all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const railRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => { if (!railRef.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      railRef.current?.querySelector('summary')?.focus();
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape); };
  }, [open]);
  const chooseMarket = (id: string) => {
    onSelect(id);
    setOpen(false);
    railRef.current?.querySelector('summary')?.focus();
  };
  const matches = (market: MarketRecord, value: string) => value === 'all' || (value === 'active' ? market.status === 'active' : ['resolved', 'finalized', 'redeemed'].includes(market.status));
  const visible = markets.filter(market => matches(market, status) && market.title.toLowerCase().includes(query.toLowerCase()));
  const selectedIndex = Math.max(0, visible.findIndex((market) => market.id === selectedId));
  const selectRelative = (offset: number) => {
    if (!visible.length) return;
    const nextIndex = (selectedIndex + offset + visible.length) % visible.length;
    onSelect(visible[nextIndex].id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('input,select')) return;
    if (!visible.length) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectRelative(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectRelative(-1);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      onSelect(visible[0].id);
    }
    if (event.key === 'End') {
      event.preventDefault();
      onSelect(visible[visible.length - 1].id);
    }
  };

  return (
    <details className="market-rail" ref={railRef} open={open} onToggle={event => setOpen(event.currentTarget.open)}>
      <summary className="market-rail-summary"><strong>Browse markets</strong><span>{markets.length} opportunities</span><span className="disclosure-mark" aria-hidden="true">+</span></summary>
      <div className="market-rail-content">
      <header className="market-rail-header">
        <div>
          <h2 id="market-rail-title">Choose an opportunity</h2>
        </div>
        <div className="market-rail-actions">
          <span>{markets.filter((market) => market.source === 'sample').length} labeled samples</span>
          <button type="button" onClick={() => selectRelative(-1)} aria-label="Previous market" disabled={visible.length < 2} title={visible.length < 2 ? 'At least two matching markets are needed.' : 'Previous matching market'}>←</button>
          <button type="button" onClick={() => selectRelative(1)} aria-label="Next market" disabled={visible.length < 2} title={visible.length < 2 ? 'At least two matching markets are needed.' : 'Next matching market'}>→</button>
        </div>
      </header>
      <div className="market-rail-filters">
        <div role="group" aria-label="Market status">{['active', 'completed', 'all'].map(value => <button type="button" key={value} aria-pressed={status === value} onClick={() => { setStatus(value); const first = markets.find(m => matches(m, value) && m.title.toLowerCase().includes(query.toLowerCase())); if (first && !matches(markets.find(m => m.id === selectedId) ?? first, value)) onSelect(first.id); }}>{value === 'active' ? 'Active' : value === 'completed' ? 'Completed' : 'All'} · {markets.filter(m => matches(m, value)).length}</button>)}</div>
        <label><span className="sr-only">Find a market</span><input value={query} placeholder="Find a market" onChange={event => {
          const nextQuery = event.target.value;
          setQuery(nextQuery);
          const matching = markets.filter(market => matches(market, status) && market.title.toLowerCase().includes(nextQuery.toLowerCase()));
          if (matching.length && !matching.some(market => market.id === selectedId)) onSelect(matching[0].id);
        }} /></label>
      </div>
      <label className="mobile-market-selector">
        <span>Selected market</span>
        <select value={visible.some(market => market.id === selectedId) ? selectedId : ''} onChange={event => chooseMarket(event.target.value)}>
          {!visible.some(market => market.id === selectedId) && <option value="" disabled>Choose a matching market</option>}
          {visible.map(market => <option key={market.id} value={market.id}>{market.title}{market.source === 'sample' ? ' · Sample' : ''}</option>)}
        </select>
      </label>
      <div className="market-rail-scroll" role="listbox" aria-label="Opportunity markets" tabIndex={0} onKeyDown={onKeyDown}>
        {visible.map((market) => (
          <button
            key={market.id}
            type="button"
            role="option"
            aria-selected={market.id === selectedId}
            className={`market-rail-item ${market.id === selectedId ? 'is-selected' : ''}`}
            onClick={() => chooseMarket(market.id)}
          >
            <span><strong>{market.title}</strong><small>{market.kind} · {market.status}</small></span>
            {market.source === 'sample' ? <i className="sample-badge">Sample</i> : <i className="verified-badge">Verified</i>}
          </button>
        ))}
      </div>
      {!visible.length && <div className="market-rail-empty" role="status">No matching markets. <button type="button" onClick={() => { setQuery(''); setStatus('all'); }}>Clear market filters</button></div>}
      </div>
    </details>
  );
}
