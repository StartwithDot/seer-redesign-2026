import { useEffect, useRef, useState } from 'react';
import type { Market } from '../types';
import type { WalletController } from '../hooks/useWallet';
import { getInjectedProvider } from '../data/wallet';
import { completeSetBalance, exactTokenUnits, readPositionBalances, type PositionSnapshot } from '../data/positionBalances';
import { chainById } from '../data/chains';
import { getAddressExplorer } from '../data/externalLinks';
import { CopyButton } from './CopyButton';

export function WalletPositionInspector({ market, wallet, onOpenWallet }: { market: Market; wallet: WalletController; onOpenWallet: () => void }) {
  const [snapshot, setSnapshot] = useState<PositionSnapshot | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const version = useRef(0);
  const account = wallet.account;
  const key = `${market.id}:${account?.address}:${wallet.chainId}:${account?.id}`;
  const [snapshotKey, setSnapshotKey] = useState('');
  useEffect(() => {
    version.current += 1;
    setSnapshot(null); setPending(false); setError('');
    return () => { version.current += 1; };
  }, [key]);
  const eligible = account && !account.id.startsWith('demo-') && wallet.chainId === market.chainId;
  const visible = snapshotKey === key ? snapshot : null;
  const read = async () => {
    const provider = getInjectedProvider();
    if (!provider || !eligible) return;
    const generation = ++version.current;
    setPending(true); setError(''); setSnapshot(null);
    try {
      const result = await readPositionBalances(provider, market, account.address);
      if (generation === version.current) { setSnapshot(result); setSnapshotKey(key); }
    } catch (reason) {
      if (generation === version.current) setError(reason instanceof Error ? reason.message : 'Holdings unavailable. Retry your wallet connection.');
    } finally { if (generation === version.current) setPending(false); }
  };
  return <details className="record-disclosure wallet-position-inspector"><summary>Your outcome holdings</summary>
    <p>Read collateral and wrapped-token balances from your browser wallet at one block. This does not request a signature.</p>
    {!account ? <button className="secondary-button full-button" type="button" onClick={onOpenWallet}>Connect to read holdings</button> : account.id.startsWith('demo-') ? <><p>Preview accounts cannot read live positions.</p><button className="secondary-button full-button" type="button" onClick={onOpenWallet}>Choose a browser wallet</button></> : wallet.chainId !== market.chainId ? <button className="secondary-button full-button" type="button" onClick={() => void wallet.switchChain(chainById(market.chainId))}>Switch to {chainById(market.chainId).name}</button> : <button className="secondary-button full-button" type="button" disabled={pending} aria-busy={pending} onClick={() => void read()}>{pending ? 'Reading holdings…' : visible ? 'Refresh holdings' : 'Read holdings'}</button>}
    {error && <p role="alert" className="notice error-notice">{error}</p>}
    {visible && <div role="status"><p>Block {BigInt(visible.block).toString()} · {visible.account.slice(0, 6)}…{visible.account.slice(-4)}</p>
      <dl className="quote-metrics">{[visible.collateral, ...visible.holdings].map((holding) => {
        const value = holding.raw === null || holding.decimals === null ? null : exactTokenUnits(holding.raw, holding.decimals);
        return <div key={holding.outcomeId}><dt>{holding.outcomeId === 'collateral' ? `Collateral · ${market.collateralSymbol}` : market.outcomes.find((outcome) => outcome.id === holding.outcomeId)?.name}{holding.address && <a href={getAddressExplorer(chainById(market.chainId), holding.address)} target="_blank" rel="noreferrer" aria-label={`Inspect ${holding.outcomeId === 'collateral' ? 'collateral' : 'outcome'} token contract`}> ↗</a>}</dt><dd>{value === null ? 'Read unavailable' : <><span className="position-exact-value">{value} {holding.outcomeId === 'collateral' ? market.collateralSymbol : 'shares'}</span><CopyButton value={value} label="Copy exact holding" /></>}</dd></div>;
      })}<div><dt>Smallest balance across all outcomes</dt><dd><span className="position-exact-value">{completeSetBalance(visible.holdings) ?? 'Unavailable'}</span></dd></div></dl>
      {[visible.collateral, ...visible.holdings].some((holding) => holding.raw === null) && <p>Some token reads failed. Refresh to retry; unavailable balances are never treated as zero.</p>}
      <p>Outcome holdings include only wrapped tokens. Collateral balances do not imply an approval or an executable mint quote. Unwrapped Conditional Tokens positions and cost basis are unavailable. The smallest balance is an inventory measure; merge eligibility and collateral output still require verified contract reads. Holdings may change after this block.</p>
      {market.parent && <p>Collateral is the parent outcome token. Its cash value depends on the parent result.</p>}
    </div>}
  </details>;
}
