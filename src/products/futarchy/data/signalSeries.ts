import type { Market, MarketPoint } from './types';

export interface SignalFrame {
  index: number;
  at: string;
  shared: number;
  yes: number;
  no: number;
  impact: number;
  projected: boolean;
}

export interface SignalSeries {
  frames: SignalFrame[];
  nowIndex: number;
  maxIndex: number;
}

const frameFromPoint = (point: MarketPoint, index: number, market: Market, projected = false): SignalFrame => {
  const shared = (point.yes + point.no) / 2;
  return {
    index,
    at: point.at,
    shared,
    yes: index < 10 ? shared : point.yes,
    no: index < 10 ? shared : point.no,
    impact: index < 10 ? 0 : ((point.yes - point.no) / Math.max(Math.abs(point.no), 0.000001)) * 100,
    projected,
  };
};

export function buildSignalSeries(market: Market): SignalSeries {
  const observed = market.history.map((point, index) => frameFromPoint(point, index, market));
  const origin = observed.at(-1) ?? frameFromPoint({
    at: market.closesAt,
    yes: market.yesPrice,
    no: market.noPrice,
  }, 0, market);
  const unit = Math.max(Math.abs(origin.yes), 1) * 0.00034;
  const projected = Array.from({ length: 5 }, (_, offset) => {
    const index = observed.length + offset;
    const distance = offset + 1;
    const wave = Math.sin((index + market.id.length) * 0.86) * unit;
    const spread = unit * distance * Math.max(0.28, Math.abs(market.impact) / 0.65);
    const direction = market.impact >= 0 ? 1 : -1;
    const yes = origin.yes + wave + spread * direction;
    const no = origin.no + wave - spread * direction;
    return {
      index,
      at: new Date(new Date(origin.at).getTime() + distance * 24 * 60 * 60 * 1000).toISOString(),
      shared: (yes + no) / 2,
      yes,
      no,
      impact: ((yes - no) / Math.max(Math.abs(no), 0.000001)) * 100,
      projected: true,
    };
  });
  const frames = [...observed, ...projected];
  return { frames, nowIndex: observed.length - 1, maxIndex: frames.length - 1 };
}

export function frameAtProgress(series: SignalSeries, progress: number): SignalFrame {
  const exact = Math.max(0, Math.min(1, progress)) * series.maxIndex;
  const lower = series.frames[Math.floor(exact)] ?? series.frames[0];
  const upper = series.frames[Math.ceil(exact)] ?? lower;
  const mix = exact - Math.floor(exact);
  return {
    ...lower,
    shared: lower.shared + (upper.shared - lower.shared) * mix,
    yes: lower.yes + (upper.yes - lower.yes) * mix,
    no: lower.no + (upper.no - lower.no) * mix,
    impact: lower.impact + (upper.impact - lower.impact) * mix,
  };
}

export function deterministicLiveFrame(frame: SignalFrame, tick: number): SignalFrame {
  const scale = Math.max(Math.abs(frame.shared), 1) * 0.000035;
  const movement = Math.sin(tick * 0.73) * scale;
  const yes = frame.yes + movement;
  const no = frame.no - movement * 0.42;
  return {
    ...frame,
    yes,
    no,
    impact: ((yes - no) / Math.max(Math.abs(no), 0.000001)) * 100,
  };
}

export const frameProgress = (series: SignalSeries, index: number) => index / series.maxIndex;
