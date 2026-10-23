import { useEffect, useRef, useState } from 'react';
import type { Market } from '../types';
import { topicKey } from '../lib/marketKind';

interface CategoryRailProps {
  markets: Market[];
  value: string;
  onChange: (topic: string) => void;
}

export function CategoryRail({ markets, value, onChange }: CategoryRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const topics = [...new Set(markets.map((market) => market.subject))];

  const updateEdges = () => {
    const rail = railRef.current;
    if (!rail) return;
    setEdges({
      start: rail.scrollLeft <= 2,
      end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2,
    });
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [topics.join('|')]);

  const move = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    rail.scrollBy({
      left: direction * Math.max(180, rail.clientWidth * 0.55),
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <nav className="category-rail" aria-label="Market topics">
      <button
        className="category-arrow"
        type="button"
        aria-label="Scroll topics left"
        disabled={edges.start}
        title={edges.start ? 'First topic is already visible' : 'Scroll topics left'}
        onClick={() => move(-1)}
      >
        <span aria-hidden="true">←</span>
      </button>
      <div className="category-scroll" ref={railRef} onScroll={updateEdges}>
        <button
          type="button"
          className={!value ? 'is-active' : ''}
          aria-pressed={!value}
          onClick={() => onChange('')}
        >
          All topics
        </button>
        {topics.map((topic) => {
          const key = topicKey(topic);
          return (
            <button
              key={topic}
              type="button"
              className={value === key ? 'is-active' : ''}
              aria-pressed={value === key}
              onClick={() => onChange(value === key ? '' : key)}
            >
              {topic}
            </button>
          );
        })}
      </div>
      <button
        className="category-arrow"
        type="button"
        aria-label="Scroll topics right"
        disabled={edges.end}
        title={edges.end ? 'Last topic is already visible' : 'Scroll topics right'}
        onClick={() => move(1)}
      >
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}
