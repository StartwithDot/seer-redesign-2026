import type { Market } from '../data/types';
import { DataList } from './DataList';

interface ContractProvenancePanelProps {
  market: Market;
}

const contracts = [
  { name: 'FutarchyFactory', role: 'Creates proposal markets', href: 'https://gnosisscan.io/search?f=0&q=FutarchyFactory' },
  { name: 'FutarchyProposal', role: 'Holds proposal state and outcomes', href: 'https://gnosisscan.io/search?f=0&q=FutarchyProposal' },
  { name: 'FutarchyRouter', role: 'Routes conditional-token operations', href: 'https://gnosisscan.io/search?f=0&q=FutarchyRouter' },
  { name: 'FutarchyRealityProxy', role: 'Connects resolution questions', href: 'https://gnosisscan.io/search?f=0&q=FutarchyRealityProxy' },
  { name: 'ConditionalTokens', role: 'Mints and tracks outcome tokens', href: 'https://gnosisscan.io/search?f=0&q=ConditionalTokens' },
  { name: 'CTHelpers', role: 'Supports conditional-token math', href: 'https://gnosisscan.io/search?f=0&q=CTHelpers' },
];

export function ContractProvenancePanel({ market }: ContractProvenancePanelProps) {
  return (
    <section className="contract-provenance" aria-labelledby="contract-provenance-title">
      <div className="trade-section-heading">
        <div><span className="eyebrow">CONTRACTS & PROVENANCE</span><h3 id="contract-provenance-title">Every state transition has a named home.</h3></div>
      </div>
      <p className="contract-disclosure">The market contract below is linked directly. Protocol roles link to GnosisScan search so a viewer can verify the deployed implementation without treating a placeholder address as canonical.</p>
      <div className="contract-market-link">
        <span>MARKET CONTRACT</span>
        <a href={`https://gnosisscan.io/address/${market.marketAddress}`} target="_blank" rel="noreferrer">{market.marketAddress} <span aria-hidden="true">↗</span></a>
      </div>
      <DataList label="Protocol contract roles" count={contracts.length} emptyTitle="No contract roles recorded."><ul className="contract-list">
        {contracts.map((contract) => <li key={contract.name}><div><strong>{contract.name}</strong><small>{contract.role}</small></div><a href={contract.href} target="_blank" rel="noreferrer">Verify on GnosisScan <span aria-hidden="true">↗</span></a></li>)}
      </ul></DataList>
    </section>
  );
}
