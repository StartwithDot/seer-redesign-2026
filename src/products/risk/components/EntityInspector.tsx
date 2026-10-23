import { useEffect, useState } from 'react';
import type { MarketEntity } from '../data/entities';
import { ArrowUpRight } from './Icons';

export function EntityInspector({ entities, onCopy }: { entities: MarketEntity[]; onCopy: (value: string, label: string) => Promise<void> }) {
  const [selected, setSelected] = useState<MarketEntity | null>(() => {
    const id = new URLSearchParams(window.location.search).get('entity');
    return entities.find(entity => entity.value === id) ?? null;
  });
  useEffect(() => {
    const sync = () => {
      const id = new URLSearchParams(window.location.search).get('entity');
      setSelected(entities.find(entity => entity.value === id) ?? null);
    };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [entities]);
  const inspect = (entity: MarketEntity) => {
    setSelected(entity);
    const url = new URL(window.location.href);
    url.searchParams.set('entity', entity.value);
    window.history.replaceState(window.history.state, '', url);
  };
  return <div className="risk-entity-inspector">
    <div className="risk-entity-list">{entities.map(entity => <div className="risk-entity-row" key={entity.label}>
      <span>{entity.label}</span>
      <button className="risk-inline-button" type="button" aria-pressed={selected?.label === entity.label} onClick={() => inspect(entity)} title={entity.value}>{entity.value.slice(0, 10)}…{entity.value.slice(-6)}</button>
      <button className="risk-inline-button" type="button" aria-label={`Copy ${entity.label}`} onClick={() => void onCopy(entity.value, entity.label)}>Copy</button>
    </div>)}</div>
    {selected && <section className="risk-entity-detail" aria-label={`${selected.label} details`}>
      <h4>{selected.label}</h4>
      <label>Full identifier<input readOnly value={selected.value} onFocus={event => event.target.select()} /></label>
      <div className="risk-provenance-links">
        <button className="risk-inline-button" type="button" onClick={() => void onCopy(selected.value, selected.label)}>Copy identifier</button>
        <button className="risk-inline-button" type="button" onClick={() => void onCopy(window.location.href, 'Entity link')}>Copy entity link</button>
        <a className="risk-inline-button" href={selected.href} target="_blank" rel="noreferrer">{selected.explorerLabel ?? 'Open on Gnosisscan'} <ArrowUpRight /></a>
      </div>
      <label>Shareable entity link<input readOnly value={window.location.href} onFocus={event => event.target.select()} /></label>
    </section>}
  </div>;
}
