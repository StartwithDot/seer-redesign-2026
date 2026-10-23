import type { ReviewCutStrategy } from '../data/reviewCut';

interface ReviewCutControlsProps {
  cutSize: number;
  strategy: ReviewCutStrategy;
  totalCount: number;
  shortlistCount: number;
  onCutSizeChange: (size: number) => void;
  onStrategyChange: (strategy: ReviewCutStrategy) => void;
  onOpenShortlist: () => void;
  onOpenCompare: () => void;
}

const strategies: Array<{ value: ReviewCutStrategy; label: string }> = [
  { value: 'rank', label: 'Rank' },
  { value: 'odds', label: 'Odds' },
  { value: 'tier', label: 'Tier' },
  { value: 'sponsor', label: 'Sponsor preference' },
];

export function ReviewCutControls({
  cutSize,
  strategy,
  totalCount,
  shortlistCount,
  onCutSizeChange,
  onStrategyChange,
  onOpenShortlist,
  onOpenCompare,
}: ReviewCutControlsProps) {
  return (
    <div className="review-cut-controls">
      <div className="review-cut-slider">
        <div>
          <span className="field-label">Review cut</span>
          <strong>{cutSize} of {totalCount}</strong>
        </div>
        <input
          type="range"
          min={1}
          max={Math.max(1, totalCount)}
          value={Math.min(cutSize, Math.max(1, totalCount))}
          onChange={(event) => onCutSizeChange(Number(event.target.value))}
          aria-label="Number of submissions included in the review cut"
        />
        <output>{Math.round((cutSize / Math.max(1, totalCount)) * 100)}%</output>
      </div>
      <fieldset className="review-cut-strategy">
        <legend>Cut strategy</legend>
        <div>
          {strategies.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={strategy === item.value}
              onClick={() => onStrategyChange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="review-cut-checkpoints" aria-label="Coverage checkpoints">
        {[3, 8, 27].map((count) => (
          <button
            key={count}
            type="button"
            disabled={count > totalCount} title="This market has fewer submissions than this checkpoint."
            className={cutSize === count ? 'is-active' : ''}
            onClick={() => onCutSizeChange(count)}
          >
            Top {count}
          </button>
        ))}
      </div>
      <div className="review-cut-actions">
        <button type="button" className="secondary-action" onClick={onOpenShortlist}>
          Shortlist <span>{shortlistCount}</span>
        </button>
        <button type="button" className="secondary-action" disabled={!shortlistCount} title="Add candidates to the shortlist first." onClick={onOpenCompare}>
          Compare shortlist
        </button>
      </div>
    </div>
  );
}
