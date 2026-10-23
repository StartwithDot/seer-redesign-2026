import type { ExplorerRecord } from '../data/types';
import { CanonicalRecordPanel } from './CanonicalRecordPanel';
import { MarketDossierPanel } from './MarketDossierPanel';
import { OverlayDialog } from './OverlayDialog';
import { SubmissionDossierPanel } from './SubmissionDossierPanel';

interface ExplorerRecordDrawerProps {
  record: ExplorerRecord;
  onClose: () => void;
  onOpenRecord: (recordId: string) => void;
}

export function ExplorerRecordDrawer({ record, onClose, onOpenRecord }: ExplorerRecordDrawerProps) {
  return (
    <OverlayDialog
      title={record.label}
      description={`${record.kind} record · ${record.source === 'sample' ? 'deterministic sample' : 'verified source'} · ${record.id}`}
      variant="drawer"
      nonBlocking
      onClose={onClose}
    >
      {record.kind === 'market' && <MarketDossierPanel key={record.id} dossier={record.market} />}
      {(record.kind === 'submission' || record.kind === 'outcome') && (
        <SubmissionDossierPanel dossier={record.submission} recordKind={record.kind} onOpenRecord={onOpenRecord} />
      )}
      {(record.kind === 'creator' || record.kind === 'wallet' || record.kind === 'transaction') && (
        <CanonicalRecordPanel record={record} onOpenRecord={onOpenRecord} />
      )}
    </OverlayDialog>
  );
}
