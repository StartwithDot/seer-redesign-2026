import { historyChange } from './history';
import type { AssetRecord, AssetSort } from './types';

const grades = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C', 'D'];
const gradeRank = (grade: string) => {
  const base = grade.replace(/[+-]$/, '');
  const index = grades.indexOf(base);
  return index < 0 ? Infinity : index * 3 + (grade.endsWith('+') ? -1 : grade.endsWith('-') ? 1 : 0);
};

export function sortRiskAssets(assets: AssetRecord[], sort: AssetSort): AssetRecord[] {
  return [...assets].sort((left, right) => {
    const order = sort === 'name' ? left.ticker.localeCompare(right.ticker)
      : sort === 'grade' ? gradeRank(left.grade) - gradeRank(right.grade)
        : sort === 'mover' ? historyChange(right, 24) - historyChange(left, 24)
          : right.pdAnn - left.pdAnn;
    return Number.isNaN(order) || order === 0 ? left.ticker.localeCompare(right.ticker) : order;
  });
}
