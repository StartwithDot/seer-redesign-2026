import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { exactPrice, signedPercent } from '../data/format';
import {
  deterministicLiveFrame,
  frameAtProgress,
  type SignalFrame,
  type SignalSeries,
} from '../data/signalSeries';
import type { Market } from '../data/types';
import { useSignalPlayback } from '../hooks/useSignalPlayback';
import { FieldPlot } from './FieldPlot';
import { RollingValue } from './RollingValue';

interface SignalChartProps {
  market: Market;
  series: SignalSeries;
}

const chart = { width: 920, height: 360, left: 42, right: 26, top: 36, bottom: 52 };
const plotWidth = chart.width - chart.left - chart.right;
const plotHeight = chart.height - chart.top - chart.bottom;

const linePath = (points: Array<[number, number]>) =>
  points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');

const areaPath = (top: Array<[number, number]>, bottom: Array<[number, number]>) =>
  `${linePath(top)} ${linePath([...bottom].reverse()).replace('M', 'L')} Z`;

const price = (market: Market, value: number) => exactPrice(value, market.collateral);

export function SignalChart({ market, series: sourceSeries }: SignalChartProps) {
  const [preset, setPreset] = useState(0);
  const presets = ['Stored', 'Neutral', 'Include', 'Exclude'];
  const series = useMemo(() => preset === 0 ? sourceSeries : {
    ...sourceSeries,
    frames: sourceSeries.frames.map(frame => {
      if (frame.index < 10) return frame;
      const impact = [0, 0.6, 1.8, -1.6][preset];
      const no = frame.shared / (1 + impact / 200);
      return { ...frame, no, yes: no * (1 + impact / 100), impact };
    }),
  }, [sourceSeries, preset]);
  const playback = useSignalPlayback(series);
  const svgRef = useRef<SVGSVGElement>(null);
  const values = series.frames.flatMap((frame) => [frame.yes, frame.no, frame.shared]);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const padding = Math.max((rawMax - rawMin) * 0.16, Math.abs(rawMax) * 0.0004);
  const min = rawMin - padding;
  const max = rawMax + padding;
  const x = (index: number) => chart.left + (index / series.maxIndex) * plotWidth;
  const y = (value: number) => chart.top + ((max - value) / Math.max(max - min, 0.000001)) * plotHeight;
  const current = deterministicLiveFrame(frameAtProgress(series, playback.progress), playback.tick);
  const currentX = x(playback.progress * series.maxIndex);
  const currentY = y(current.yes);
  const nowX = x(series.nowIndex);
  const sharedPoints = series.frames.slice(0, series.nowIndex + 1).map((frame) => [x(frame.index), y(frame.shared)] as [number, number]);
  const yesPoints = series.frames.slice(series.nowIndex).map((frame) => [x(frame.index), y(frame.yes)] as [number, number]);
  const noPoints = series.frames.slice(series.nowIndex).map((frame) => [x(frame.index), y(frame.no)] as [number, number]);
  const corridorPoints = series.frames.slice(series.nowIndex).map((frame) => [x(frame.index), y(frame.shared)] as [number, number]);
  const corridorTop = corridorPoints.map(([px, py], index) => {
    const frame = series.frames[series.nowIndex + index];
    return [px, y(frame.shared * 1.01)] as [number, number];
  });
  const corridorBottom = corridorPoints.map(([px], index) => {
    const frame = series.frames[series.nowIndex + index];
    return [px, y(frame.shared * 0.99)] as [number, number];
  });
  const gapTop = yesPoints.slice(1);
  const gapBottom = noPoints.slice(1);
  const endYes = yesPoints.at(-1) ?? [x(series.maxIndex), y(current.yes)] as [number, number];
  const endNo = noPoints.at(-1) ?? [x(series.maxIndex), y(current.no)] as [number, number];
  const labelsClose = Math.abs(endYes[1] - endNo[1]) < 31;
  const twapStart = x(Math.max(0, series.nowIndex - 5));
  const twapWidth = Math.max(52, nowX - twapStart);
  const momentum = current.impact >= 1 ? 'include' : current.impact <= -1 ? 'exclude' : 'neutral';

  const frameFromPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const localX = ((event.clientX - rect.left) / rect.width) * chart.width;
    const ratio = (localX - chart.left) / plotWidth;
    playback.setProgress(ratio);
  };

  useEffect(() => {
    const testApi = {
      setProgress: (value: number) => playback.setProgress(value),
      setIndex: (value: number) => playback.setDeterministicIndex(value - 1),
      pulse: playback.triggerPulse,
      getState: () => ({
        view: playback.view,
        progress: playback.progress,
        index: playback.currentIndex + 1,
        tick: playback.tick,
      }),
    };
    (window as typeof window & { __FUTARCHY_SIGNAL__?: typeof testApi }).__FUTARCHY_SIGNAL__ = testApi;
    return () => {
      delete (window as typeof window & { __FUTARCHY_SIGNAL__?: typeof testApi }).__FUTARCHY_SIGNAL__;
    };
  }, [playback]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('[role="dialog"]')) return;
      if (target?.matches('input, textarea, select, button, a, [contenteditable="true"]')) return;
      if (event.key.toLowerCase() === 'v') {
        event.preventDefault();
        setPreset(value => (value + 1) % 4);
      } else if (event.code === 'Space') {
        event.preventDefault();
        playback.togglePlaying();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        playback.setDeterministicIndex(playback.currentIndex + direction);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [playback]);

  const labelText = (frame: SignalFrame) => `${frame.index < series.nowIndex ? 'Historical' : frame.projected ? 'Projected' : 'Current'}: ${price(market, frame.yes)} YES, ${price(market, frame.no)} NO, ${signedPercent(frame.impact)} impact`;
  const worldLabel = (frame: SignalFrame, world: 'yes' | 'no') =>
    `${world === 'yes' ? 'Pass world (YES)' : 'Fail world (NO)'}: ${price(market, world === 'yes' ? frame.yes : frame.no)}, ${signedPercent(frame.impact)} impact`;

  return (
    <section className="signal-chart" aria-labelledby="signal-chart-title">
      <header className="signal-chart-header">
        <div>
          <span className="eyebrow">MARKET SIGNAL</span>
          <h2 id="signal-chart-title">{playback.view === 'chart' ? 'Price fork' : 'Probability field'}</h2>
        </div>
        <div className="view-switcher" role="group" aria-label="Signal visualization" >
          <button type="button" aria-pressed={playback.view === 'chart'} onClick={() => playback.setView('chart')}>Chart</button>
          <button type="button" aria-pressed={playback.view === 'field'} onClick={() => playback.setView('field')}>Field</button>
        </div>
      </header>

      <button className="quiet-button" type="button" aria-keyshortcuts="V" title="Press V to cycle research scenarios" onClick={() => setPreset(value => (value + 1) % 4)}>Scenario: {presets[preset]}</button>
      {preset !== 0 && <p className="trade-preview-disclosure">Scenario replay only. Market evidence and trading estimates retain the stored snapshot.</p>}
      <div className="spot-metrics" aria-label="Spot market metrics">
        <article><span>TRADING PAIR</span><strong>{market.token} YES / NO</strong></article>
        <article><span>YES PRICE</span><RollingValue value={current.yes} format={(value) => price(market, value)} className="positive" /></article>
        <article><span>NO PRICE</span><RollingValue value={current.no} format={(value) => price(market, value)} /></article>
        <article><span>SPOT PRICE</span><RollingValue value={current.shared} format={(value) => price(market, value)} /></article>
        <article><span>IMPACT SPOT</span><RollingValue value={current.impact} format={signedPercent} className={current.impact >= 0 ? 'positive' : 'negative'} /></article>
      </div>

      <div className={`signal-stage is-${playback.view}`} data-pulse-index={playback.currentIndex + 1}>
        {playback.view === 'chart' ? (
          <svg
            ref={svgRef}
            className="chart-plot"
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            role="img"
            aria-label={`${market.proposal} market chart. ${labelText(current)}`}
            onPointerMove={frameFromPointer}
            onPointerDown={frameFromPointer}
          >
            <defs>
              <linearGradient id={`gap-${market.id}`} x1="0" x2="1">
                <stop offset="0" stopColor="#6c47ff" stopOpacity=".04" />
                <stop offset="1" stopColor="#6c47ff" stopOpacity=".24" />
              </linearGradient>
            </defs>

            <rect className="chart-twap-slab" x={twapStart} y={chart.top} width={twapWidth} height={plotHeight} rx="14" />
            <text className="chart-annotation" x={twapStart + 10} y={chart.top + 18}>5D TWAP</text>
            <path className="chart-corridor" d={areaPath(corridorTop, corridorBottom)} />
            <path className="chart-gap" d={areaPath(gapTop, gapBottom)} fill={`url(#gap-${market.id})`} />
            <path className="chart-shared" d={linePath(sharedPoints)} />
            <path className="chart-thread is-yes" d={linePath(yesPoints)} />
            <path className="chart-thread is-no" d={linePath(noPoints)} />

            <line className="chart-now" x1={nowX} y1={chart.top} x2={nowX} y2={chart.height - chart.bottom + 22} />
            <text className="chart-annotation" x={nowX - 18} y={chart.top - 10}>NOW</text>
            <text className="chart-annotation" x={nowX + 15} y={chart.height - 16}>PROJECTED FUTURE</text>
            <circle className={`chart-decision-pulse${playback.pulse ? ' is-pulsing' : ''}`} cx={nowX} cy={y(series.frames[series.nowIndex].shared)} r="18" key={playback.pulse} />
            <circle className="chart-activity-pulse" cx={nowX} cy={y(series.frames[series.nowIndex].shared)} r="10" key={`activity-${playback.tick}`} />

            <g className={`signal-head is-${momentum}`} transform={`translate(${currentX} ${currentY})`} key={`head-${playback.tick}`}>
              <circle className="signal-halo" r="16" />
              <path className="signal-spark" d="M-28 -10h12M-24 0h8M-28 10h12" />
              <circle className="signal-core" r="4.5" />
            </g>

            <g className="chart-endpoints">
              <circle className="endpoint is-yes" cx={endYes[0]} cy={endYes[1]} r="5"><title>{worldLabel(series.frames.at(-1) ?? current, 'yes')}</title></circle>
              <circle className="endpoint is-no" cx={endNo[0]} cy={endNo[1]} r="5"><title>{worldLabel(series.frames.at(-1) ?? current, 'no')}</title></circle>
            </g>

            {labelsClose ? (
              <g className="merged-label">
                <line x1={endYes[0] - 8} y1={(endYes[1] + endNo[1]) / 2} x2={endYes[0] + 5} y2={endYes[1]} />
                <line x1={endYes[0] - 8} y1={(endYes[1] + endNo[1]) / 2} x2={endYes[0] + 5} y2={endNo[1]} />
                <rect x={endYes[0] - 168} y={(endYes[1] + endNo[1]) / 2 - 21} width="156" height="42" rx="11" />
                <text x={endYes[0] - 154} y={(endYes[1] + endNo[1]) / 2 - 3}>YES {price(market, series.frames.at(-1)!.yes)}</text>
                <text x={endYes[0] - 154} y={(endYes[1] + endNo[1]) / 2 + 13}>NO {price(market, series.frames.at(-1)!.no)}</text>
              </g>
            ) : (
              <>
                <g className={`direct-label is-yes${endYes[1] > endNo[1] ? ' is-flipped' : ''}`}>
                  <rect x={endYes[0] - 132} y={endYes[1] - 22} width="122" height="28" rx="9" />
                  <text x={endYes[0] - 121} y={endYes[1] - 4}>YES {price(market, series.frames.at(-1)!.yes)}</text>
                </g>
                <g className={`direct-label is-no${endNo[1] > endYes[1] ? ' is-flipped' : ''}`}>
                  <rect x={endNo[0] - 132} y={endNo[1] - 22} width="122" height="28" rx="9" />
                  <text x={endNo[0] - 121} y={endNo[1] - 4}>NO {price(market, series.frames.at(-1)!.no)}</text>
                </g>
              </>
            )}

            <g className="chart-tooltip" transform={`translate(${Math.min(currentX + 16, chart.width - 232)} ${Math.max(chart.top + 8, currentY - 76)})`}>
              <rect width="220" height="70" rx="11" />
              <text x="12" y="21">{new Date(current.at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</text>
              <text x="12" y="41">YES {price(market, current.yes)} · NO {price(market, series.frames.at(-1)!.no)}</text>
              <text x="12" y="59">Impact {signedPercent(current.impact)} · {momentum}</text>
            </g>
            <rect className="chart-scrub-layer" x={chart.left} y={chart.top} width={plotWidth} height={plotHeight} />
          </svg>
        ) : (
          <FieldPlot market={market} frame={current} tick={playback.tick} pulse={playback.pulse} />
        )}
      </div>

      <div className="signal-controls">
        <button className="play-button" type="button" disabled={playback.reducedMotion} title={playback.reducedMotion ? 'Automatic replay is disabled with reduced motion. Use the timeline to inspect observations.' : undefined} onClick={playback.togglePlaying} aria-label={playback.playing ? 'Pause replay' : 'Play replay'}>
          {playback.playing ? 'Ⅱ' : '▶'}
        </button>
        <button className="quiet-button" type="button" onClick={playback.replay}>Replay</button>
        <label className="timeline-label">
          <span className="sr-only">Signal timeline</span>
          <input
            type="range"
            min="0"
            max="1000"
            value={Math.round(playback.progress * 1000)}
            aria-valuetext={labelText(current)}
            onChange={(event) => playback.setProgress(Number(event.target.value) / 1000)}
          />
        </label>
        <output>{playback.currentIndex === series.nowIndex ? 'Now' : playback.currentIndex > series.nowIndex ? `Now +${playback.currentIndex - series.nowIndex} days` : `Now ${series.nowIndex - playback.currentIndex} days ago`}</output>
        <span className="live-tick" data-tick={playback.tick}><i /> Live {momentum}</span>
      </div>
    </section>
  );
}
