import { externalLinks } from '../data/externalLinks';
import { formatCompactMoney, formatDate, formatToken } from '../lib/format';
import type { Market } from '../types';
import { Dialog } from './Dialog';

interface AddLiquidityDialogProps {
  open: boolean;
  market: Market;
  onClose: () => void;
}

export function AddLiquidityDialog({ open, market, onClose }: AddLiquidityDialogProps) {
  return (
    <Dialog
      open={open}
      title="Add liquidity"
      description={`Provide balanced depth to the ${market.subject} outcome pool and review the external Swapr action before signing.`}
      className="add-liquidity-dialog"
      onClose={onClose}
    >
      <div className="liquidity-dialog-content">
        <div className="liquidity-dialog-metrics">
          <div><span>Current liquidity</span><strong>{formatCompactMoney(market.liquidity)}</strong></div>
          <div><span>Swapr pool rate</span><strong>{market.provenance.origin === 'captured-api' ? 'Fee unavailable in capture' : '0.30% swap fee · sample'}</strong></div>
          <div>
            <span>Reward state</span>
            <strong>{market.reward ? Date.parse(market.reward.endsAt) <= Date.parse(market.provenance.capturedAt) ? `${market.reward.token} rewards ended` : `${market.reward.token} active · sample` : 'No active farming rewards'}</strong>
            {market.reward && <small>{formatToken(market.reward.remaining, market.reward.token)} remains until {formatDate(market.reward.endsAt)}</small>}
          </div>
        </div>
        <p>
          Liquidity providers can earn swap fees and any listed farming reward. Impermanent loss remains possible when outcome prices move.
        </p>
        <div className="dialog-actions">
          <button className="secondary-button" type="button" onClick={onClose}>Return</button>
          <a className="secondary-button" href={externalLinks.docs} target="_blank" rel="noreferrer">Learn more ↗</a>
          <a className="primary-button" href={externalLinks.swapr} target="_blank" rel="noreferrer">Open Swapr action ↗</a>
        </div>
      </div>
    </Dialog>
  );
}
