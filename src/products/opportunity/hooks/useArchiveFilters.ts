import { useEffect, useState } from 'react';

export const emptyArchiveFilters = { kind: 'all', sponsor: '', after: '', before: '', minimum: '', outcome: 'all', status: 'all' };
type ArchiveFilters = typeof emptyArchiveFilters;

function read() {
  const params = new URLSearchParams(location.search);
  const filters = { ...emptyArchiveFilters };
  for (const key of Object.keys(filters) as (keyof ArchiveFilters)[]) {
    filters[key] = params.get(`archive_${key}`) ?? filters[key];
  }
  if (!['all', 'contest', 'hiring', 'funding', 'prediction', 'futarchy', 'proposal'].includes(filters.kind)) filters.kind = 'all';
  if (!['all', 'resolved', 'finalized', 'redeemed'].includes(filters.status)) filters.status = 'all';
  if (!['all', 'selected', 'none'].includes(filters.outcome)) filters.outcome = 'all';
  if (!/^\d*$/.test(filters.minimum)) filters.minimum = '';
  for (const key of ['after', 'before'] as const) if (!/^\d{4}-\d{2}-\d{2}$/.test(filters[key])) filters[key] = '';
  return { filters, samples: params.get('archive_samples') === '1' };
}

export function useArchiveFilters() {
  const [state, setState] = useState(read);
  useEffect(() => {
    const restore = () => setState(read());
    addEventListener('popstate', restore);
    return () => removeEventListener('popstate', restore);
  }, []);
  const update = (filters: ArchiveFilters, samples: boolean) => {
    const url = new URL(location.href);
    for (const key of Object.keys(filters) as (keyof ArchiveFilters)[]) {
      if (filters[key] === emptyArchiveFilters[key]) url.searchParams.delete(`archive_${key}`);
      else url.searchParams.set(`archive_${key}`, filters[key]);
    }
    if (samples) url.searchParams.set('archive_samples', '1'); else url.searchParams.delete('archive_samples');
    history.replaceState(history.state, '', url);
    setState({ filters, samples });
  };
  return { ...state, setFilters: (filters: ArchiveFilters) => update(filters, state.samples), setSamples: (samples: boolean) => update(state.filters, samples), reset: () => update({ ...emptyArchiveFilters }, false) };
}
