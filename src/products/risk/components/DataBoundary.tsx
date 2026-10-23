import { Component, Suspense, useState, type ReactNode, type ErrorInfo } from 'react';
import { Modal } from './Modal';

type View = 'assets' | 'history' | 'details' | 'submission';
export function DataSkeleton({ view }: { view: View }) {
  return <div className={`risk-data-skeleton is-${view}`} role="status" aria-live="polite" aria-busy="true">
    <span>Loading {view === 'submission' ? 'prediction workspace' : view}…</span>
    <div aria-hidden="true">{Array.from({ length: view === 'history' ? 4 : 6 }, (_, index) => <i key={index} />)}</div>
  </div>;
}

export class LoadBoundary extends Component<{ children: ReactNode; onRetry: () => void; view: View; onClose?: () => void }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  componentDidCatch(_error: Error, _info: ErrorInfo) { /* Render the recovery surface; never replace data with invented values. */ }
  render() {
    if (this.state.error) {
      const error = <section className="risk-data-error" role="alert">
      <h3>Could not display {this.props.view === 'submission' ? 'the prediction workspace' : this.props.view}.</h3>
      <p>Your saved estimates and selection are preserved. Retry loading this view, or reload the page if the application was updated.</p>
      <button type="button" className="risk-secondary-button" onClick={this.props.onRetry}>Retry this view</button>
      <button type="button" className="risk-text-button" onClick={() => window.location.reload()}>Reload page</button>
      </section>;
      return this.props.view === 'details' && this.props.onClose ? <Modal open label="Asset loading error" onClose={this.props.onClose} className="risk-loading-drawer">{error}</Modal> : error;
    }
    return this.props.children;
  }
}

// Re-create the lazy component on retry so a rejected chunk promise is not cached forever.
export function DataBoundary({ children, view, onClose }: { children: (attempt: number) => ReactNode; view: View; onClose?: () => void }) {
  const [attempt, setAttempt] = useState(0);
  const skeleton = <DataSkeleton view={view} />;
  const fallback = view === 'details' && onClose ? <Modal open label="Loading asset dossier" onClose={onClose} className="risk-loading-drawer">{skeleton}</Modal> : skeleton;
  return <LoadBoundary key={attempt} view={view} onClose={onClose} onRetry={() => setAttempt((current) => current + 1)}>
    <Suspense fallback={fallback}>{children(attempt)}</Suspense>
  </LoadBoundary>;
}
