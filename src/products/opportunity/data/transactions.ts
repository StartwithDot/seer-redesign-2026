import { addressWord } from './contractRpc';
import type { WalletProvider } from './wallet';

export interface WalletTransaction { to: string; data: string; label: string }
export interface ConfirmedTransaction {
  hash: string;
  block: string;
  account: string;
  to: string;
  label: string;
  confirmedAt: string;
}
export interface TransactionState {
  status: 'idle' | 'confirming' | 'pending' | 'success' | 'rejected' | 'failed';
  hash: string | null; message: string | null; label: string | null; account: string | null;
}
export class ReceiptPending extends Error {}
export async function verifyWalletSession(provider: WalletProvider, account: string) {
  addressWord(account);
  const [accounts, chain] = await Promise.all([
    provider.request({ method: 'eth_accounts' }), provider.request({ method: 'eth_chainId' }),
  ]);
  if (!Array.isArray(accounts) || typeof accounts[0] !== 'string' || accounts[0].toLowerCase() !== account.toLowerCase()) throw new Error('Wallet account changed. Reconnect and review again.');
  if (typeof chain !== 'string' || chain.toLowerCase() !== '0x64') throw new Error('Switch to Gnosis Chain before continuing.');
}
export async function submitWalletTransaction(provider: WalletProvider, account: string, transaction: WalletTransaction) {
  addressWord(transaction.to);
  if (!/^0x(?:[0-9a-f]{2})+$/i.test(transaction.data)) throw new Error('Invalid transaction data.');
  await verifyWalletSession(provider, account);
  const args = { from: account, to: transaction.to, data: transaction.data, value: '0x0' };
  // Simulate and estimate before opening the wallet confirmation.
  await provider.request({ method: 'eth_call', params: [args, 'latest'] });
  const gas = await provider.request({ method: 'eth_estimateGas', params: [args] });
  if (typeof gas !== 'string' || !/^0x[0-9a-f]+$/i.test(gas) || BigInt(gas) <= 0n) throw new Error('Gas estimate unavailable.');
  const [price, balance] = await Promise.all([
    provider.request({ method: 'eth_gasPrice' }), provider.request({ method: 'eth_getBalance', params: [account, 'latest'] }),
  ]);
  if (typeof price !== 'string' || !/^0x[0-9a-f]+$/i.test(price) || typeof balance !== 'string' || !/^0x[0-9a-f]+$/i.test(balance)) throw new Error('Network fee balance unavailable.');
  if (BigInt(balance) < BigInt(gas) * BigInt(price)) throw new Error('Insufficient xDAI for network fees.');
  await verifyWalletSession(provider, account);
  const hash = await provider.request({ method: 'eth_sendTransaction', params: [{ ...args, gas }] });
  if (typeof hash !== 'string' || !/^0x[0-9a-f]{64}$/i.test(hash)) throw new Error('Wallet returned an invalid transaction hash.');
  return hash;
}
export async function readTransactionReceipt(provider: WalletProvider, hash: string, expected?: { account: string; to: string }): Promise<{ block: string } | null> {
  if (!/^0x[0-9a-f]{64}$/i.test(hash)) throw new Error('Invalid transaction hash.');
  const receipt = await provider.request({ method: 'eth_getTransactionReceipt', params: [hash] });
  if (receipt === null) return null;
  if (typeof receipt !== 'object' || !receipt || !('transactionHash' in receipt) || !('status' in receipt) || !('blockNumber' in receipt)) throw new ReceiptPending('Receipt is unavailable. Check again.');
  if (typeof receipt.transactionHash !== 'string' || receipt.transactionHash.toLowerCase() !== hash.toLowerCase()) throw new ReceiptPending('Receipt hash does not match.');
  if (expected && (!('from' in receipt) || !('to' in receipt) || typeof receipt.from !== 'string' || typeof receipt.to !== 'string' ||
    receipt.from.toLowerCase() !== expected.account.toLowerCase() || receipt.to.toLowerCase() !== expected.to.toLowerCase())) {
    throw new ReceiptPending('Receipt account or contract does not match the reviewed transaction.');
  }
  if (receipt.status === '0x0') throw new Error('Transaction reverted on-chain.');
  if (receipt.status !== '0x1' || typeof receipt.blockNumber !== 'string' || !/^0x[0-9a-f]+$/i.test(receipt.blockNumber)) throw new ReceiptPending('Transaction has no confirmed receipt yet.');
  return { block: receipt.blockNumber };
}
