import { DataActions } from './DataActions';
import { entityHref } from '../data/explorer';
import { timestamp } from '../data/format';
import type { TransactionRecord } from '../data/portfolio';
import { DataList } from './DataList';

interface TransactionLogProps {
  transactions: TransactionRecord[];
}

const statusLabel = { success: 'Success', pending: 'Pending', failed: 'Failed' } as const;

export function TransactionLog({ transactions }: TransactionLogProps) {
  return (
    <DataList label="Transaction status log" count={transactions.length} emptyTitle="No transaction records." emptyDescription="Local action records appear here when available.">
    <section className="transaction-log" aria-labelledby="transaction-log-title">
      <div className="trade-section-heading">
        <div><span className="eyebrow">TRANSACTION LOG</span><h3 id="transaction-log-title">Every step stays visible.</h3></div>
        <p>Local status records mirror the action sequence without claiming an on-chain confirmation.</p>
      </div>
      <ol>
        {transactions.map((transaction) => (
          <li key={transaction.id} className={`is-${transaction.status}`}>
            <header>
              <div><strong>{transaction.action}</strong><time dateTime={transaction.createdAt}>{timestamp(transaction.createdAt)}</time></div>
              <span className={`transaction-status is-${transaction.status}`}>{statusLabel[transaction.status]}</span>
            </header>
            <ol className="transaction-steps">
              {transaction.steps.map((step) => (
                <li key={step.label} className={`is-${step.status}`}><span aria-hidden="true">{step.status === 'success' ? '✓' : step.status === 'failed' ? '×' : step.status === 'pending' ? '•' : '○'}</span><strong>{step.label}</strong><small>{step.status}</small></li>
              ))}
            </ol>
            <footer><span>REFERENCE</span><code>{transaction.reference}</code></footer>
            <DataActions title={`${transaction.action} local status`} reference={transaction.reference} href={`#/m/${transaction.marketId}?drawer=transactions`} />
            <a className="text-link" href={entityHref('wallet', transaction.owner)}>Wallet record ↗</a>
          </li>
        ))}
      </ol>
    </section>
    </DataList>
  );
}
