import { useState } from 'react';
import { externalLinks } from '../data/externalLinks';
import { getScalarQuestions } from '../data/marketRecord';
import { formatDate, formatNumber } from '../lib/format';
import { isMultiScalarMarket, isScalarMarket, scalarValue } from '../lib/marketKind';
import type { Market } from '../types';

function formatResolutionTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(new Date(value));
}

const stateLabels = {
  answered: 'Answered',
  reopened: 'Reopened',
  pending: 'Answer pending',
} as const;

export function ScalarMarketSummary({ market }: { market: Market }) {
  const [questionsVisible, setQuestionsVisible] = useState(false);
  const scalar = isScalarMarket(market);
  const multiScalar = isMultiScalarMarket(market);
  if (!scalar && !multiScalar) return null;

  const values = market.outcomes.map((outcome) => outcome.settlementValue ?? outcome.chance).filter(Number.isFinite);
  const estimate = scalarValue(market) ?? (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null);
  const [min, max] = market.bounds ?? [0, 100];
  const questions = getScalarQuestions(market);

  return (
    <section className="scalar-summary" aria-labelledby="scalar-summary-title">
      <div className="scalar-summary-main">
        <div>
          <span className="field-label">Market estimate</span>
          <strong id="scalar-summary-title">{estimate === null ? 'Estimate unavailable' : formatNumber(estimate, Math.abs(estimate) < 10 ? 2 : 1)} <small>{market.unit ?? ''}</small></strong>
        </div>
        <div className="scalar-bounds">
          <span>Numeric bounds</span>
          <strong>{min} to {max} {market.unit ?? ''}</strong>
        </div>
        <div className="scalar-resolution-open">
          <span>Resolution reporting opens</span>
          <strong>{formatResolutionTime(market.resolutionOpensAt)}</strong>
        </div>
      </div>

      {multiScalar && questions.length > 0 && (
        <div className="scalar-question-list">
          <div className="scalar-question-heading">
            <div>
              <span className="field-label">{questions.length} linked questions</span>
              <h3>Question state and deadlines</h3>
            </div>
            <button
              className="secondary-button"
              type="button"
              aria-expanded={questionsVisible}
              onClick={() => setQuestionsVisible((visible) => !visible)}
            >
              {questionsVisible ? 'Hide questions' : 'Show questions'}
            </button>
          </div>
          {questionsVisible && (
            <ol>
              {questions.map((question) => (
                <li key={question.id}>
                  <div>
                    <strong>{question.question}</strong>
                    <span>Deadline {formatDate(question.deadline)}</span>
                  </div>
                  <span className={`question-state is-${question.state}`}>{stateLabels[question.state]}</span>
                  <strong>{question.answer === null ? 'Not answered' : `${question.answer} ${market.unit ?? ''}`.trim()}</strong>
                  <a href={externalLinks.reality} target="_blank" rel="noreferrer">Reopen question ↗</a>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </section>
  );
}
