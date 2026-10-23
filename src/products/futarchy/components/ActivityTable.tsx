import { useLayoutEffect, useRef } from 'react';
import { money, timestamp } from '../data/format';
import type { ActivityTrade } from '../data/activity';
import { DataList } from './DataList';

export function ActivityTable({ trades, freshIds }: { trades: ActivityTrade[]; freshIds: string[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const previous = useRef<string | undefined>(undefined);
  useLayoutEffect(() => {
    const node = scroller.current;
    if (!node) return;
    if (previous.current && previous.current !== trades[0]?.id && node.scrollTop > 4) {
      const anchor = Array.from(node.querySelectorAll<HTMLElement>('tr[data-trade]')).find(row => row.dataset.trade === previous.current);
      if (anchor) node.scrollTop += anchor.offsetTop - (node.querySelector('tbody') as HTMLElement).offsetTop;
    }
    previous.current = trades[0]?.id;
  }, [trades]);
  return <DataList label="Recent market activity" count={trades.length} layout="table" emptyTitle="No trades yet." emptyDescription="Paired YES and NO executions appear here when available."><div ref={scroller} className="position-table-wrap activity-feed" tabIndex={0} aria-label="Scrollable activity replay">
    <table className="position-table activity-table"><caption className="sr-only">Example paired market trades</caption>
      <thead><tr><th>Outcome</th><th>Buy / Sell</th><th>Amount conversion</th><th>Price</th><th>Date</th></tr></thead>
      <tbody>{trades.map(trade => <tr key={trade.id} data-trade={trade.id} className={freshIds.includes(trade.id) ? 'activity-fresh' : ''}>
        <th scope="row"><span className={`outcome-pill outcome-${trade.outcome}`}>{trade.outcome.toUpperCase()}</span></th>
        <td data-label="Buy / Sell">{trade.side === 'buy' ? 'Buy' : 'Sell'}</td><td data-label="Amount conversion"><strong>{money(trade.amount, 2)}</strong><small>{trade.conversion}</small></td><td data-label="Price">{money(trade.price, 2)}</td>
        <td data-label="Date"><time dateTime={trade.createdAt}>{timestamp(trade.createdAt)}</time></td>
      </tr>)}</tbody>
    </table>
  </div></DataList>;
}
