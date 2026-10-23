import type { Market, Organization } from '../data/types';
import { MarketCard } from './MarketCard';
import { DataList } from './DataList';

interface ActiveMilestonesProps {
  markets: Market[];
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  now: number;
  onRetry: () => void;
  onClearFilters: () => void;
  onNavigate: (hash: string) => void;
}

export function ActiveMilestones({ markets, organizations, loading, error, now, onRetry, onClearFilters, onNavigate }: ActiveMilestonesProps) {
  const organizationName = (id: string) => organizations.find((organization) => organization.id === id)?.shortName ?? 'Organization';

  return (
    <DataList label="Active milestones" layout="cards" count={markets.length} source={{ loading, error, reload: onRetry }} emptyTitle="No milestones match this view." emptyDescription="Clear the filters to restore the active decision set." onReset={onClearFilters}>
      <div className={`market-card-grid${markets.length === 1 ? ' is-single' : ''}`}>
        {markets.map((market) => (
          <MarketCard
            key={market.id}
            market={market}
            organizationName={organizationName(market.organizationId)}
            now={now}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </DataList>
  );
}
