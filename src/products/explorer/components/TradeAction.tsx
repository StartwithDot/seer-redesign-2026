import { useEffect, useState } from 'react';
import { chainById } from '../data/chains';
import type { WalletController } from '../hooks/useWallet';
import type { Market } from '../types';

interface Props {
  market: Market;
  wallet: WalletController;
  valid: boolean;
  invalidLabel?: string;
  insufficient?: boolean;
  action: string;
  unavailable?: string;
  onOpenWallet: () => void;
}

export function TradeAction({ market, wallet, valid, invalidLabel, insufficient, action, unavailable, onOpenWallet }: Props) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => { setMessage(''); setPending(false); }, [market.id, wallet.account?.address, wallet.chainId, action, valid, insufficient]);
  const reporting = action === 'Answer';
  const closed = action === 'Redeem' ? market.status !== 'resolved' : reporting ? market.marketState !== 'reports-open' : market.status !== 'open';
  const wrongChain = Boolean(wallet.account && wallet.chainId !== market.chainId);
  const label = closed ? action === 'Redeem' ? 'Settlement not complete' : reporting ? 'Reporting not open' : 'Market closed' : !wallet.account ? 'Connect to continue' : wrongChain
    ? `Switch to ${chainById(market.chainId).name}` : !valid ? invalidLabel ?? 'Enter an amount' : insufficient
      ? 'Not enough balance' : pending ? 'Checking request…' : action;
  const run = async () => {
    setMessage('');
    if (!wallet.account) return onOpenWallet();
    if (wrongChain) {
      await wallet.switchChain(chainById(market.chainId));
      return;
    }
    setPending(true);
    await new Promise((resolve) => window.setTimeout(resolve, 420));
    if (wallet.account.id.startsWith('demo-')) wallet.rejectSigning();
    setMessage(unavailable ?? (market.provenance.origin === 'captured-api' ? 'Request rejected safely: this saved record has no executable quote or verified allowance. No signature or transaction was created. Open the live Seer app to trade.' : 'Preview request rejected safely: sample market data cannot be submitted on-chain. No signature or transaction was created. Open the live Seer app to continue.'));
    setPending(false);
  };
  return <>
    <button className="primary-button full-button" type="button" aria-busy={pending} title={!valid && invalidLabel ? invalidLabel : undefined} disabled={closed || pending || Boolean(wallet.account && !wrongChain && (!valid || insufficient))} onClick={run}>{label}</button>
    {message && <p className="notice error-notice" role="alert">{message}</p>}
  </>;
}
