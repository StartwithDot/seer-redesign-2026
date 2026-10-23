import { useEffect, useState } from 'react';
import { clockStorageKey, clockTimestamp, readClockMode, type ClockMode } from '../data/clock';
import { formatUtcTimestamp } from '../lib/format';

export function DataClock() {
  const [mode, setMode] = useState<ClockMode>(readClockMode);
  const [time, setTime] = useState(() => clockTimestamp(mode, window.location.search));
  useEffect(() => {
    const update = () => setTime(clockTimestamp(mode, window.location.search));
    update();
    const timer = mode === 'current' ? window.setInterval(update, 15000) : null;
    return () => { if (timer !== null) window.clearInterval(timer); };
  }, [mode]);
  return <details className="data-clock"><summary>Data and time</summary>
    <p>Market prices are fixed illustrative samples. Changing the display clock does not update odds.</p>
    <label>Display clock<select value={mode} onChange={(event) => {
      const next = event.target.value as ClockMode;
      try { localStorage.setItem(clockStorageKey, next); } catch { /* In-memory selection. */ }
      setMode(next);
    }}><option value="snapshot">Snapshot time</option><option value="current">Current time</option></select></label>
    <time dateTime={time}>{formatUtcTimestamp(time)}</time>
    <p>Snapshot captured 23 Oct 2026 at 09:30 UTC. Live odds are unavailable.</p>
  </details>;
}
