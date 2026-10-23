import { formatAmount } from '../data/trading';
import { useTradeState } from '../state/TradeState';
import { Dialog } from './Dialog';
import { Icon } from './Icons';

export function SellAllDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { holdings, portfolioValue, sellAll } = useTradeState();
  const activeHoldings = holdings.filter((holding) => holding.up > 0 || holding.down > 0).length;
  const estimatedProceeds = NaN;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Sell all market holdings?"
      description="Review liquidity and gas risks before submitting any market sale."
    >
      <div className="deep-confirm-body">
        <dl>
          <div><dt>Markets</dt><dd>{activeHoldings}</dd></div>
          <div><dt>Estimated proceeds</dt><dd>{formatAmount(estimatedProceeds)}</dd></div>
          <div><dt>Executable quote</dt><dd>Unavailable</dd></div>
        </dl>
        <div className="deep-notice" role="status">
          <strong>Partial-liquidity warning</strong>
          <span>Large outcome positions can execute below the displayed market price when local liquidity is thin.</span>
        </div>
        <div className="deep-notice deep-notice--quiet" role="status">
          <strong>Gas warning</strong>
          <span>An on-chain sell-all operation can require multiple approvals and market exits. No verified sale adapter is available. Gas cannot be estimated.</span>
        </div>
        <div className="deep-confirm-actions">
          <button className="deep-button" type="button" onClick={onClose}>Cancel</button>
          <button
            className="deep-button deep-button--primary"
            type="button"
            disabled
            title="A verified trade-wallet address, transaction adapter and executable sale quote are required"
            onClick={() => {
              sellAll();
              onClose();
            }}
          >
            Sell All to sUSDS <Icon name="arrow" />
          </button>
        </div>
      </div>
    </Dialog>
  );
}
