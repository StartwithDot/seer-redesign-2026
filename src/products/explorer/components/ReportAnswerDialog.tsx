import { useEffect, useState } from 'react';
import type { Market } from '../types';
import type { WalletController } from '../hooks/useWallet';
import { formatToken } from '../lib/format';
import { externalLinks } from '../data/externalLinks';
import { Dialog } from './Dialog';
import { TradeAction } from './TradeAction';

export function ReportAnswerDialog({ open, market, wallet, onClose, onOpenWallet }: { open: boolean; market: Market; wallet: WalletController; onClose: () => void; onOpenWallet: () => void }) {
  const [answer, setAnswer] = useState('');
  useEffect(() => { setAnswer(''); }, [market.id, open]);
  const scalar = market.type === 'scalar' || market.type === 'multi-scalar';
  const openForReports = market.marketState === 'reports-open';
  const valid = answer === 'invalid' || (scalar ? answer.trim() !== '' && Number.isFinite(Number(answer)) && (!market.bounds || (Number(answer) >= market.bounds[0] && Number(answer) <= market.bounds[1])) : market.outcomes.some((item) => item.id === answer));
  return <Dialog open={open} title="Report an answer" description="Read the resolution rule before posting a bonded answer." onClose={onClose}>
    <div className="report-answer-form">
      <p>{market.question}</p><dl className="quote-metrics"><div><dt>Recorded bond · sample</dt><dd>{market.oracle.bond === null ? 'Unavailable' : formatToken(market.oracle.bond, market.oracle.bondSymbol)}</dd></div><div><dt>Recorded answer · sample</dt><dd>{market.oracle.currentAnswer ?? 'No answer in this sample'}</dd></div></dl>
      <p>The live bond can increase when an answer is challenged. Confirm the current answer, currency, bond, and reporting window on Reality.eth.</p>
      {scalar ? <><label>Numeric answer ({market.unit})<input type="number" step="any" min={market.bounds?.[0]} max={market.bounds?.[1]} value={answer === 'invalid' ? '' : answer} onChange={(event) => setAnswer(event.target.value)} /></label><label><input type="checkbox" checked={answer === 'invalid'} onChange={(event) => setAnswer(event.target.checked ? 'invalid' : '')} /> Invalid question</label></>
        : <label>Answer<select value={answer} onChange={(event) => setAnswer(event.target.value)}><option value="">Select an answer</option>{market.outcomes.filter((item) => item.id !== 'invalid').map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}<option value="invalid">Invalid</option></select></label>}
      {!openForReports ? <p className="notice warning-notice">Reporting is not open for this sample market.</p> : <TradeAction market={market} wallet={wallet} action="Answer" valid={valid} onOpenWallet={() => { onClose(); onOpenWallet(); }} unavailable="Reporting unavailable: reporting requires live oracle data and a verified bond. No signature was requested." />}
      <div className="dialog-actions"><button className="secondary-button" type="button" onClick={onClose}>Return</button><a className="secondary-button" href={externalLinks.reality} target="_blank" rel="noreferrer">Check Reality.eth ↗</a></div>
    </div>
  </Dialog>;
}
