interface ChartToolbarProps {
  scaleLabel: string;
  canPrevious: boolean;
  canNext: boolean;
  onZoomToData: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onExport: () => void;
}

export function ChartToolbar({
  scaleLabel,
  canPrevious,
  canNext,
  onZoomToData,
  onPrevious,
  onNext,
  onExport,
}: ChartToolbarProps) {
  return (
    <div className="chart-toolbar" aria-label="Chart navigation and export">
      <span className="chart-scale" aria-live="polite">{scaleLabel}</span>
      <div className="chart-toolbar-actions">
        <button type="button" className="secondary-button compact-button" onClick={onZoomToData}>
          Zoom to data
        </button>
        <button
          type="button"
          className="icon-button"
          aria-label="Previous chart range"
          data-tooltip="Previous range"
          disabled={!canPrevious}
          onClick={onPrevious}
        >
          <span aria-hidden="true">‹</span>
        </button>
        <button
          type="button"
          className="icon-button"
          aria-label="Next chart range"
          data-tooltip="Next range"
          disabled={!canNext}
          onClick={onNext}
        >
          <span aria-hidden="true">›</span>
        </button>
        <button type="button" className="secondary-button compact-button" onClick={onExport}>
          Export CSV
        </button>
      </div>
    </div>
  );
}
