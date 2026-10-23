import type { ExplorerRecord } from '../data/types';
import { RecordActions } from './RecordActions';

interface CanonicalRecordPanelProps {
  record: Extract<ExplorerRecord, { kind: 'creator' | 'wallet' | 'transaction' }>;
  onOpenRecord: (recordId: string) => void;
}

export function CanonicalRecordPanel({ record, onOpenRecord }: CanonicalRecordPanelProps) {
  if (record.kind === 'creator') {
    const volume = record.markets.reduce((total, market) => total + market.volumeUsd, 0);
    return (
      <article className="record-dossier canonical-record">
        <section>
          <p className="section-kicker">Creator record</p>
          <h3>{record.creator}</h3>
          <p>Creator identity across the canonical Opportunity Markets object index.</p>
          <dl>
            <div><dt>Markets</dt><dd>{record.markets.length}</dd></div>
            <div><dt>Combined volume</dt><dd>${volume.toLocaleString()}</dd></div>
            <div><dt>Evidence</dt><dd>{record.source === 'sample' ? 'Deterministic sample' : 'Verified record'}</dd></div>
          </dl>
        </section>
        <section>
          <p className="section-kicker">{record.submissions ? 'Submission markets' : 'Created markets'}</p>
          <div className="record-link-list">
            {record.markets.map((market) => (
              <button key={market.id} type="button" onClick={() => onOpenRecord(`market-${market.id}`)}>
                <span><strong>{market.title}</strong><small>{market.id} · {market.status}</small></span>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </section>
        <RecordActions recordId={record.id} values={[{ label: 'Creator', value: record.creator }]} />
        {record.submissions && <div className="record-link-list">{record.submissions.map(submission => <button key={submission.id} type="button" onClick={() => onOpenRecord(`submission-${submission.id}`)}><span>{submission.name}</span><span aria-hidden="true">→</span></button>)}</div>}
      </article>
    );
  }

  if (record.kind === 'wallet') {
    return (
      <article className="record-dossier canonical-record">
        <section>
          <p className="section-kicker">Wallet record</p>
          <h3>{record.address.slice(0, 10)}...{record.address.slice(-8)}</h3>
          <p>This record aggregates deterministic sample positions. It does not connect or impersonate a wallet.</p>
          <dl>
            <div><dt>Address</dt><dd>{record.address}</dd></div>
            <div><dt>Positions</dt><dd>{record.positions.length}</dd></div>
            <div><dt>Evidence</dt><dd>Deterministic sample</dd></div>
          </dl>
        </section>
        <section>
          <p className="section-kicker">Recorded positions</p>
          <div className="record-link-list">
            {record.positions.map(({ market, submission }) => (
              <button
                key={`${market.id}-${submission.submission.id}`}
                type="button"
                onClick={() => onOpenRecord(`submission-${submission.submission.id}`)}
              >
                <span>
                  <strong>{submission.submission.name}</strong>
                  <small>{market.title} · {submission.position ? `${submission.position.outcomeCount} shares` : 'No sample position'}</small>
                </span>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </section>
        <RecordActions
          recordId={record.id}
          values={[{ label: 'Wallet address', value: record.address, note: 'Deterministic sample address.' }]}
        />
      </article>
    );
  }

  return (
    <article className="record-dossier canonical-record">
      <section>
        <p className="section-kicker">Transaction record</p>
        <h3>{record.transactionType} event</h3>
        <p>{record.summary ?? 'Deterministic sample transaction evidence connected to a canonical market record.'}</p>
        <dl>
          <div><dt>Transaction hash</dt><dd>{record.hash}</dd></div>
          <div><dt>Block</dt><dd>{record.block.toLocaleString()}</dd></div>
          <div><dt>Timestamp</dt><dd>{record.date}</dd></div>
          <div><dt>Status</dt><dd>{record.source === 'verified' ? 'Confirmed on-chain' : 'Recorded sample'}</dd></div>
          {record.account && <div><dt>Wallet</dt><dd>{record.account}</dd></div>}
          {record.target && <div><dt>Contract</dt><dd>{record.target}</dd></div>}
        </dl>
      </section>
      <section>
        <p className="section-kicker">Connected objects</p>
        <div className="record-link-list">
          <button type="button" onClick={() => onOpenRecord(`market-${record.market.id}`)}>
            <span><strong>{record.market.title}</strong><small>Market record · {record.market.id}</small></span>
            <span aria-hidden="true">→</span>
          </button>
          <a href={`https://gnosisscan.io/tx/${record.hash}`} target="_blank" rel="noreferrer">
            <span><strong>Open Gnosisscan</strong><small>External transaction explorer</small></span>
            <span aria-hidden="true">↗</span>
          </a>
          {record.account && <a href={`https://gnosisscan.io/address/${record.account}`} target="_blank" rel="noreferrer">
            <span><strong>Open wallet</strong><small>Verified sender on Gnosis Chain</small></span>
            <span aria-hidden="true">↗</span>
          </a>}
        </div>
      </section>
      <RecordActions
        recordId={record.id}
        values={[
          { label: 'Transaction hash', value: record.hash },
          { label: 'Market ID', value: record.market.id },
          ...(record.account ? [{ label: 'Wallet address', value: record.account }] : []),
          ...(record.target ? [{ label: 'Target contract', value: record.target }] : []),
        ]}
      />
    </article>
  );
}
