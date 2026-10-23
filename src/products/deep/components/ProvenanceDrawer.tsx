import type { Repository } from '../data/types';
import { Dialog } from './Dialog';
import { Icon } from './Icons';

function Address({ value }: { value: string | null }) {
  return value ? <code>{value}</code> : <span className="deep-muted">Identifier not exposed by the current snapshot</span>;
}

function AddressList({ values }: { values: string[] }) {
  return values.length
    ? <ol className="deep-address-list">{values.map((value) => <li key={value}><code>{value}</code></li>)}</ol>
    : <span className="deep-muted">None returned</span>;
}

export function ProvenanceDrawer({ repository, open, onClose }: { repository: Repository; open: boolean; onClose: () => void }) {
  const marketId = repository.provenance.marketAddress ?? repository.marketId;
  return (
    <Dialog
      open={open}
      title="Protocol provenance"
      description="Wrapped outcomes and settlement paths copied from the saved Deep market response."
      onClose={onClose}
      className="deep-provenance"
    >
      <dl className="deep-provenance__list">
        <div><dt>Market status</dt><dd>{repository.marketStatus}</dd></div>
        <div><dt>Market identifier</dt><dd><Address value={marketId} /></dd></div>
        <div><dt>Reality.eth question</dt><dd><Address value={repository.provenance.realityQuestionId} /></dd></div>
        <div><dt>Kleros case</dt><dd><Address value={repository.provenance.klerosCaseId} /></dd></div>
        <div><dt>Parent outcome</dt><dd>{repository.provenance.parentOutcome ?? 'Unavailable'}</dd></div>
        <div><dt>Parent market status</dt><dd><code>{repository.provenance.parentMarketStatus ?? 'Unavailable'}</code></dd></div>
        <div><dt>Wrapped outcome tokens</dt><dd><AddressList values={repository.provenance.wrappedOutcomeTokens} /></dd></div>
        <div><dt>Parent wrapped tokens</dt><dd><AddressList values={repository.provenance.parentWrappedTokens} /></dd></div>
        <div>
          <dt>Middle markets</dt>
          <dd>
            {repository.provenance.middleMarkets.length ? (
              <ol className="deep-address-list">
                {repository.provenance.middleMarkets.map((market) => (
                  <li key={market.id}>
                    <code>{market.id}</code>
                    <small>Payout reported: {market.payoutReported ? 'yes' : 'no'}</small>
                  </li>
                ))}
              </ol>
            ) : <span className="deep-muted">None returned</span>}
          </dd>
        </div>
      </dl>
      <div className="deep-provenance__links">
        <a className="deep-button" href="https://reality.eth/" target="_blank" rel="noreferrer">
          Reality.eth <Icon name="external" />
        </a>
        <a className="deep-button" href="https://kleros.io/" target="_blank" rel="noreferrer">
          Kleros <Icon name="external" />
        </a>
        <a className="deep-button" href={`https://optimistic.etherscan.io/address/${marketId}`} target="_blank" rel="noreferrer">
          Optimistic Etherscan <Icon name="external" />
        </a>
        <a className="deep-button" href={`https://app.seer.pm/?chains=10&market=${marketId}`} target="_blank" rel="noreferrer">
          Seer Explorer <Icon name="external" />
        </a>
      </div>
      {!repository.provenance.realityQuestionId && !repository.provenance.klerosCaseId && (
        <p className="deep-provenance__note">Reality.eth and Kleros open their protocol sites because this response does not include question or case identifiers.</p>
      )}
    </Dialog>
  );
}
