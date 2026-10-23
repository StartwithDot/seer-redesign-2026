export const sampleClock = '2026-10-23T09:30:00.000Z';
export type ClockMode = 'snapshot' | 'current';
export const clockStorageKey = 'explorer-clock-mode';

export function readClockMode(): ClockMode {
  try { return localStorage.getItem(clockStorageKey) === 'current' ? 'current' : 'snapshot'; }
  catch { return 'snapshot'; }
}
// A fixed browser URL hook lets QA reproduce wall-clock-dependent displays.
export function clockTimestamp(mode: ClockMode, locationSearch = '', now = Date.now()) {
  const fixed = new URLSearchParams(locationSearch).get('explorerClock');
  if (fixed && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(fixed) && Number.isFinite(Date.parse(fixed))) return new Date(fixed).toISOString();
  return mode === 'current' ? new Date(now).toISOString() : sampleClock;
}
