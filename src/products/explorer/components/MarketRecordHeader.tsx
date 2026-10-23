import { ShareMarket } from './ShareMarket';
import { tradingStatusLabels } from '../data/semantics';
import { chainById } from '../data/chains';
import { externalLinks } from '../data/externalLinks';
import { useSavedMarkets } from '../hooks/useSavedMarkets';
import { formatAddress, formatDate, formatCreator } from '../lib/format';
import { marketStateLabels, marketTypeLabels } from '../lib/marketFilters';
import type { Market } from '../types';
import { MarketVisual } from './MarketVisual';
import { VerificationMark } from './VerificationMark';

interface MarketRecordHeaderProps {
  market: Market;
  navigate: (hash: string) => void;
}

export function MarketRecordHeader({ market, navigate }: MarketRecordHeaderProps) {
  const chain = chainById(market.chainId);
  const { savedMarkets, toggleSaved } = useSavedMarkets();
  const saved = savedMarkets.has(market.id);

  return (
    <>
      <nav className="record-breadcrumb" aria-label="Breadcrumb">
        <button type="button" onClick={() => navigate('#/markets')}>Back</button>
        <span aria-hidden="true">/</span>
        <a href="#/markets" onClick={(event) => { event.preventDefault(); navigate('#/markets'); }}>Markets</a>
        <span aria-hidden="true">/</span>
        <span>{market.subject}</span>
        <span aria-hidden="true">/</span>
        <strong aria-current="page">{market.slug}</strong>
      </nav>

      <p className="notice">{market.provenance.origin === 'captured-api' ? 'Captured Seer API snapshot. Capture time was not recorded. Lifecycle assessed at 23 Oct 2026 from saved oracle fields; confirm current conditions in the live app.' : 'Illustrative market snapshot · 23 Oct 2026. Prices, history and evidence demonstrate the interface; they are not live market records.'}</p>
      <div className="record-identity">
        <MarketVisual market={market} />
        <div>
          <div className="record-lifecycle-strip" aria-label="Market lifecycle">
            <span className="is-current">{marketStateLabels[market.marketState]}</span>
            <span className={market.status === 'open' ? 'is-current' : ''}>{tradingStatusLabels[market.status]}</span>
            <span className={market.marketState === 'pending-execution' ? 'is-current' : ''}>Pending execution</span>
            <span className={market.status === 'resolved' ? 'is-current' : ''}>Closed</span>
          </div>
          <div className="record-status-row">
            <VerificationMark status={market.verification} />
            <span>{chain.name}</span>
            <button
              className={`save-button ${saved ? 'is-saved' : ''}`}
              type="button"
              aria-pressed={saved}
              data-tooltip={saved ? 'Remove from collection' : 'Save to collection'}
              onClick={() => toggleSaved(market)}
            >
              <span aria-hidden="true">{saved ? '★' : '☆'}</span>
              <span className="sr-only">{saved ? 'Remove from collection' : 'Save to collection'}</span>
            </button>
            <ShareMarket />
            <a className="reality-action" href={externalLinks.reality} target="_blank" rel="noreferrer">Answer on Reality.eth ↗</a>
          </div>
          <p className="eyebrow">{marketTypeLabels[market.type]} market · opens {formatDate(market.openingDate)} · ends {formatDate(market.endDate)}</p>
          <h1>{market.question}</h1>
          <p>{market.summary}</p>
          <div className="record-creator">
            Asked by <strong title={market.creatorAddress}>{formatCreator(market.creator, market.creatorAddress)}</strong>
            <code>{formatAddress(market.creatorAddress)}</code>
          </div>
        </div>
      </div>
    </>
  );
}
