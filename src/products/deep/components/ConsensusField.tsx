import { useEffect } from 'react';
import type { Repository } from '../data/types';
import { setDeepQueryParam, useDeepPath } from '../state/router';
import { SwarmField } from './SwarmField';
import { ExpandedTimeFigureDialog, TimeFigureChart } from './TimeFigureChart';
import { StateNotice } from './StateNotice';

type FieldMode = 'split' | 'swarm';

export function ConsensusField({
  repositories,
  selected,
  isolated,
  onSelect,
  onIsolate,
}: {
  repositories: Repository[];
  selected: Repository;
  isolated: Repository;
  onSelect: (repository: Repository) => void;
  onIsolate: (repository: Repository) => void;
}) {
  const path = useDeepPath();
  const params = new URL(path, window.location.origin).searchParams;
  const mode: FieldMode = params.get('view') === 'swarm' ? 'swarm' : 'split';
  const expanded = params.get('dialog') === 'chart';
  const setMode = (value: FieldMode) => setDeepQueryParam('view', value, 'push');
  const setExpanded = (value: boolean) => setDeepQueryParam('dialog', value ? 'chart' : '', 'push');

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'f' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;
      if (document.querySelector('[aria-modal="true"]')) return;
      event.preventDefault();
      setExpanded(true);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <figure className="deep-field">
      <div className="deep-field__heading">
        <div>
          <p className="deep-eyebrow">Consensus field · {repositories.length} outcome{repositories.length === 1 ? '' : 's'}</p>
          <h2>{mode === 'split' ? 'How has the market moved?' : 'Where does the market disagree?'}</h2>
        </div>
        <div className="deep-segmented" role="group" aria-label="Consensus field lens">
          <button type="button" aria-pressed={mode === 'split'} disabled={mode === 'split'} title={mode === 'split' ? 'Current field view' : 'Read price history'} onClick={() => setMode('split')}>Split</button>
          <button type="button" aria-pressed={mode === 'swarm'} disabled={mode === 'swarm'} title={mode === 'swarm' ? 'Current field view' : 'Compare repository prices'} onClick={() => setMode('swarm')}>Swarm</button>
        </div>
      </div>
      <div className="deep-field__instrument" key={mode}>
        {!repositories.length ? (
          <StateNotice tone="empty" title="No outcomes match this search" message="Clear the repository search to see the field again.">
            <button className="deep-button" type="button" onClick={() => setDeepQueryParam('q', '')}>Clear search</button>
          </StateNotice>
        ) : mode === 'split' ? (
          <TimeFigureChart
            repositories={repositories}
            selected={selected}
            isolated={isolated}
            onSelect={onSelect}
            onIsolate={onIsolate}
            onExpand={() => setExpanded(true)}
          />
        ) : (
          <SwarmField
            repositories={repositories}
            selected={selected}
            isolated={isolated}
            onSelect={onSelect}
            onIsolate={onIsolate}
            onReturnToChart={() => setMode('split')}
          />
        )}
      </div>
      <figcaption>{repositories.length} outcomes · Hover or focus to isolate</figcaption>
      <ExpandedTimeFigureDialog
        open={expanded && repositories.length > 0}
        onClose={() => setExpanded(false)}
        repositories={repositories}
        selected={selected}
        isolated={isolated}
        onSelect={onSelect}
        onIsolate={onIsolate}
      />
    </figure>
  );
}
