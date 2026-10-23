import { useEffect, useId, useState } from 'react';
import { repositories } from '../data/repositories';
import { navigateDeep } from '../state/router';
import { Dialog } from './Dialog';
export function CommandSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [index, setIndex] = useState(0);
    const id = useId();
    const results = repositories.filter(r => `${r.owner}/${r.name}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 30);
    useEffect(() => { const listener = (e: KeyboardEvent) => { const target = e.target as HTMLElement; const editing = target.matches('input,textarea,select') || target.isContentEditable; if ((e.key === '/' && !editing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        if (document.querySelector('[aria-modal="true"]'))
            return;
        e.preventDefault();
        setQuery('');
        setIndex(0);
        setOpen(true);
    } }; document.addEventListener('keydown', listener); return () => document.removeEventListener('keydown', listener); }, []);
    const choose = (i: number) => { const r = results[i]; if (!r)
        return; setOpen(false); navigateDeep(`/deep/repo/${encodeURIComponent(r.owner)}/${encodeURIComponent(r.name)}`); };
    return <><button className="deep-button deep-command-trigger" onClick={() => { setQuery(''); setIndex(0); setOpen(true); }}>Search markets, outcomes, or topics… <kbd>/</kbd></button><Dialog open={open} title="Find a repository" onClose={() => setOpen(false)}>
    <input className="deep-command-input" data-dialog-focus role="combobox" aria-label="Search repositories" aria-expanded="true" aria-controls={id} aria-autocomplete="list" aria-activedescendant={results.length ? `${id}-${index}` : undefined} value={query} onChange={e => { setQuery(e.target.value); setIndex(0); }} onKeyDown={e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const next = results.length ? (index + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length : 0;
        setIndex(next);
        document.getElementById(`${id}-${next}`)?.scrollIntoView({ block: 'nearest' });
    } if (e.key === 'Enter') {
        e.preventDefault();
        choose(index);
    } }}/>
    <div className="deep-command-results" id={id} role="listbox" aria-label="Matching repositories">{results.map((r, i) => <div role="option" aria-selected={i === index} id={`${id}-${i}`} key={r.marketId} onMouseDown={e => e.preventDefault()} onMouseEnter={() => setIndex(i)} onClick={() => choose(i)}>{r.owner}/{r.name}<small>UP {r.upPrice.toFixed(4)}</small></div>)}</div>
    {!results.length && <p role="status">No repositories match “{query}”.</p>}<p>↑ ↓ to select · Enter to open · Escape to close</p>
  </Dialog></>;
}
