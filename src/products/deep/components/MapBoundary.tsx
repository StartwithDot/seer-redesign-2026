import { Component, type ReactNode } from 'react';

export class MapBoundary extends Component<{ children: ReactNode; onTable: () => void }, { failed: boolean; attempt: number }> {
  state = { failed: false, attempt: 0 };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="deep-resource-state" role="alert">
      <strong>The wallet map could not be drawn.</strong>
      <p>Your filters are preserved. Retry the map or use the accessible table.</p>
      <button className="deep-button" type="button" onClick={() => this.setState(state => ({ failed: false, attempt: state.attempt + 1 }))}>Retry map</button>
      <button className="deep-button" type="button" onClick={this.props.onTable}>Use table</button>
    </div>;
    return <div key={this.state.attempt}>{this.props.children}</div>;
  }
}
