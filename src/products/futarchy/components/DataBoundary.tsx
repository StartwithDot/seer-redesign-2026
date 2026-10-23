import { Component, useState, type ReactNode } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { ListLoading, ListNotice } from './ListState';

export class DataBoundary extends Component<{ children: ReactNode; label?: string; onRetry?: () => void | Promise<void> }, { failed: boolean; attempt: number }> {
  state = { failed: false, attempt: 0 };
  static getDerivedStateFromError() { return { failed: true }; }
  retry = () => {
    void this.props.onRetry?.();
    this.setState(state => ({ failed: false, attempt: state.attempt + 1 }));
  };
  render() {
    return this.state.failed
      ? <ListNotice title={`${this.props.label || 'This view'} could not load.`} description="Try loading the view again." action={this.retry} error />
      : <div key={this.state.attempt}>{this.props.children}</div>;
  }
}

export function ConnectionBanner() {
  const online = useOnlineStatus();
  const [checked, setChecked] = useState(0);
  return online ? null : <div className="futarchy-state-banner" id="futarchy-connection-status" role="status">
    <span>You’re offline. Stored research remains readable; wallet requests need a connection.</span>
    <button className="quiet-button" type="button" onClick={() => setChecked(value => value + 1)}>Check connection</button>
    {checked > 0 && <span key={checked}>Still offline. The view reconnects automatically when your browser is online.</span>}
  </div>;
}

export function ViewLoading() { return <ListLoading label="market index" layout="signal" rows={3} />; }
