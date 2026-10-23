import { useMemo, useState } from 'react';
import { compactMoney } from '../data/format';
import type { Organization } from '../data/types';
import { DataList } from './DataList';

interface OrganizationTableProps {
  organizations: Organization[];
  onNavigate: (hash: string) => void;
  onFilterActive: (organizationId: string) => void;
}

type ProposalSort = 'proposals-desc' | 'proposals-asc' | 'name';

export function OrganizationTable({ organizations, onNavigate, onFilterActive }: OrganizationTableProps) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<ProposalSort>('proposals-desc');

  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return organizations
      .filter((organization) => !normalized || `${organization.name} ${organization.shortName} ${organization.token}`.toLocaleLowerCase().includes(normalized))
      .sort((left, right) => {
        if (sort === 'name') return left.name.localeCompare(right.name);
        if (sort === 'proposals-asc') return left.proposals - right.proposals;
        return right.proposals - left.proposals;
      });
  }, [organizations, query, sort]);

  return (
    <div className="organization-directory">
      <div className="organization-toolbar">
        <label>
          <span className="sr-only">Filter organizations by name</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter by name" />
        </label>
        <label className="organization-sort">
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as ProposalSort)}>
            <option value="proposals-desc">Proposals: high to low</option>
            <option value="proposals-asc">Proposals: low to high</option>
            <option value="name">Name</option>
          </select>
        </label>
        <strong aria-live="polite">{visible.length} organizations</strong>
      </div>

      <DataList label="Organizations" count={visible.length} layout="table" emptyTitle={query ? 'No organizations match this search.' : 'No organizations in this snapshot.'} onReset={query ? () => setQuery('') : undefined} resetLabel="Clear search">
        <div className="organization-table-wrap">
          <table className="organization-table">
            <caption className="sr-only">Organizations with Futarchy markets</caption>
            <thead>
              <tr><th>Name</th><th>Market / Active</th><th>Proposals</th><th>Chain</th><th>Liquidity</th></tr>
            </thead>
            <tbody>
              {visible.map((organization) => (
                <tr key={organization.id}>
                  <th scope="row">
                    <button type="button" onClick={() => onNavigate(`#/organization/${organization.id}`)}>
                      <span className={`token-mark token-${organization.token.toLowerCase()}`}>{organization.token.slice(0, 1)}</span>
                      <span><strong>{organization.name}</strong><small>{organization.token}</small></span>
                    </button>
                  </th>
                  <td data-label="Market / Active">
                    <strong>{organization.totalMarkets}</strong><span> / {organization.activeMarkets} active</span>
                    {organization.activeMarkets > 0 && (
                      <button className="active-market-tag" type="button" onClick={() => onFilterActive(organization.id)}>ACTIVE MARKET</button>
                    )}
                  </td>
                  <td data-label="Proposals"><strong>{organization.proposals}</strong></td>
                  <td data-label="Chain"><span className="chain-mark" />{organization.chain}</td>
                  <td data-label="Liquidity">
                    <a href={organization.liquidityUrl} target="_blank" rel="noreferrer">
                      <strong>{compactMoney(organization.liquidity)}</strong>
                      <span className="liquidity-bar"><i style={{ width: `${Math.min(100, organization.liquidity / 20_000)}%` }} /></span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataList>
    </div>
  );
}
