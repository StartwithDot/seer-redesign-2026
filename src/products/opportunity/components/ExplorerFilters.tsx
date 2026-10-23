import { useEffect, useState, type ComponentProps } from 'react';
import { ExplorerFilterBar } from './ExplorerFilterBar';
import { OverlayDialog } from './OverlayDialog';
import { useUrlDialog } from '../hooks/useUrlDialog';

export function ExplorerFilters(props: ComponentProps<typeof ExplorerFilterBar>) {
  const [mobile, setMobile] = useState(() => matchMedia('(max-width: 760px)').matches);
  const [filterDialog, setFilterDialog] = useUrlDialog('filters');
  const open = filterDialog === 'open';
  useEffect(() => {
    const query = matchMedia('(max-width: 760px)');
    const change = () => setMobile(query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  if (!mobile) return <ExplorerFilterBar {...props} />;
  return <>
    <button type="button" className="secondary-action mobile-filter-trigger" aria-haspopup="dialog" onClick={() => setFilterDialog('open')}>Search and filter markets</button>
    {open && <OverlayDialog title="Search and filters" description="Changes apply to the results immediately." variant="drawer" onClose={() => setFilterDialog(null)} footer={<button type="button" className="primary-action" onClick={() => setFilterDialog(null)}>Show results</button>}>
      <ExplorerFilterBar {...props} />
    </OverlayDialog>}
  </>;
}
