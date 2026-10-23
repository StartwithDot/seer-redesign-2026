import { useDeepState } from '../state/DeepState';
import { useTradeState } from '../state/TradeState';
import { Icon } from './Icons';

export function GlobalAlerts() {
  const { wallet, dismissWalletError } = useDeepState();
  const {
    tradeWalletStatus,
    tradeWalletNoticeVisible,
    dismissTradeWalletNotice,
  } = useTradeState();

  const alerts = [
    wallet.error ? {
      id: 'wallet',
      tone: 'danger' as const,
      title: 'Wallet connection was not completed',
      message: wallet.error,
      onDismiss: dismissWalletError,
    } : null,
    tradeWalletNoticeVisible && tradeWalletStatus === 'rejected' ? {
      id: 'trade-wallet-rejected',
      tone: 'danger' as const,
      title: 'Trade-wallet request rejected',
      message: 'No verified factory is configured in this build. No wallet signature or deployment was requested.',
      onDismiss: dismissTradeWalletNotice,
    } : null,
    tradeWalletNoticeVisible && tradeWalletStatus === 'unknown' ? {
      id: 'trade-wallet-unknown',
      tone: 'warning' as const,
      title: 'Trade-wallet transaction state UNKNOWN',
      message: 'Deployment could not be verified. Check the transaction on Optimism before retrying.',
      onDismiss: dismissTradeWalletNotice,
    } : null,
  ].filter((alert): alert is NonNullable<typeof alert> => Boolean(alert));

  if (!alerts.length) return null;

  return (
    <aside className="deep-global-alerts" aria-label="Important status alerts" aria-live="assertive">
      {alerts.map((alert) => (
        <div className={`deep-global-alert is-${alert.tone}`} key={alert.id}>
          <Icon name={alert.tone === 'danger' ? 'close' : 'check'} size={16} />
          <div>
            <strong>{alert.title}</strong>
            <span>{alert.message}</span>
          </div>
          <button type="button" onClick={alert.onDismiss}>Dismiss</button>
        </div>
      ))}
    </aside>
  );
}
