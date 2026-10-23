import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { normalizeTradeAmount, normalizeTradeInput, quoteTrade, type TradeQuote, type TradeSide } from '../data/trading';
import type { Market, MarketOutcome } from '../data/types';

export type TradePhase = 'edit' | 'review' | 'submitting' | 'success';

interface UseTradeTicketArgs {
  market: Market;
  availableBalance: number;
}

export function useTradeTicket({ market, availableBalance }: UseTradeTicketArgs) {
  const [outcome, setOutcomeState] = useState<MarketOutcome>('yes');
  const [side, setSideState] = useState<TradeSide>('buy');
  const [amountInput, setAmountInput] = useState('100');
  const [quote, setQuote] = useState<TradeQuote>(() => quoteTrade({ market, outcome: 'yes', side: 'buy', amount: 100 }));
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [tradeAnyway, setTradeAnyway] = useState(false);
  const [phase, setPhase] = useState<TradePhase>('edit');
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const quoteTimer = useRef<number | undefined>(undefined);
  const completionTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => { window.clearTimeout(quoteTimer.current); window.clearTimeout(completionTimer.current); }, []);
  const amount = useMemo(() => normalizeTradeAmount(amountInput), [amountInput]);

  const refreshQuote = useCallback((nextAmount = amount, nextOutcome = outcome, nextSide = side) => {
    window.clearTimeout(quoteTimer.current);
    setQuoteLoading(true);
    const timer = window.setTimeout(() => {
      setQuote(quoteTrade({ market, outcome: nextOutcome, side: nextSide, amount: nextAmount }));
      setQuoteLoading(false);
    }, 320);
    quoteTimer.current = timer;
    return () => window.clearTimeout(timer);
  }, [amount, market, outcome, side]);

  useEffect(() => {
    const cancel = refreshQuote();
    return cancel;
  }, [refreshQuote]);

  const updateAmount = (value: string) => {
    const normalized = normalizeTradeInput(value);
    const rawAmount = Number.parseFloat(normalized);
    if (Number.isFinite(rawAmount) && rawAmount > 250_000) return;
    setAmountInput(normalized);
    setPhase('edit');
    setTradeAnyway(false);
  };

  const normalizeOnBlur = () => {
    const normalized = normalizeTradeAmount(amountInput);
    setAmountInput(normalized ? normalized.toFixed(2) : '');
  };

  const setOutcome = (next: MarketOutcome) => {
    setOutcomeState(next);
    setPhase('edit');
    setTradeAnyway(false);
  };

  const setSide = (next: TradeSide) => {
    setSideState(next);
    setPhase('edit');
    setTradeAnyway(false);
  };

  const addQuickAmount = (value: number) => {
    const next = Math.min(250_000, normalizeTradeAmount(amountInput) + value);
    updateAmount(next.toFixed(2));
  };

  const setMax = () => updateAmount(Math.min(250_000, Math.max(0, availableBalance)).toFixed(2));
  const insufficient = amount > availableBalance;
  const zeroBalance = availableBalance <= 0;
  const quoteMatches = quote.amount === amount && quote.outcome === outcome && quote.side === side;
  const canReview = market.status !== 'resolved' && !quoteLoading && quoteMatches && quote.state === 'ready' && amount > 0 && !insufficient && !zeroBalance && (!quote.highImpact || tradeAnyway);

  const startReview = () => {
    if (!canReview) return;
    setPhase('review');
  };

  const confirm = useCallback(() => {
    if (!canReview || phase !== 'review') return;
    setPhase('submitting');
    completionTimer.current = window.setTimeout(() => {
      setCompletedAt(new Date().toISOString());
      setPhase('success');
    }, 720);
  }, [canReview, phase]);

  return {
    amount,
    amountInput,
    canReview,
    completedAt,
    confirm,
    insufficient,
    normalizeOnBlur,
    phase,
    quote,
    quoteLoading,
    refreshQuote,
    setAmountInput: updateAmount,
    setMax,
    setOutcome,
    setSide,
    setTradeAnyway,
    side,
    startReview,
    tradeAnyway,
    updateAmount,
    addQuickAmount,
    outcome,
    zeroBalance,
  };
}
