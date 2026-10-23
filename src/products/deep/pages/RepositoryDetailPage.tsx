import { useEffect, useState } from 'react';
import { Icon } from '../components/Icons';
import { ProvenanceDrawer } from '../components/ProvenanceDrawer';
import { PriceHistoryChart, RepositoryInspector } from '../components/RepositoryInspector';
import { MarketTechnicalDrawer } from '../components/MarketTechnicalDrawer';
import { findRepository } from '../data/repositories';
import { navigateDeep } from '../state/router';

export function RepositoryDetailPage({ owner, repoName }: { owner: string; repoName: string }) {
  const repository = findRepository(owner, repoName);
  const [provenanceOpen, setProvenanceOpen] = useState(false);
  const [technicalOpen, setTechnicalOpen] = useState(false);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || document.querySelector('.deep-dialog-layer')) return;
      event.preventDefault();
      navigateDeep('/deep');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  if (!repository) {
    return (
      <section className="deep-page deep-state-page">
        <p className="deep-eyebrow">Not found</p>
        <h1>Repository market not found</h1>
        <button className="deep-button deep-button--primary" type="button" onClick={() => navigateDeep('/deep')}>Back to the field</button>
      </section>
    );
  }

  return (
    <section className="deep-page deep-repo-page">
      <header className="deep-repo-header">
        <nav className="deep-breadcrumb" aria-label="Repository breadcrumb">
          <button className="deep-back" type="button" onClick={() => navigateDeep('/deep')}><Icon name="arrow" /> Field</button>
          <span aria-hidden="true">/</span>
          <span>Round 3</span>
          <span aria-hidden="true">/</span>
          <strong>{repository.owner}/{repository.name}</strong>
        </nav>
        <div className="deep-repo-header__identity">
          <span className="deep-avatar deep-avatar--large">
            <span>{repository.owner.slice(0, 2).toUpperCase()}</span>
            <img src={`https://github.com/${repository.owner}.png?size=96`} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          </span>
          <div>
            <p className="deep-eyebrow">Round 3 · Originality · {repository.marketStatus} market</p>
            <h1>{repository.owner}/{repository.name}</h1>
            <p>{repository.group} · <code>{repository.marketId}</code></p>
          </div>
        </div>
        <div className="deep-repo-header__actions">
          <button className="deep-button" type="button" onClick={() => setTechnicalOpen(true)}>Pool data <Icon name="arrow" /></button>
          <button className="deep-button deep-button--primary" type="button" onClick={() => setProvenanceOpen(true)}>Protocol provenance <Icon name="arrow" /></button>
        </div>
      </header>
      <RepositoryInspector repository={repository} />
      <PriceHistoryChart repository={repository} />
      <ProvenanceDrawer repository={repository} open={provenanceOpen} onClose={() => setProvenanceOpen(false)} />
      <MarketTechnicalDrawer repository={repository} open={technicalOpen} onClose={() => setTechnicalOpen(false)} />
    </section>
  );
}
