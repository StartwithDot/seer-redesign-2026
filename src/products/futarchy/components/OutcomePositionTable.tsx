import { money } from '../data/format';
import type { OutcomePosition } from '../data/portfolio';
import { DataList } from './DataList';

interface OutcomePositionTableProps {
  positions: OutcomePosition[];
}

export function OutcomePositionTable({ positions }: OutcomePositionTableProps) {
  return (
    <DataList label="Outcome positions" count={positions.length} layout="table" emptyTitle="No active positions." emptyDescription="This account has no outcome pairs recorded in the snapshot.">
    <section className="position-table-section" aria-labelledby="outcome-position-title">
      <div className="trade-section-heading">
        <div><span className="eyebrow">CONDITIONAL TOKENS</span><h3 id="outcome-position-title">Mergeable YES and NO balances.</h3></div>
        <p>Matching pairs can be merged back to collateral after the market resolves.</p>
      </div>
      <div className="position-table-wrap">
        <table className="position-table">
          <caption className="sr-only">Active outcome positions</caption>
          <thead><tr><th>Pair</th><th>YES units</th><th>NO units</th><th>Estimated value</th><th>State</th></tr></thead>
          <tbody>
            {positions.map((position) => (
              <tr key={position.id}>
                <th scope="row"><strong>{position.collateral}</strong><small>{position.marketId}</small></th>
                <td data-label="YES units">{position.yesUnits.toLocaleString('en-US', { maximumFractionDigits: 4 })}</td>
                <td data-label="NO units">{position.noUnits.toLocaleString('en-US', { maximumFractionDigits: 4 })}</td>
                <td data-label="Estimated value">{money(position.yesValue + position.noValue, 2)}</td>
                <td data-label="State"><span className={`availability ${position.mergeable ? 'is-ready' : 'is-waiting'}`}>{position.mergeable ? 'Mergeable' : 'Partial pair'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    </DataList>
  );
}
