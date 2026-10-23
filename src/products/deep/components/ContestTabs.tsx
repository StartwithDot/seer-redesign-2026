import { useEffect, useState } from 'react';
import { activeContest, contests } from '../data/contests';
import { readPreference, writePreference } from '../data/local-preferences';
import { navigateDeep, useDeepPath } from '../state/router';
import { Icon } from './Icons';

type Tab = { id: string; pinned: boolean };
export function ContestTabs() {
  const path = useDeepPath();
  const url = new URL(path, window.location.origin);
  const activeId = url.pathname.split('/contests/')[1] ?? url.searchParams.get('round') ?? activeContest.id;
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const saved = readPreference<unknown>('deep-contest-tabs', null);
    return Array.isArray(saved) ? saved.filter((tab): tab is Tab => tab && typeof tab.pinned === 'boolean' && contests.some(contest => contest.id === tab.id))
      : [{ id: activeContest.id, pinned: true }];
  });
  useEffect(() => {
    if (!contests.some(contest => contest.id === activeId)) return;
    setTabs(current => current.some(tab => tab.id === activeId) ? current : [...current, { id: activeId, pinned: false }]);
  }, [activeId]);
  useEffect(() => { writePreference('deep-contest-tabs', tabs); }, [tabs]);
  return <div className="deep-contest-tabs" role="group" aria-label="Pinned and open contests">
    {tabs.map(tab => {
      const contest = contests.find(contest => contest.id === tab.id);
      if (!contest) return null;
      return <div className={`deep-contest-tab ${activeId === tab.id ? 'is-active' : ''}`} key={tab.id}>
        <button type="button" aria-pressed={activeId === tab.id} onClick={() => navigateDeep(tab.id === activeContest.id ? '/deep' : `/deep/contests/${tab.id}`)}>
          <span className={`deep-status-dot ${contest.status === 'live' ? 'is-online' : 'is-ended'}`} />{contest.name}<small>{contest.status.toUpperCase()}</small>
        </button>
        <button className="deep-icon-button" type="button" aria-pressed={tab.pinned} aria-label={`${tab.pinned ? 'Unpin' : 'Pin'} ${contest.name}`} onClick={() => setTabs(current => current.map(item => item.id === tab.id ? { ...item, pinned: !item.pinned } : item))}><Icon name="pin" size={14} /></button>
        {contest.status === 'ended' && <button className="deep-icon-button" type="button" aria-label={`Close ${contest.name} tab`} disabled={tab.pinned} title={tab.pinned ? 'Unpin this contest before closing' : 'Close this contest tab'} onClick={() => {
          setTabs(current => current.filter(item => item.id !== tab.id));
          if (activeId === tab.id) navigateDeep('/deep');
        }}><Icon name="close" size={14} /></button>}
      </div>;
    })}
  </div>;
}
