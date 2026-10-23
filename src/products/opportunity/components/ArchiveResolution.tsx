import { archiveEvidenceFor } from '../data/archive';
import { CopyButton } from './RecordActions';

export function ArchiveResolution({ marketId }: { marketId: string }) {
  const evidence = archiveEvidenceFor(marketId);
  if (!evidence) return null;
  return <section className="archive-resolution" aria-label="Final decision and settlement evidence">
    <p className="section-kicker">Final sponsor decision</p>
    <h3>{evidence.winners.length === 1 ? evidence.winners[0] : `${evidence.winners.length} selected designs`}</h3>
    {evidence.winners.length > 1 && <ul>{evidence.winners.map(name => <li key={name}>{name}</li>)}</ul>}
    <dl>
      <div><dt>Finalized (UTC)</dt><dd><time dateTime={evidence.finalizedAt}>{evidence.finalizedAt.replace('T', ' ').replace('.000Z', ' UTC')}</time></dd></div>
      <div><dt>Settlement</dt><dd>{evidence.payout}</dd></div>
      <div><dt>Evidence</dt><dd>{evidence.payoutReported ? 'Payout reported in captured contract record' : 'Payout not reported'}</dd></div>
    </dl>
    <p>Historical source snapshot. Open Payouts to read your wallet holdings.</p>
    <div className="archive-evidence-actions">
      <a href={evidence.sourceUrl} target="_blank" rel="noreferrer">Open source market ↗</a>
      <a href={`https://gnosisscan.io/address/${evidence.id}`} target="_blank" rel="noreferrer">Inspect contract ↗</a>
      <CopyButton value={evidence.id} label="Copy contract" />
    </div>
  </section>;
}
