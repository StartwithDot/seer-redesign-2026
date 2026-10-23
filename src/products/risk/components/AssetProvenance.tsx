import { useState } from 'react';
import { chainAddressUrl, marketEntities, SAVED_MARKET } from '../data/entities';
import { profileFor } from '../data/profiles';
import type { AssetRecord } from '../data/types';
import { ArrowUpRight } from './Icons';
import { EntityInspector } from './EntityInspector';
import { OracleProvenance } from './OracleProvenance';

export function AssetProvenance({ asset }: { asset: AssetRecord }) {
  const [message, setMessage] = useState('');
  const profile = profileFor(asset.ticker);
  const copy = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); setMessage(`${label} copied`); }
    catch { setMessage('Clipboard unavailable. Select and copy the displayed address or URL.'); }
  };
  const canonical = `${window.location.origin}/risk/asset/${asset.id}`;
  const share = async (url: string, label: string) => {
    if (!navigator.share) { await copy(url, label); return; }
    try { await navigator.share({ title: `${asset.ticker} · Seer Risk`, url }); setMessage(`${label} shared`); }
    catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) setMessage('Sharing unavailable. Use the copy link action.'); }
  };
  return <section className="risk-dossier-section">
    <h3>Contracts and provenance</h3>
    <div className="risk-provenance-links">
      <button type="button" className="risk-inline-button" onClick={() => void copy(canonical, 'Asset link')}>Copy asset link</button>
      <button type="button" className="risk-inline-button" onClick={() => void share(canonical, 'Asset link')}>Share asset</button>
      <button type="button" className="risk-inline-button" onClick={() => void copy(asset.marketUrl, 'Market link')}>Copy market link</button>
      <button type="button" className="risk-inline-button" onClick={() => void share(asset.marketUrl, 'Market link')}>Share market</button>
    </div>
    <p className="risk-copy-feedback" role="status">{message}</p>
    <OracleProvenance />
    <label className="risk-canonical-link">Canonical asset link<input readOnly value={canonical} onFocus={(event) => event.target.select()} /></label>
    <label className="risk-canonical-link">Seer market link<input readOnly value={asset.marketUrl} onFocus={(event) => event.target.select()} /></label>
    {profile?.address ? <div className="risk-contract-row"><span>Ethereum contract</span><a href={chainAddressUrl(profile.address, 'ethereum')} title={profile.address} target="_blank" rel="noreferrer">{profile.address.slice(0, 8)}…{profile.address.slice(-6)} <ArrowUpRight /></a><button className="risk-inline-button" type="button" onClick={() => void copy(profile.address!, 'Contract')}>Copy</button></div> : <p>Ethereum contract not published in the saved profile.</p>}
    <details className="risk-entity-disclosure" open={new URLSearchParams(window.location.search).has('entity') || undefined}><summary>Market entities · Gnosis Chain</summary>
      <p>{SAVED_MARKET.marketName}</p>
      <p>{SAVED_MARKET.hasAnswers ? 'Oracle answer recorded' : 'No oracle answer recorded'} · {SAVED_MARKET.questionsInArbitration} questions in arbitration</p>
      <EntityInspector entities={marketEntities(asset.ticker)} onCopy={copy} />
      <p>Parent collection: none (root market). No dispute record is present in this snapshot.</p>
    </details>
  </section>;
}
