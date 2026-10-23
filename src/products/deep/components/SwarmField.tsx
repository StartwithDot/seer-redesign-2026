import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  dodgeSwarmMarks,
  swarmPriceX,
  distributionAt,
  formatUtc,
  valueAtOrBefore,
  type SwarmLayer,
} from '../data/field-analysis';
import type { Repository } from '../data/types';
import { usePredictions } from '../state/Predictions';
import { Icon } from './Icons';
import { SwarmReplayStrip } from './SwarmReplayStrip';

const layers: Array<{ id: SwarmLayer; label: string }> = [
  { id: 'price', label: 'UP price' },
  { id: 'gap', label: 'Unpriced gap' },
  { id: 'drift', label: 'Drift' },
  { id: 'volume', label: 'Volume' },
  { id: 'predictions', label: 'Your predictions' },
];

function activate(event: ReactKeyboardEvent<SVGGElement>, action: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action();
  }
}

export function SwarmField({
  repositories,
  selected,
  isolated,
  onSelect,
  onIsolate,
  onReturnToChart,
}: {
  repositories: Repository[];
  selected: Repository;
  isolated: Repository;
  onSelect: (repository: Repository) => void;
  onIsolate: (repository: Repository) => void;
  onReturnToChart: () => void;
}) {
  const figureId = useId();
  const replayTimeRef = useRef<number>(0);
  const [layer, setLayer] = useState<SwarmLayer>('price');
  const [playing, setPlaying] = useState(false);
  const [replayTime, setReplayTime] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const { status: predictionStatus, predictions, clearPredictions, reloadPredictions } = usePredictions();
  const fallbackEnd = Date.parse('2026-10-18T19:30:00Z') / 1000;
  const end = useMemo(() => Math.max(...repositories.map((repository) => repository.upHistory.at(-1)?.timestamp ?? 0), fallbackEnd), [fallbackEnd, repositories]);
  const start = useMemo(() => Math.min(...repositories.map((repository) => repository.upHistory[0]?.timestamp ?? end), end), [end, repositories]);
  const median = distributionAt(repositories.map((repository) => repository.upHistory), replayTime || end).median;
  const maxLiquidity = Math.max(...repositories.map((repository) => repository.liquidity), 1);
  const maxVolume = Math.max(...repositories.map((repository) => repository.volume), 1);
  const marks = useMemo(() => {
    const timestamp = replayTime || end;
    const positioned = repositories.flatMap((repository) => {
      const price = valueAtOrBefore(repository.upHistory, timestamp);
      if (price === null) return [];
      const downPrice = valueAtOrBefore(repository.downHistory, timestamp);
      return [{
        repository,
        price,
        downPrice,
        firstPrice: repository.firstUpPrice,
        drift: price - repository.firstUpPrice,
        residual: downPrice === null ? null : 1 - price - downPrice,
        radius: layer === 'volume' ? Math.sqrt(Math.max(16, repository.volume / maxVolume * 289))
          : Math.sqrt(Math.max(12.25, repository.liquidity / maxLiquidity * 110.25)),
        x: swarmPriceX(price),
      }];
    });
    const rows = dodgeSwarmMarks(positioned.map(item => ({ id: item.repository.marketId, x: item.x, radius: item.radius })));
    return positioned.map((item) => ({
      ...item,
      y: rows.get(item.repository.marketId) ?? 80,
    }));
  }, [end, replayTime, repositories, layer, maxLiquidity, maxVolume]);
  const concentration = marks.filter(mark => mark.price >= .65 && mark.price <= .85).length;
  const axisY = Math.max(372, ...marks.map(mark => mark.y + mark.radius + 24));

  useEffect(() => {
    replayTimeRef.current = end;
    setReplayTime(end);
  }, [end]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (predictionStatus !== 'ready' && layer === 'predictions') setLayer('price');
  }, [layer, predictionStatus]);

  useEffect(() => {
    if (!playing) return;
    if (reducedMotion) { replayTimeRef.current = end; setReplayTime(end); setPlaying(false); return; }

    const from = Math.max(start, replayTimeRef.current >= end ? start : replayTimeRef.current || start);
    const started = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - started) / 10_000);
      const eased = 1 - Math.pow(1 - progress, 3);
      const timestamp = from + (end - from) * eased;
      replayTimeRef.current = timestamp;
      setReplayTime(timestamp);
      if (progress < 1) frame = requestAnimationFrame(animate);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, playing, reducedMotion, start]);

  const inspectedMark = marks.find((mark) => mark.repository.marketId === hoveredId)
    ?? marks.find((mark) => mark.repository.marketId === isolated.marketId)
    ?? marks[0];
  const layerDescription = {
    price: 'Dot area follows liquidity. Every tail begins at the Oct 1 UP price.',
    gap: 'Amber marks an unpriced remainder. Red marks an over-1 overlap.',
    drift: 'Green tails moved up since Oct 1. Red tails moved down.',
    volume: 'Dot area follows reported market volume.',
    predictions: 'Rings mark forecast UP. Tethers show distance from the market price.',
  }[layer];

  return (
    <section className="deep-swarm" aria-labelledby={`${figureId}-title`}>
      <header className="deep-swarm__header">
        <div>
          <p className="deep-eyebrow">Swarm lens · exact UP position</p>
          <h2 id={`${figureId}-title`}>Where does the market disagree?</h2>
          <p>{layerDescription}</p>
        </div>
        <button className="deep-button" type="button" onClick={onReturnToChart}>
          <Icon name="chart" /> Time chart
        </button>
      </header>

      <div className="deep-swarm__toolbar">
        <button className="deep-button" type="button" aria-pressed={hidden} onClick={() => setHidden(value => !value)}>{hidden ? 'Show all' : 'Hide all'}</button>
        <div className="deep-segmented" role="group" aria-label="Swarm data layer">
          {layers.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={layer === item.id}
              disabled={layer === item.id || (item.id === 'predictions' && predictionStatus !== 'ready')}
              title={item.id === 'predictions' && predictionStatus !== 'ready' ? 'Predictions are not loaded' : layer === item.id ? 'Current Swarm data layer' : item.label}
              onClick={() => setLayer(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="deep-prediction-state">
          <span>{predictionStatus === 'loading' ? 'Loading saved predictions' : predictionStatus === 'ready' ? `${predictions.size} predictions loaded` : 'No predictions loaded'}</span>
          {predictionStatus === 'ready'
            ? <button type="button" onClick={clearPredictions}>Clear</button>
            : <button type="button" onClick={reloadPredictions}>{predictionStatus === 'loading' ? 'Reload' : 'Load saved set'}</button>}
        </div>
      </div>

      <div className="deep-swarm__canvas">
        <svg viewBox={`0 0 1000 ${axisY + 58}`} aria-labelledby={`${figureId}-svg-title ${figureId}-svg-desc`}>
          <title id={`${figureId}-svg-title`}>{repositories.length} repository outcomes in the Deep consensus swarm</title>
          <desc id={`${figureId}-svg-desc`}>Each repository remains at its exact UP price on the horizontal axis. Vertical position only dodges collisions.</desc>
          <text className="deep-swarm__giant-date" x="32" y="250">{formatUtc(replayTime || end, false)}</text>
          <text className="deep-swarm__median-note" x={swarmPriceX(median)} y="38" textAnchor="middle">Median {median.toFixed(4)}</text>
          <line className="deep-swarm__median" x1={swarmPriceX(median)} x2={swarmPriceX(median)} y1="48" y2={axisY - 18} />
          <rect className="deep-swarm__lens-band" x="188" y="55" width="624" height={axisY - 70} />
          <text className="deep-swarm__lens-label" x="500" y="68" textAnchor="middle">×3.3 price lens · 0.65–0.85 · {concentration} of {marks.length} outcomes</text>
          <line className="deep-swarm__axis" x1="32" x2="968" y1={axisY} y2={axisY} />
          {[0, 0.65, 0.7, 0.8, 0.85, 1].map((tick) => (
            <g key={`full-${tick}`}>
              <line className="deep-swarm__axis-tick" x1={swarmPriceX(tick)} x2={swarmPriceX(tick)} y1="22" y2="31" />
              <text x={swarmPriceX(tick)} y="17" textAnchor="middle">{tick.toFixed(2)}</text>
            </g>
          ))}
          <text x="32" y={axisY + 27}>UP 0.00</text>
          <text x="968" y={axisY + 27} textAnchor="end">UP 1.00</text>
          {[0.65, 0.7, 0.75, 0.8, 0.85].map((tick) => (
            <g key={tick}>
              <line className="deep-swarm__grid" x1={swarmPriceX(tick)} x2={swarmPriceX(tick)} y1="72" y2={axisY} />
              <text x={swarmPriceX(tick)} y={axisY + 21} textAnchor="middle">{tick.toFixed(2)}</text>
            </g>
          ))}
          {!hidden && marks.map((mark) => {
            const radius = mark.radius;
            const firstX = swarmPriceX(mark.firstPrice);
            const prediction = predictions.get(mark.repository.marketId);
            const predictionX = prediction ? swarmPriceX(prediction.up) : mark.x;
            const isMuted = isolated.marketId !== mark.repository.marketId && hoveredId !== mark.repository.marketId;
            const gapClass = mark.residual !== null && mark.residual < 0 ? 'is-over' : 'is-gap';
            return (
              <g
                key={mark.repository.marketId}
                role="button"
                tabIndex={0}
                aria-pressed={selected.marketId === mark.repository.marketId}
                aria-label={`${mark.repository.owner}/${mark.repository.name}, UP ${mark.price.toFixed(4)}, change ${mark.drift >= 0 ? '+' : ''}${mark.drift.toFixed(4)}`}
                className={`deep-swarm__mark ${isMuted ? 'is-muted' : ''} ${mark.repository.marketId === selected.marketId ? 'is-selected' : ''}`}
                onClick={() => onSelect(mark.repository)}
                onKeyDown={(event) => activate(event, () => onSelect(mark.repository))}
                onPointerEnter={() => { setHoveredId(mark.repository.marketId); onIsolate(mark.repository); }}
                onPointerLeave={() => { setHoveredId(null); onIsolate(selected); }}
                onFocus={() => onIsolate(mark.repository)}
                onBlur={() => onIsolate(selected)}
              >
                <title>{`${mark.repository.owner}/${mark.repository.name} · UP ${mark.price.toFixed(4)} · ${formatUtc(replayTime || end)}`}</title>
                <line className={`deep-swarm__tail ${mark.drift >= 0 ? 'is-up' : 'is-down'}`} x1={firstX} x2={mark.x} y1={mark.y} y2={mark.y} />
                {layer === 'gap' && mark.residual !== null && (
                  <line className={`deep-swarm__residual ${gapClass}`} x1={mark.x} x2={mark.x + Math.min(95, Math.abs(mark.residual) * 520)} y1={mark.y} y2={mark.y} />
                )}
                {layer === 'predictions' && prediction && (
                  <>
                    <line className="deep-swarm__prediction-tether" x1={mark.x} x2={predictionX} y1={mark.y} y2={mark.y} />
                    <circle className="deep-swarm__prediction-ring" cx={predictionX} cy={mark.y} r={radius + 3.5} />
                  </>
                )}
                <circle className={`deep-swarm__dot ${layer === 'drift' ? (mark.drift >= 0 ? 'is-up' : 'is-down') : ''} ${layer === 'gap' ? gapClass : ''}`} cx={mark.x} cy={mark.y} r={radius} />
                <circle className="deep-swarm__first" cx={firstX} cy={mark.y} r="1.7" />
                <circle className="deep-swarm__hit" cx={mark.x} cy={mark.y} r={Math.max(11, radius + 5)} />
              </g>
            );
          })}
        </svg>
        {hidden && <p role="status">All repository marks hidden. Choose Show all to restore.</p>}
        {!hidden && inspectedMark && (
          <output className="deep-swarm__readout" aria-live="polite">
            <strong title={`${inspectedMark.repository.owner}/${inspectedMark.repository.name}`}>
              {hoveredId ? 'Hover preview · ' : 'Selected · '}{inspectedMark.repository.owner}/{inspectedMark.repository.name}
            </strong>
            <span>UP {inspectedMark.price.toFixed(4)}</span>
            <span>DOWN {inspectedMark.downPrice?.toFixed(4) ?? 'Unavailable'}</span>
            <span>Oct 1 {inspectedMark.firstPrice.toFixed(4)}</span>
            <span>Drift {inspectedMark.drift >= 0 ? '+' : ''}{inspectedMark.drift.toFixed(4)}</span>
            <span>{inspectedMark.residual !== null && inspectedMark.residual < 0 ? 'Over-1' : 'Unpriced'} {inspectedMark.residual === null ? 'Unavailable' : Math.abs(inspectedMark.residual).toFixed(4)}</span>
            {predictions.get(inspectedMark.repository.marketId) && (
              <span>Prediction {predictions.get(inspectedMark.repository.marketId)?.up.toFixed(4)}</span>
            )}
          </output>
        )}
      </div>

      <SwarmReplayStrip
        series={repositories.map((repository) => repository.upHistory)}
        start={start}
        end={end}
        value={replayTime || end}
        playing={playing}
        reducedMotion={reducedMotion}
        onScrub={(timestamp) => {
          setPlaying(false);
          replayTimeRef.current = timestamp;
          setReplayTime(timestamp);
        }}
        onToggle={() => {
          if (playing) setPlaying(false);
          else {
            if ((replayTime || end) >= end) {
              replayTimeRef.current = start;
              setReplayTime(start);
            }
            setPlaying(true);
          }
        }}
      />
      <footer>
        <span>Horizontal position is exact. Vertical position only prevents overlap.</span>
        <span>Reported liquidity controls dot area in price, gap, drift, and prediction layers.</span>
      </footer>
    </section>
  );
}
