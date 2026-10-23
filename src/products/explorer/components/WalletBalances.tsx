import type { WalletController } from '../hooks/useWallet';
import { walletTokens } from '../data/walletTokens';
import { chainById } from '../data/chains';
import { getAddressExplorer } from '../data/externalLinks';
import { formatToken } from '../lib/format';

export function WalletBalances({ wallet }: { wallet: WalletController }) {
  const account = wallet.account;
  if (!account) return null;
  const balances = account.tokenBalances.filter((item) => item.chainId === wallet.chainId);
  return <section className="wallet-token-balances" aria-label="Token balances">
    <div className="data-section-heading"><strong>Token balances</strong>
      {!account.id.startsWith('demo-') && <button className="secondary-button" type="button" disabled={wallet.status === 'connecting'} onClick={() => void wallet.refreshBalances()}>Refresh balances</button>}
    </div>
    <dl>{balances.map((item) => <div key={item.symbol}><dt>{item.source === 'wallet' && walletTokens.find((token) => token.chainId === wallet.chainId && token.symbol === item.symbol) ? <a href={getAddressExplorer(chainById(wallet.chainId), walletTokens.find((token) => token.chainId === wallet.chainId && token.symbol === item.symbol)!.address)} target="_blank" rel="noreferrer">{item.symbol} contract ↗</a> : item.symbol}<small>{item.source === 'sample' ? 'Sample balance' : 'Wallet read'}</small></dt><dd>{formatToken(item.value, item.symbol)}</dd></div>)}</dl>
    <p>Unlisted collateral balances are unavailable. Native coins and collateral tokens are separate assets.</p>
    <p>Account name: {account.reverseName ?? 'No verified reverse lookup available'}</p>
  </section>;
}
