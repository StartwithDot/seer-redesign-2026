import { useState } from 'react';
import { portfolioOperations } from '../data/account';
import { tokenBalance } from '../data/walletBalances';
import { collateralFor, type TradeMode } from '../data/trade';
import type { WalletController } from '../hooks/useWallet';
import type { Market } from '../types';
import { TradeAction } from './TradeAction';

export function AdvancedTrade({ market, mode, wallet, onOpenWallet }: { market: Market; mode: Exclude<TradeMode, 'Trade'>; wallet: WalletController; onOpenWallet: () => void }) {
  const [amount, setAmount] = useState('');
  const valid = amount.trim() !== '' && Number.isFinite(Number(amount)) && Number(amount) > 0;
  const collateral = tokenBalance(wallet.account, market.chainId, collateralFor(market));
  const sampleHolding = wallet.account?.id.startsWith('demo-') ? portfolioOperations.find((item) => item.marketId === market.id) : undefined;
  const available = mode === 'Mint' ? collateral?.value : mode === 'Merge' ? sampleHolding?.completeSets : sampleHolding?.redeemableShares;
  const insufficient = available !== undefined && Number(amount) > available;
  const unit = mode === 'Mint' ? collateralFor(market) : mode === 'Merge' ? 'complete sets' : 'winning shares';
  const description = mode === 'Mint'
    ? 'Deposit collateral to receive a complete set of outcome shares. Minting does not predict a winner.'
    : mode === 'Merge' ? 'Return equal quantities of every outcome share to recover collateral before settlement.'
      : 'After settlement, exchange winning shares for their resolved collateral value. Losing shares have no payout.';
  return <div className="advanced-trade">
    <p>{description}</p>
    <label>Collateral<select defaultValue={collateralFor(market)} disabled title={`${collateralFor(market)} is the only collateral recorded for this market.`}><option>{collateralFor(market)}</option></select></label>
    <label>{mode === 'Mint' ? 'Collateral amount' : 'Complete sets / winning shares'}<input type="number" inputMode="decimal" min="0" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
    <p>Balance: {available === undefined ? 'Complete-set / settlement holdings unavailable' : `${available.toLocaleString()} ${unit}${wallet.account?.id.startsWith('demo-') ? ' · sample' : ''}`}.</p>
    {mode === 'Redeem' && market.status !== 'resolved' ? <p className="notice warning-notice">Settlement is not complete. Redemption is unavailable.</p>
      : <><output>{mode === 'Mint' ? `${valid ? Number(amount).toLocaleString() : '0'} shares for each of ${market.outcomes.filter((outcome) => outcome.id !== 'estimate').length} outcomes` : mode === 'Merge' ? `${valid ? Number(amount).toLocaleString() : '0'} ${collateralFor(market)} estimated collateral` : `${valid ? Number(amount).toLocaleString() : '0'} ${collateralFor(market)} at the recorded settlement value`}</output>
        <TradeAction key={mode} market={market} wallet={wallet} valid={valid && available !== undefined} invalidLabel={valid && available === undefined ? 'Holdings unavailable' : undefined} insufficient={insufficient} action={mode} onOpenWallet={onOpenWallet} unavailable={`${mode} preview rejected safely: executable complete-set contracts and current allowances are not available in this build. No signature or transaction was created.`} /></>}
  </div>;
}
