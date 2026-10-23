import { useState } from 'react';
import { useBoardData } from '../hooks/useBoardData';
import { useSelectedMarket } from '../hooks/useSelectedMarket';
import { BoardEmptyState, BoardErrorNotice, BoardSkeleton } from './BoardDataState';
import { DecisionRail } from './DecisionRail';
import { MarketHero } from './MarketHero';
import { MarketRail } from './MarketRail';
import { MarketTicker } from './MarketTicker';
import { SignalSummary } from './SignalSummary';
import { StatusStrip } from './StatusStrip';

interface BoardViewProps {
  onOpenProtocol: () => void;
  onOpenReview: (marketId: string, submissionId?: string) => void;
}

export function BoardView({ onOpenProtocol, onOpenReview }: BoardViewProps) {
  const [mobileTab, setMobileTab] = useState<'signal' | 'authority'>('signal');
  const [workspace, setWorkspace] = useState<'all' | 'mine'>('all');
  const selected = useSelectedMarket();
  const boardData = useBoardData(workspace);
  const market = boardData.markets.find((item) => item.id === selected.marketId) ?? boardData.markets[0] ?? selected.market;

  const showAll = () => {
    setWorkspace('all');
    selected.selectMarket(selected.marketId);
  };

  return (
    <div className="board-view">
      <div className="board-controls">
        <div className="board-toolbar">
          <div>
            <p className="section-kicker">Opportunity Board</p>
          </div>
          <label>
            <span>Workspace</span>
            <select value={workspace} onChange={(event) => setWorkspace(event.target.value as 'all' | 'mine')}>
              <option value="all">All opportunity markets</option>
              <option value="mine">My review queue</option>
            </select>
          </label>
        </div>
        {boardData.status !== 'loading' && boardData.markets.length > 0 && <MarketRail markets={boardData.markets} selectedId={market.id} onSelect={selected.selectMarket} />}
      </div>
      {boardData.status === 'loading' ? (
        <BoardSkeleton />
      ) : boardData.markets.length === 0 ? (
        <>
        {boardData.status === 'error' && <BoardErrorNotice onRetry={() => boardData.reload(true)} />}
        <BoardEmptyState onShowAll={showAll} />
        </>
      ) : (
        <>
          {boardData.status === 'error' && <BoardErrorNotice onRetry={() => boardData.reload(true)} />}
          <MarketHero market={market} onOpenReview={() => onOpenReview(market.id)} onOpenProtocol={onOpenProtocol} />
          <div className="board-mobile-tabs" role="tablist" aria-label="Board detail" onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const next = event.key === 'Home' ? 'signal' : event.key === 'End' ? 'authority' : mobileTab === 'signal' ? 'authority' : 'signal';
            setMobileTab(next);
            document.getElementById(`board-tab-${next}`)?.focus();
          }}>
            <button id="board-tab-signal" type="button" role="tab" tabIndex={mobileTab === 'signal' ? 0 : -1} aria-selected={mobileTab === 'signal'} aria-controls="board-signal-panel" onClick={() => setMobileTab('signal')}>Market signal</button>
            <button id="board-tab-authority" type="button" role="tab" tabIndex={mobileTab === 'authority' ? 0 : -1} aria-selected={mobileTab === 'authority'} aria-controls="board-authority-panel" onClick={() => setMobileTab('authority')}>Sponsor task</button>
          </div>
          <div className="board-workspace">
            <div id="board-signal-panel" role="tabpanel" aria-labelledby="board-tab-signal" className={`board-tab-panel ${mobileTab === 'signal' ? 'is-mobile-active' : ''}`}>
              <SignalSummary market={market} onOpenSubmission={id => onOpenReview(market.id, id)} />
            </div>
            <div id="board-authority-panel" role="tabpanel" aria-labelledby="board-tab-authority" className={`board-tab-panel ${mobileTab === 'authority' ? 'is-mobile-active' : ''}`}>
              <DecisionRail market={market} onOpenReview={() => onOpenReview(market.id)} />
            </div>
          </div>
          <div className="board-provenance">
            <StatusStrip market={market} updatedAt={boardData.updatedAt} dataStatus={boardData.status} />
            <details className="board-ticker-disclosure">
              <summary>Across the markets <span aria-hidden="true">+</span></summary>
              <MarketTicker markets={boardData.markets} selectedId={market.id} onSelect={selected.selectMarket} />
            </details>
          </div>
        </>
      )}
      {boardData.status !== 'loading' && boardData.markets.length > 0 && <div className="board-mobile-action"><button type="button" className="primary-action" onClick={() => onOpenReview(market.id)}>Explore submissions <span aria-hidden="true">→</span></button></div>}
    </div>
  );
}
