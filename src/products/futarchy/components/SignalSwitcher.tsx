import { useEffect, useRef, useState } from 'react';
import type { Market } from '../data/types';
import { signedPercent } from '../data/format';
import { MarketAvatar } from './MarketAvatar';
import { useSignalRotation } from '../hooks/useSignalRotation';

interface SignalSwitcherProps {
  markets: Market[];
  selectedId: string;
  tourActive: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}

const verdictLabel = {
  include: 'Include',
  neutral: 'Neutral',
  exclude: 'Exclude',
} as const;

function MiniSpark({ market }: { market: Market }) {
  if (!market.history.length) return <span className="mini-spark" aria-label="No stored price history" />;
  const yesValues = market.history.map((point) => point.yes);
  const noValues = market.history.map((point) => point.no);
  const values = [...yesValues, ...noValues];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pathFor = (series: number[]) => series.map((value, index) => `${(index / Math.max(1, series.length - 1)) * 72},${25 - ((value - min) / span) * 19}`).join(' L');
  return (
    <svg className="mini-spark" viewBox="0 0 72 28" aria-hidden="true">
      <path className="mini-spark-yes" d={`M${pathFor(yesValues)}`} />
      <path className="mini-spark-no" d={`M${pathFor(noValues)}`} />
      <circle cx="72" cy={25 - ((yesValues.at(-1)! - min) / span) * 19} r="2.5" />
      <circle className="mini-spark-no-dot" cx="72" cy={25 - ((noValues.at(-1)! - min) / span) * 19} r="2.5" />
    </svg>
  );
}

export function SignalSwitcher({ markets, selectedId, tourActive, onSelect, onOpen }: SignalSwitcherProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const selectedIndex = Math.max(0, markets.findIndex((market) => market.id === selectedId));
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const rowRefs = useRef(new Map<string, HTMLButtonElement>());
  const firstRender = useRef(true);

  const selectByIndex = (index: number) => { if (markets.length) onSelect(markets[(index + markets.length) % markets.length].id); };
  const paused = hovered || focused || tourActive;
  useSignalRotation({ count: markets.length, selectedIndex, paused, onSelect: selectByIndex });

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    tabRefs.current.get(selectedId)?.scrollIntoView({ block: 'nearest', inline: 'center' });
    rowRefs.current.get(selectedId)?.scrollIntoView({ block: 'nearest' });
  }, [selectedId]);

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectByIndex(index + 1);
      tabRefs.current.get(markets[(index + 1) % markets.length].id)?.focus();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const next = (index - 1 + markets.length) % markets.length;
      selectByIndex(next);
      tabRefs.current.get(markets[next].id)?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectByIndex(0);
      tabRefs.current.get(markets[0].id)?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      selectByIndex(markets.length - 1);
      tabRefs.current.get(markets.at(-1)!.id)?.focus();
    }
  };

  return (
    <section
      className="signal-switcher"
      aria-labelledby="signal-switcher-title"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        setFocused(true);
      }}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        setFocused(false);
      }}
    >
      <header className="switcher-header">
        <div>
          <span className="eyebrow">SIGNAL BOARD</span>
          <h2 id="signal-switcher-title">{markets.length} active signals</h2>
        </div>
        <div className="switcher-controls">
          <button type="button" onClick={() => selectByIndex(selectedIndex - 1)} disabled={markets.length < 2} title={markets.length < 2 ? 'No other signals available' : undefined} aria-label="Previous signal">←</button>
          <button type="button" onClick={() => selectByIndex(selectedIndex + 1)} disabled={markets.length < 2} title={markets.length < 2 ? 'No other signals available' : undefined} aria-label="Next signal">→</button>
        </div>
      </header>
      <div className="signal-tabs" role="tablist" aria-label="Active milestone signals">
        {markets.map((market, index) => (
          <button
            key={market.id}
            ref={(node) => {
              if (node) tabRefs.current.set(market.id, node);
              else tabRefs.current.delete(market.id);
            }}
            type="button"
            role="tab"
            id={`signal-tab-${market.id}`}
            aria-controls="signal-list-panel"
            aria-selected={market.id === selectedId}
            tabIndex={market.id === selectedId ? 0 : -1}
            onClick={() => onSelect(market.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
          >
            <span>{market.proposal}</span>
            <i>{signedPercent(market.impact)}</i>
          </button>
        ))}
      </div>
      <div className="signal-rows" id="signal-list-panel" role="tabpanel" aria-labelledby={`signal-tab-${selectedId}`}>
        {markets.map((market) => (
          <div key={market.id} className={`signal-row${market.id === selectedId ? ' is-selected' : ''}`}>
            <button
              ref={(node) => {
                if (node) rowRefs.current.set(market.id, node);
                else rowRefs.current.delete(market.id);
              }}
              type="button"
              className="signal-row-main"
              aria-current={market.id === selectedId ? 'true' : undefined}
              onClick={() => onSelect(market.id)}
              onDoubleClick={() => onOpen(market.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  onOpen(market.id);
                }
              }}
            >
              <MarketAvatar market={market} />
              <span className="signal-row-copy">
                <strong>{market.proposal}</strong>
                <small>{market.condition}</small>
              </span>
              <MiniSpark market={market} />
              <span className={`verdict verdict-${market.verdict}`}>{verdictLabel[market.verdict]}</span>
              <strong className={`signal-impact ${market.impact >= 0 ? 'positive' : 'negative'}`}>{signedPercent(market.impact)}</strong>
            </button>
            <button className="signal-open" type="button" onClick={() => onOpen(market.id)}>Open</button>
          </div>
        ))}
      </div>
      <div className="signal-progress" aria-hidden="true">
        <span key={selectedId} style={{ animationPlayState: paused || tourActive ? 'paused' : 'running' }} />
      </div>
    </section>
  );
}
