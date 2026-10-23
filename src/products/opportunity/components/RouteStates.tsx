import { Component, useEffect, useState, type ReactNode } from 'react';

export function RouteStatus({ kind, onRecover }: { kind: 'loading' | 'not-found' | 'error'; onRecover?: () => void }) {
  return <section className="route-status" aria-busy={kind === 'loading'}>
    <p className="section-kicker">Opportunity Markets</p>
    <h1>{kind === 'loading' ? 'Opening your workspace…' : kind === 'not-found' ? 'This page could not be found.' : 'This workspace could not open.'}</h1>
    <p role={kind === 'error' ? 'alert' : 'status'}>{kind === 'loading' ? 'Loading the tools and available market evidence.' : kind === 'not-found' ? 'Check the address or return to the opportunity board.' : 'Your saved review preferences are retained. Retry to reload this view.'}</p>
    {onRecover && <button type="button" className="primary-action" onClick={onRecover}>{kind === 'not-found' ? 'Return to board' : 'Retry workspace'}</button>}
  </section>;
}

export class RouteBoundary extends Component<{ children: ReactNode }, { failed: boolean; attempt: number }> {
  state = { failed: false, attempt: 0 };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <RouteStatus kind="error" onRecover={() => this.setState(s => ({ failed: false, attempt: s.attempt + 1 }))} /> : <div key={this.state.attempt}>{this.props.children}</div>;
  }
}

export function OfflineNotice() {
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => { window.removeEventListener('online', sync); window.removeEventListener('offline', sync); };
  }, []);
  return offline ? <aside className="offline-notice" role="status"><strong>You are offline.</strong> Stored market snapshots remain available. Wallet and external services require a connection.<button type="button" onClick={() => setOffline(!navigator.onLine)}>Check connection</button></aside> : null;
}
