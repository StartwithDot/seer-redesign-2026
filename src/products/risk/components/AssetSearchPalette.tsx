import { useEffect, useMemo, useRef, useState } from 'react';
import { RISK_ASSETS } from '../data/assets';
import { formatGrade } from '../data/format';
import type { AssetRecord } from '../data/types';
import { GroupGlyph } from './GroupGlyph';
import { SearchIcon } from './Icons';
import { Modal } from './Modal';

interface AssetSearchPaletteProps {
  onClose: () => void;
  onOpen: (assetId: string) => void;
  open: boolean;
}

const matches = (asset: AssetRecord, query: string) =>
  `${asset.ticker} ${asset.name} ${asset.group} ${asset.category} ${asset.grade}`.toLowerCase().includes(query.toLowerCase());

export function AssetSearchPalette({ onClose, onOpen, open }: AssetSearchPaletteProps) {
  const [query, setQuery] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => RISK_ASSETS.filter((asset) => matches(asset, query)).slice(0, 8), [query]);

  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  const moveFocus = (direction: 1 | -1) => {
    const items = [...(listRef.current?.querySelectorAll<HTMLButtonElement>('button') || [])];
    if (!items.length) return;
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    items[index < 0 ? direction === 1 ? 0 : items.length - 1 : (index + direction + items.length) % items.length].focus();
  };

  return <Modal className="risk-search-palette" label="Search risk assets" onClose={onClose} open={open}>
    <label className="risk-search-input">
      <SearchIcon size={20} />
      <input
        aria-label="Search ticker, asset, group or grade"
        aria-controls="risk-search-results"
        autoComplete="off"
        data-autofocus
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') { event.preventDefault(); moveFocus(1); }
          if (event.key === 'ArrowUp') { event.preventDefault(); moveFocus(-1); }
        }}
        placeholder="Ticker, asset, group, grade"
        value={query}
      />
    </label>
    <div id="risk-search-results" className="risk-search-results" aria-label="Asset search results" ref={listRef} onKeyDown={event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); moveFocus(event.key === 'ArrowDown' ? 1 : -1); }
    }}>
      {!results.length && <div className="risk-search-empty" role="status"><strong>No asset match</strong><span>Try ticker, name, group, or grade.</span><button className="risk-text-button" type="button" onClick={() => setQuery('')}>Clear search</button></div>}
      {results.map((asset) => <button key={asset.id} type="button" onClick={() => { onOpen(asset.id); onClose(); }}>
        <GroupGlyph group={asset.group} />
        <span><strong>{asset.ticker}</strong><small>{asset.name}</small></span>
        <span><strong>{formatGrade(asset)}</strong><small>{asset.group}</small></span>
        <span><strong>{asset.category}</strong><small>Open dossier</small></span>
      </button>)}
    </div>
  </Modal>;
}
