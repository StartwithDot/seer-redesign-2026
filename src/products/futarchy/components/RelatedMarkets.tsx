import { markets } from '../data/markets';
import { organizations } from '../data/organizations';
import type { Market } from '../data/types';
import { MarketArtwork } from './MarketArtwork';
import { DataList } from './DataList';

const statusLabel = { active: 'Active', awaiting: 'Awaiting', resolved: 'Resolved' } as const;

export function RelatedMarkets({ market, onNavigate }: { market: Market; onNavigate: (hash: string) => void }) {
  const related = markets.filter((item) => item.organizationId === market.organizationId && item.id !== market.id).slice(0, 3);
  const organization = organizations.find((item) => item.id === market.organizationId);

  return (
    <section className="related-markets" aria-labelledby="related-markets-title">
      <header>
        <div><span className="eyebrow">ORGANIZATION CONTEXT</span><h2 id="related-markets-title">More from {organization?.name ?? 'this organization'}</h2></div>
        <button className="quiet-button" type="button" onClick={() => onNavigate(`#/organization/${market.organizationId}`)}>View organization</button>
      </header>
      <DataList label="Related organization markets" count={related.length} emptyTitle="No other signals for this organization." emptyDescription="The organization view lists all indexed proposals.">
      <div className="related-strip">
        {related.map((item) => (
          <button key={item.id} className="related-market" type="button" onClick={() => onNavigate(`#/m/${item.id}`)}>
            <MarketArtwork market={item} compact />
            <span>
              <small>{item.proposal} · {statusLabel[item.status]}</small>
              <strong>{item.question}</strong>
              <em>{item.impact > 0 ? '+' : ''}{item.impact.toFixed(2)}% expected impact</em>
            </span>
            <b aria-hidden="true">›</b>
          </button>
        ))}
      </div>
      </DataList>
    </section>
  );
}
