import { lazy, useMemo, type ComponentProps } from 'react';
import { DataBoundary } from './DataBoundary';
import type { AssetExplorer } from './AssetExplorer';
import type { AssetDossier } from './AssetDetails';
import type { HistoryDashboard } from './HistoryDashboard';
import type { PredictionDesk } from './PredictionDesk';

type ViewProps = {
  assets: ComponentProps<typeof AssetExplorer>;
  history: ComponentProps<typeof HistoryDashboard>;
  details: ComponentProps<typeof AssetDossier>;
  submission: ComponentProps<typeof PredictionDesk>;
};

function AssetView({ attempt, props }: { attempt: number; props: ViewProps['assets'] }) {
  const View = useMemo(() => lazy(() => import('./AssetExplorer').then((module) => ({ default: module.AssetExplorer }))), [attempt]);
  return <View {...props} />;
}
function HistoryView({ attempt, props }: { attempt: number; props: ViewProps['history'] }) {
  const View = useMemo(() => lazy(() => import('./HistoryDashboard').then((module) => ({ default: module.HistoryDashboard }))), [attempt]);
  return <View {...props} />;
}
function DetailView({ attempt, props }: { attempt: number; props: ViewProps['details'] }) {
  const View = useMemo(() => lazy(() => import('./AssetDetails').then((module) => ({ default: module.AssetDossier }))), [attempt]);
  return <View {...props} />;
}
function PredictionView({ attempt, props }: { attempt: number; props: ViewProps['submission'] }) {
  const View = useMemo(() => lazy(() => import('./PredictionDesk').then((module) => ({ default: module.PredictionDesk }))), [attempt]);
  return <View {...props} />;
}
export function LazyAssetExplorer(props: ViewProps['assets']) {
  return <DataBoundary view="assets">{(attempt) => <AssetView attempt={attempt} props={props} />}</DataBoundary>;
}
export function LazyHistoryDashboard(props: ViewProps['history']) {
  return <DataBoundary view="history">{(attempt) => <HistoryView attempt={attempt} props={props} />}</DataBoundary>;
}
export function LazyAssetDossier(props: ViewProps['details']) {
  return <DataBoundary view="details" onClose={props.onClose}>{(attempt) => <DetailView attempt={attempt} props={props} />}</DataBoundary>;
}
export function LazyPredictionDesk(props: ViewProps['submission']) {
  return <DataBoundary view="submission">{(attempt) => <PredictionView attempt={attempt} props={props} />}</DataBoundary>;
}
