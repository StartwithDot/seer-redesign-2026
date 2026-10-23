import { entityHref } from '../data/explorer';
import { compactMoney } from '../data/format';
import type { WalletController } from '../hooks/useWallet';
import { MarketCard } from './MarketCard';
import { MarketWorkspace } from './MarketWorkspace';
import { RouteBar } from './RouteBar';
import { useCountdown } from '../hooks/useCountdown';
import { useMarketData } from '../hooks/useMarketData';
import { DataList } from './DataList';
import { ListLoading, ListNotice } from './ListState';

interface RouteViewProps {
  id: string;
  onNavigate: (hash: string) => void;
}

interface MarketRouteViewProps extends RouteViewProps {
  wallet: WalletController;
  onOpenWallet: () => void;
}

export function OrganizationView({ id, onNavigate }: RouteViewProps) {
  const now = useCountdown();
  const data = useMarketData();
  if (data.loading) return <ListLoading label="organization" layout="signal" />;
  if (data.error) return <ListNotice title={data.error} action={() => { void data.reload(); }} error />;
  const organization = data.snapshot?.organizations.find((item) => item.id === id);
  if (!organization) return <NotFound kind="organization" onNavigate={onNavigate} />;
  const organizationMarkets = data.snapshot?.markets.filter((market) => market.organizationId === organization.id) ?? [];
  return (
    <div className="route-view">
      <RouteBar label={organization.name} parentLabel="Organizations" fallback={() => onNavigate('#/')} />
      <header className="entity-header">
        <span className={`token-mark token-${organization.token.toLowerCase()} entity-mark`}>{organization.token.slice(0, 1)}</span>
        <div><span className="eyebrow">ORGANIZATION · {organization.chain}</span><h1>{organization.name}</h1><p>{organization.description}</p></div>
      </header>
      <a className="text-link" href={entityHref('organization', organization.id)}>Organization explorer record ↗</a>
      <section className="entity-metrics" aria-label="Organization market summary">
        <article><span>ACTIVE MARKET</span><strong>{organization.activeMarkets}</strong></article>
        <article><span>TOTAL MARKETS</span><strong>{organization.totalMarkets}</strong></article>
        <article><span>PROPOSALS</span><strong>{organization.proposals}</strong></article>
        <article><span>LIQUIDITY</span><strong>{compactMoney(organization.liquidity)}</strong></article>
      </section>
      <section className="entity-list" aria-labelledby="org-markets-title">
        <div className="section-heading"><div><span className="eyebrow">MARKET MEMBERSHIP</span><h2 id="org-markets-title">Signals for this organization</h2></div></div>
        <DataList label="Organization markets" count={organizationMarkets.length} layout="cards" emptyTitle="No markets for this organization." emptyDescription="Browse the Explorer to find another organization.">
          <div className="market-card-grid">
            {organizationMarkets.map((market) => (
              <MarketCard key={market.id} market={market} organizationName={organization.shortName} now={now} onNavigate={onNavigate} />
            ))}
          </div>
        </DataList>
      </section>
    </div>
  );
}

export function MarketView({ id, wallet, onNavigate, onOpenWallet }: MarketRouteViewProps) {
  const data = useMarketData();
  if (data.loading) return <ListLoading label="market workspace" layout="signal" />;
  if (data.error) return <ListNotice title={data.error} action={() => { void data.reload(); }} error />;
  const market = data.snapshot?.markets.find((item) => item.id === id);
  if (!market) return <NotFound kind="market" onNavigate={onNavigate} />;
  const organization = data.snapshot?.organizations.find((item) => item.id === market.organizationId);
  return <MarketWorkspace key={market.id} market={market} organizationName={organization?.shortName ?? 'Organization'} wallet={wallet} onNavigate={onNavigate} onOpenWallet={onOpenWallet} />;
}

function NotFound({ kind, onNavigate }: { kind: string; onNavigate: (hash: string) => void }) {
  return (
    <section className="not-found">
      <span className="eyebrow">NOT FOUND</span>
      <h1>That {kind} is not in this market snapshot.</h1>
      <button className="primary-button" type="button" onClick={() => onNavigate('#/')}>Return to Signal Board</button>
    </section>
  );
}
