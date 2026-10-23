import { money } from '../data/format';
import type { TradeRecord } from '../data/portfolio';
import { DataList } from './DataList';

interface TradeHistoryTableProps {
  trades: TradeRecord[];
}

export function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  return (
    <DataList label="Wallet trade history" count={trades.length} layout="table" emptyTitle="No wallet trades." emptyDescription="No trade records are available for this account.">
    <section className="position-table-section" aria-labelledby="trade-history-title">
      <div className="trade-section-heading">
        <div><span className="eyebrow">MY TRADES</span><h3 id="trade-history-title">Wallet-scoped trade history.</h3></div>
        <p>{trades.length} recorded market actions</p>
      </div>
      <div className="position-table-wrap">
        <table className="position-table">
          <caption className="sr-only">Wallet-scoped market trade history</caption>
          <thead><tr><th>Trade</th><th>Outcome</th><th>Amount</th><th>Price</th><th>Proceeds</th><th>Date</th></tr></thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id}>
                <th scope="row"><strong>{trade.side === 'buy' ? 'Buy' : 'Sell'}</strong><small>{trade.marketId}</small></th>
                <td data-label="Outcome"><span className={`outcome-pill outcome-${trade.outcome}`}>{trade.outcome.toUpperCase()}</span></td>
                <td data-label="Amount">{money(trade.amount, 2)}</td>
                <td data-label="Price">{money(trade.price, 2)}</td>
                <td data-label="Proceeds">{money(trade.proceeds, 2)}</td>
                <td data-label="Date"><time dateTime={trade.createdAt}>{new Date(trade.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</time></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    </DataList>
  );
}
