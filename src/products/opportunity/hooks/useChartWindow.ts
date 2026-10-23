import { useState } from 'react';

export function chartWindow(total: number, requestedSize: number, requestedStart: number) {
  const size = Math.min(total, Math.max(Math.min(3, total), requestedSize));
  const start = Math.max(0, Math.min(requestedStart, total - size));
  return { start, end: start + size, size };
}

export function useChartWindow(total: number) {
  const [requestedSize, setSize] = useState<number | null>(null);
  const [requestedStart, setStart] = useState(0);
  const view = chartWindow(total, requestedSize ?? total, requestedStart);
  return {
    ...view,
    canZoomIn: view.size > 3,
    canZoomOut: view.size < total,
    zoomIn: () => { setSize(Math.ceil(view.size / 2)); setStart(view.start); },
    zoomOut: () => { setSize(view.size * 2); setStart(view.start); },
    pan: (direction: -1 | 1) => setStart(Math.max(0, Math.min(total - view.size, view.start + direction * Math.max(1, Math.floor(view.size / 2))))),
    reset: () => { setSize(null); setStart(0); },
  };
}
