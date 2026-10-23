import { useOpportunityWallet } from '../hooks/WalletContext';
import { CopyButton } from './RecordActions';

const statusLabels = {
  confirming: 'Waiting for wallet',
  pending: 'Submitted on-chain',
  success: 'Confirmed',
  rejected: 'Rejected in wallet',
  failed: 'Transaction failed',
} as const;

export function TransactionStatus({ labels }: { labels?: string[] }) {
  const wallet = useOpportunityWallet();
  const transaction = wallet.transaction;
  if (transaction.status === 'idle' || (labels && (!transaction.label || !labels.includes(transaction.label)))) return null;
  const error = transaction.status === 'failed' || transaction.status === 'rejected';
  return <section className={`wallet-transaction wallet-transaction--${transaction.status}`} aria-label="Wallet transaction" aria-live={error ? 'assertive' : 'polite'}>
    <strong>{transaction.label} · {statusLabels[transaction.status]}</strong>
    <p role={error ? 'alert' : 'status'}>{transaction.message}</p>
    {transaction.hash && <div className="gallery-links">
      <a href={`https://gnosisscan.io/tx/${transaction.hash}`} target="_blank" rel="noreferrer">Transaction on Gnosisscan ↗</a>
      <CopyButton value={transaction.hash} label="Copy transaction hash" />
    </div>}
    {transaction.status === 'pending' && <button type="button" className="secondary-action" onClick={() => void wallet.checkReceipt()}>Check confirmation</button>}
  </section>;
}
