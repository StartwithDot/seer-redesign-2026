import type { PredictionRecord } from '../data/predictions';
import { compactNumber, displayProbability, signedPercent, weeklyChange } from '../data/deep-view';
import type { MarketHolding } from '../data/trading';
import type { Repository } from '../data/types';
import { navigateDeep } from '../state/router';
import { OutcomeAvatar } from './OutcomeAvatar';

export function OutcomeRow({
  repository,
  rank,
  selected,
  prediction,
  holding,
  starred,
  top,
  rowIndex,
  onSelect,
  onIsolate,
  onRestore,
  onToggleStar,
  onFocusRelative,
}: {
  repository: Repository;
  rank: number;
  selected: boolean;
  prediction?: PredictionRecord;
  holding?: MarketHolding;
  starred: boolean;
  top: number;
  rowIndex: number;
  onSelect: (repository: Repository) => void;
  onIsolate: (repository: Repository) => void;
  onRestore: () => void;
  onToggleStar: (repository: Repository) => void;
  onFocusRelative: (index: number, delta: number) => void;
}) {
  const change = weeklyChange(repository);
  const held = holding && ((Number.isFinite(holding.up) && holding.up > 0) || (Number.isFinite(holding.down) && holding.down > 0));
  return (
    <div
      className={`deep-v4-row ${selected ? 'is-selected' : ''}`}
      role="row"
      aria-rowindex={rowIndex + 2}
      style={{ transform: `translateY(${top}px)` }}
      onPointerEnter={() => onIsolate(repository)}
      onPointerLeave={onRestore}
    >
      <button
        type="button"
        id={`deep-v4-outcome-${repository.marketId}`}
        className="deep-v4-row__main"
        aria-pressed={selected}
        title="Select outcome. Alt+Enter or double-click opens repository details."
        onClick={() => onSelect(repository)}
        onDoubleClick={() => navigateDeep(`/deep/repo/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}`)}
        onFocus={() => onIsolate(repository)}
        onBlur={onRestore}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && event.altKey) {
            event.preventDefault();
            navigateDeep(`/deep/repo/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}`);
          }
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            onFocusRelative(rowIndex, event.key === 'ArrowDown' ? 1 : -1);
          }
        }}
      >
        <span className="deep-v4-cell is-rank" role="cell">{rank}</span>
        <span className="deep-v4-cell is-outcome" role="cell">
          <OutcomeAvatar repository={repository} size="sm" />
          <span><strong>{repository.owner}/{repository.name}</strong><small>{repository.group}{held ? ' · Position' : ''}</small></span>
        </span>
        <span className="deep-v4-cell is-probability" role="cell">
          <strong>{displayProbability(repository.upPrice)}</strong>
          <i><b style={{ width: `${repository.upPrice * 100}%` }} /></i>
        </span>
        <span className={`deep-v4-cell is-change ${change >= 0 ? 'is-positive' : 'is-negative'}`} role="cell" aria-label={`1 week change ${signedPercent(change).replace("%", "")} percentage points`}><small className="deep-v4-mobile-label">1W </small>{signedPercent(change).replace("%", " pp")}</span>
        <span className="deep-v4-cell is-volume" role="cell" title={`${repository.volumeToken.amount} ${repository.volumeToken.unit}`}>
          {compactNumber(repository.volumeToken.amount)} <small>{repository.volumeToken.unit}</small>
        </span>
        <span className="deep-v4-cell is-traders" role="cell" aria-label="Traders not reported" title="Distinct trader count is not included in the saved Deep API response">N/R</span>
        <span className="deep-v4-cell is-agents" role="cell" title="Participant type is not reported by the saved Deep API">
          
          <small>{prediction ? `Forecast ${displayProbability(prediction.up)}` : 'Not reported'}</small>
        </span>
      </button>
      <button
        type="button"
        className="deep-v4-row__star"
        aria-label={`${starred ? 'Remove' : 'Add'} ${repository.owner}/${repository.name} ${starred ? 'from' : 'to'} watchlist`}
        aria-pressed={starred}
        onClick={() => onToggleStar(repository)}
      >
        <span aria-hidden="true">{starred ? '★' : '☆'}</span>
      </button>
    </div>
  );
}
