import { useState } from 'react';
import { downloadCsv, type CsvRow } from '../data/export';

export function DataActions({ title, rows, reference, href }: { title: string; rows?: CsvRow[]; reference?: string; href?: string }) {
  const [status, setStatus] = useState('');
  const [manual, setManual] = useState('');
  const url = () => href ? new URL(href, location.href).href : location.href;
  async function copy(value: string) {
    try { await navigator.clipboard.writeText(value); setStatus('Copied'); setManual(''); }
    catch { setStatus('Clipboard unavailable. Select and copy below.'); setManual(value); }
  }
  async function share() {
    if (!navigator.share) return copy(url());
    try { await navigator.share({ title, url: url() }); setStatus('Shared'); }
    catch (error) { if ((error as Error).name !== 'AbortError') { setStatus('Sharing unavailable. Copy the link below.'); setManual(url()); } }
  }
  return <div className="data-actions">
    {rows && <button className="quiet-button" disabled={!rows.length} title={!rows.length ? 'No rows to export' : undefined} onClick={() => { try { downloadCsv(title, rows); setStatus(`Exported ${rows.length} rows`); } catch { setStatus('Export failed. Please try again.'); } }}>Export CSV</button>}
    <button className="quiet-button" onClick={() => void copy(url())}>Copy link</button>
    <button className="quiet-button" onClick={() => void share()}>Share</button>
    {reference && <button className="quiet-button" onClick={() => void copy(reference)}>Copy reference</button>}
    <span role="status">{status}</span>
    {manual && <label className="manual-copy">Link or reference<input readOnly value={manual} onFocus={e => e.target.select()} /></label>}
  </div>;
}
