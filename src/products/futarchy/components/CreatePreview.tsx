import { organizationName, type MarketDraft } from '../data/creation';
import { marketArtwork } from '../data/artwork';

export function CreatePreview({ draft }: { draft: MarketDraft }) {
  return <aside className="creation-preview" aria-label="Live conditional market preview">
    <img src={marketArtwork.architecture.src} alt="Seer architectural study" />
    <div><span className="eyebrow">LIVE PREVIEW · {organizationName(draft)}</span>
      <h2>What changes if {draft.title.trim() || 'your proposal'} passes?</h2>
      <p>{draft.description || 'Your proposal description will appear here.'}</p>
      <svg viewBox="0 0 360 110" role="img" aria-label="One shared history branches into pass and fail worlds"><path d="M0 55 H120 Q170 55 210 25 H350" /><path d="M120 55 Q170 55 210 85 H350" /><text x="235" y="17">IF PASS</text><text x="235" y="105">IF FAIL</text></svg>
      <dl><div><dt>Measured by</dt><dd>{draft.metric || 'Choose a metric'}</dd></div><div><dt>Collateral</dt><dd>{draft.collateral}</dd></div><div><dt>Closes</dt><dd>{draft.date ? `${draft.date} · 23:59 UTC` : 'Choose a date'}</dd></div></dl>
      <small>Preview only. No forecast prices exist until a real market is funded and traded.</small>
    </div>
  </aside>;
}
