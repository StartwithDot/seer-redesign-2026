import { money } from '../data/format';
import type { AssetBalance } from '../data/portfolio';
import { DataList } from './DataList';

interface AssetBalanceTableProps {
  assets: AssetBalance[];
}

const cowSwapUrl = (asset: AssetBalance) => `https://swap.cow.fi/#/${asset.chainId}/swap/${asset.chainId === 1 ? 'ETH' : 'WXDAI'}/${asset.address || asset.asset}`;

export function AssetBalanceTable({ assets }: AssetBalanceTableProps) {
  return (
    <DataList label="Wallet asset balances" count={assets.length} layout="table" emptyTitle="No asset balances available.">
    <section className="position-table-section" aria-labelledby="asset-balance-title">
      <div className="trade-section-heading">
        <div><span className="eyebrow">WALLET BALANCES</span><h3 id="asset-balance-title">Assets available to this market.</h3></div>
        <p>Contract balances. Values use stored reference prices.</p>
      </div>
      <div className="position-table-wrap">
        <table className="position-table">
          <caption className="sr-only">Wallet asset balances</caption>
          <thead><tr><th>Asset</th><th>Balance</th><th>Value</th><th>Availability</th></tr></thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.asset}>
                <th scope="row"><span className={`asset-dot asset-${asset.asset.toLowerCase()}`} /><span><strong>{asset.asset}</strong><small>{asset.label}</small></span></th>
                <td data-label="Balance"><strong>{asset.known ? asset.amount.toLocaleString('en-US', { maximumFractionDigits: 6 }) : 'Unavailable'}</strong></td>
                <td data-label="Value">{asset.usdValue === null ? 'Unavailable' : money(asset.usdValue, 2)}</td>
                <td data-label="Availability">
                  {asset.available
                    ? <span className="availability is-ready">Available</span>
                    : <span className="availability is-short">{asset.known ? 'No balance' : 'Unavailable'} <a href={cowSwapUrl(asset)} target="_blank" rel="noreferrer">Buy {asset.asset} ↗</a></span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    </DataList>
  );
}
