import type { MarketRecord } from '../data/types';

interface BoardCoverageProps {
  market: MarketRecord;
}

export function BoardCoverage({ market }: BoardCoverageProps) {
  if (!market.signal) return <section className="board-coverage" aria-labelledby="coverage-heading"><h2 id="coverage-heading">Odds coverage</h2><p className="coverage-empty">No priced signal in this saved record. Explore the submissions for decision evidence.</p></section>;
  const coverage = [
    { label: 'Top 3', value: market.coverage.top3Percent },
    { label: 'Top 8', value: market.coverage.top8Percent },
    { label: 'Top 27', value: market.coverage.top27Percent },
  ];
  return (
    <section className="board-coverage" aria-labelledby="coverage-heading">
      <div>
        <p className="section-kicker">Coverage readout</p>
        <h2 id="coverage-heading">Odds captured by the leading submissions</h2>
      </div>
      <div className="coverage-readouts">
        {coverage.map((item) => (
          <div key={item.label}>
            <div><span>{item.label}</span><strong>{item.value.toFixed(1)}%</strong></div>
            <progress value={item.value} max={100} aria-label={`${item.label} odds captured`} />
            <small>odds captured</small>
          </div>
        ))}
      </div>
    </section>
  );
}
