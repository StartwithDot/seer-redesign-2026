import { useState } from 'react';
import type { Market, Organization } from '../data/types';
import { ClosedMarketCard } from './ClosedMarketCard';
import { DataList } from './DataList';

interface RecentlyClosedProps {
  markets: Market[];
  organizations: Organization[];
  onNavigate: (hash: string) => void;
  onClearFilters?: () => void;
}

export function RecentlyClosed({ markets, organizations, onNavigate, onClearFilters }: RecentlyClosedProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? markets : markets.slice(0, 8);
  const organizationName = (id: string) => organizations.find((organization) => organization.id === id)?.shortName ?? 'Organization';

  return (
    <section id="recently-closed" className="landing-section closed-section" aria-labelledby="closed-title">
      <header className="section-heading">
        <div><span className="eyebrow">RECENTLY CLOSED</span><h2 id="closed-title">Resolved decisions.</h2></div>
        <p>Inspect the final outcome, realized impact and winning branch.</p>
      </header>
      <DataList label="Recently closed markets" count={markets.length} layout="cards" emptyTitle="No closed milestones match this view." onReset={onClearFilters}>
        <div className="closed-market-grid">
          {visible.map((market) => (
            <ClosedMarketCard key={market.id} market={market} organizationName={organizationName(market.organizationId)} onNavigate={onNavigate} />
          ))}
        </div>
      {markets.length > 8 && (
        <button className="show-more-button" type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>
          {expanded ? 'Show fewer' : `Show ${markets.length - 8} more`}
        </button>
      )}
      </DataList>
    </section>
  );
}
