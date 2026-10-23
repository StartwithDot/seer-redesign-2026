import type { useChartWindow } from '../hooks/useChartWindow';

export function ChartWindowControls({ view, total }: { view: ReturnType<typeof useChartWindow>; total: number }) {
  return <div className="analysis-controls" role="group" aria-label="Chart viewport">
    <button type="button" disabled={!view.canZoomIn} title="At least four observations are needed to zoom further." onClick={view.zoomIn}>Zoom in</button>
    <button type="button" disabled={!view.canZoomOut} title="The full range is already visible." onClick={view.zoomOut}>Zoom out</button>
    <button type="button" disabled={view.start === 0} title="Beginning of the recorded range." onClick={() => view.pan(-1)}>Pan earlier</button>
    <button type="button" disabled={view.end >= total} title="End of the recorded range." onClick={() => view.pan(1)}>Pan later</button>
    <button type="button" disabled={!view.canZoomOut} title="The full range is already visible." onClick={view.reset}>Fit chart</button>
    <span role="status">Observations {total ? view.start + 1 : 0}–{view.end} of {total}</span>
  </div>;
}
