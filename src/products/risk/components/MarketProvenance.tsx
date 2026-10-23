import { SAVED_MARKET, SEER_MARKET_URL } from '../data/entities';
import { ArrowUpRight } from './Icons';
import { Modal } from './Modal';
import { OracleProvenance } from './OracleProvenance';

export function MarketProvenance({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Modal className="risk-drawer risk-resolution-drawer" label="Market resolution provenance" open={open} onClose={onClose}>
    <p className="risk-kicker">Gnosis Chain · saved record</p>
    <h2>Resolution provenance</h2>
    <p>{SAVED_MARKET.marketName}</p>
    <dl className="risk-resolution-status">
      <div><dt>Oracle answers</dt><dd>{SAVED_MARKET.hasAnswers ? 'Recorded' : 'None recorded'}</dd></div>
      <div><dt>Arbitration</dt><dd>{SAVED_MARKET.questionsInArbitration ? `${SAVED_MARKET.questionsInArbitration} pending` : 'No dispute recorded'}</dd></div>
      <div><dt>Payouts</dt><dd>{SAVED_MARKET.payoutReported ? 'Reported on chain' : 'Not reported in this snapshot'}</dd></div>
    </dl>
    <p>Trading has ended. Oracle resolution and payouts are separate on-chain states.</p>
    <OracleProvenance initiallyOpen />
    <div className="risk-provenance-links">
      <a href={SEER_MARKET_URL} target="_blank" rel="noreferrer">Seer market and terms <ArrowUpRight /></a>
      <a href={`https://gnosisscan.io/tx/${SAVED_MARKET.transactionHash}#eventlog`} target="_blank" rel="noreferrer">Question creation events <ArrowUpRight /></a>
    </div>
  </Modal>;
}
