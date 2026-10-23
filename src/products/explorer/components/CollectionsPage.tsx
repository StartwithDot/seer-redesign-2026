import { useState } from 'react';
import { getMarketById, marketCollections } from '../data/markets';
import { useCollectionSession } from '../hooks/useCollectionSession';
import { useSavedMarkets } from '../hooks/useSavedMarkets';
import type { WalletController } from '../hooks/useWallet';
import type { Market } from '../types';
import { MarketCard } from './MarketCard';

interface CollectionsPageProps {
  collectionId: string;
  navigate: (hash: string) => void;
  onQuickBuy: (market: Market, outcomeId?: string) => void;
  wallet: WalletController;
  onOpenWallet: () => void;
}

export function CollectionsPage({ collectionId, navigate, onQuickBuy, wallet, onOpenWallet }: CollectionsPageProps) {
  const session = useCollectionSession(wallet);
  const { savedMarkets, toggleSaved, storageError } = useSavedMarkets();
  const [page, setPage] = useState(1);
  const collection = marketCollections.find((item) => item.id === collectionId);
  const personal = collectionId === 'default';
  const identifiers = personal ? [...savedMarkets] : collection?.marketIds ?? [];
  const visibleMarkets = identifiers.map(getMarketById).filter((market): market is Market => Boolean(market));
  const unavailable = identifiers.length - visibleMarkets.length;
  const pages = Math.max(1, Math.ceil(visibleMarkets.length / 4));
  const currentPage = Math.min(page, pages);
  return <section className="collections-page" data-align="container">
    <div className="page-title-row"><div><p className="eyebrow">Your collection</p><h1>{personal ? 'Saved markets' : collection?.name}</h1><p>{visibleMarkets.length} saved {visibleMarkets.length === 1 ? 'market' : 'markets'} · Stored in this browser, shared across tabs.</p></div><button className="secondary-button" type="button" onClick={() => navigate('#/markets')}>Find more markets</button></div>
    <aside className="collection-signin" aria-label="Collection account">
      <div><strong>{wallet.account ? session.state === 'signed' ? 'Local session open' : 'Sign in to your collection' : 'Keep a question close.'}</strong><p>{wallet.account ? 'Sign a message to open a local account session. Server sync is unavailable. Your saved markets are always available in the browser preview below.' : 'Connect to inspect account sign-in. You can save and browse markets locally without signing.'}</p></div>
      <button className="secondary-button" type="button" disabled={session.state === 'signing' || session.state === 'signed'} onClick={wallet.account ? session.signIn : onOpenWallet}>{wallet.account ? session.state === 'signing' ? 'Awaiting signature…' : session.state === 'signed' ? 'Signed in locally' : 'Sign in' : 'Connect account'}</button>
    </aside>
    {session.message && <p role={session.state === 'rejected' ? 'alert' : 'status'} className="notice">{session.message}</p>}
    {storageError && <p role="alert" className="notice">{storageError}</p>}
    {unavailable > 0 && <p role="status">{unavailable} saved {unavailable === 1 ? 'market is' : 'markets are'} outside this sample. Your saved identifiers are preserved.</p>}
    {visibleMarkets.length ? <div className="collection-grid">{visibleMarkets.slice((currentPage - 1) * 4, currentPage * 4).map((market) => <MarketCard key={market.id} market={market} saved={savedMarkets.has(market.id)} onOpen={(selected) => navigate(`#/markets/${selected.chainId}/${selected.slug}`)} onQuickBuy={onQuickBuy} onToggleSaved={toggleSaved} />)}</div> : <div className="empty-state"><span className="empty-glyph" aria-hidden="true">☆</span><h2>Your collection is empty</h2><p>Star a market on the board or its record. It will appear here.</p><button className="primary-button" type="button" onClick={() => navigate('#/markets')}>Browse markets</button></div>}
    {pages > 1 && <nav className="pagination" aria-label="Collection pages"><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button><span>Page {currentPage} of {pages}</span><button type="button" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Next</button></nav>}
  </section>;
}
