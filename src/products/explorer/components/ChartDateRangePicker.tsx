import { useEffect, useMemo, useRef, useState } from 'react';
import { historySampleClock } from '../data/chartHistory';
import { formatDate } from '../lib/format';

interface ChartDateRangePickerProps {
  open: boolean;
  start: string;
  end: string;
  earliestDate: string;
  onOpenChange: (open: boolean) => void;
  onApply: (start: string, end: string) => void;
}

const DAY = 24 * 60 * 60 * 1000;
const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toDateInput(value: string) {
  return value.slice(0, 10);
}

function dateOffset(value: string, days: number) {
  return new Date(Date.parse(`${toDateInput(value)}T12:00:00Z`) + days * DAY).toISOString().slice(0, 10);
}

function monthKey(value: Date) {
  return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function ChartDateRangePicker({
  open,
  start,
  end,
  earliestDate,
  onOpenChange,
  onApply,
}: ChartDateRangePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [pendingStart, setPendingStart] = useState(toDateInput(start));
  const [pendingEnd, setPendingEnd] = useState(toDateInput(end));
  const [month, setMonth] = useState(() => new Date(`${toDateInput(start)}T12:00:00Z`));

  useEffect(() => {
    if (!open) return;
    setPendingStart(toDateInput(start));
    setPendingEnd(toDateInput(end));
    setMonth(new Date(`${toDateInput(start)}T12:00:00Z`));
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onOpenChange(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onOpenChange(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [end, onOpenChange, open, start]);

  const days = useMemo(() => {
    const first = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1, 12));
    const offset = (first.getUTCDay() + 6) % 7;
    return [...Array(offset).fill(null), ...Array.from({ length: new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate() }, (_, index) =>
      new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), index + 1, 12)),
    )].slice(0, 42);
  }, [month]);

  const selectDate = (date: string) => {
    if (!pendingStart || (pendingStart && pendingEnd)) {
      setPendingStart(date);
      setPendingEnd('');
      return;
    }
    const [nextStart, nextEnd] = date < pendingStart ? [date, pendingStart] : [pendingStart, date];
    setPendingStart(nextStart);
    setPendingEnd(nextEnd);
  };

  const applyPreset = (presetStart: string, presetEnd: string) => {
    setPendingStart(presetStart);
    setPendingEnd(presetEnd);
    onApply(presetStart, presetEnd);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="chart-date-popover" ref={rootRef} role="dialog" aria-label="Choose a custom price history range">
      <div className="range-presets" aria-label="Custom range presets">
        <button type="button" onClick={() => applyPreset(toDateInput(historySampleClock), toDateInput(historySampleClock))}>Today</button>
        <button type="button" onClick={() => applyPreset(dateOffset(historySampleClock, -7), toDateInput(historySampleClock))}>Last Week</button>
        <button type="button" onClick={() => applyPreset(dateOffset(historySampleClock, -30), toDateInput(historySampleClock))}>Last Month</button>
        <button type="button" onClick={() => applyPreset(toDateInput(earliestDate), toDateInput(historySampleClock))}>All</button>
      </div>
      <div className="calendar-heading">
        <button
          className="icon-button"
          type="button"
          aria-label="Previous month"
          onClick={() => setMonth(new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() - 1, 1, 12)))}
        >
          <span aria-hidden="true">‹</span>
        </button>
        <strong>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</strong>
        <button
          className="icon-button"
          type="button"
          aria-label="Next month"
          onClick={() => setMonth(new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 1, 12)))}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <div className="calendar-grid" role="grid" aria-label={`${month.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })} calendar`}>
        {weekdayLabels.map((label) => <span key={label} role="columnheader">{label}</span>)}
        {days.map((date, index) => {
          if (!date) return <span key={`blank-${index}`} role="gridcell" aria-hidden="true" />;
          const value = date.toISOString().slice(0, 10);
          const selected = value === pendingStart || value === pendingEnd;
          const inRange = Boolean(pendingEnd && value > pendingStart && value < pendingEnd);
          return (
            <button
              key={value}
              type="button"
              role="gridcell"
              aria-selected={selected || inRange}
              aria-label={formatDate(value)}
              className={`${selected ? 'is-selected' : ''} ${inRange ? 'is-in-range' : ''}`}
              onClick={() => selectDate(value)}
            >
              {date.getUTCDate()}
            </button>
          );
        })}
      </div>
      <div className="calendar-selection" aria-live="polite">
        <span>Start <strong>{pendingStart ? formatDate(pendingStart) : 'Choose date'}</strong></span>
        <span>End <strong>{pendingEnd ? formatDate(pendingEnd) : 'Choose date'}</strong></span>
      </div>
      <div className="calendar-actions">
        <button className="secondary-button" type="button" onClick={() => onOpenChange(false)}>Cancel</button>
        <button
          className="primary-button"
          type="button"
          disabled={!pendingStart || !pendingEnd}
          onClick={() => {
            onApply(pendingStart, pendingEnd);
            onOpenChange(false);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
