import type { Brand } from '../brand/brand';
import { err, ok, type Result } from '../result/result';

/** A month of a specific year — the date precision used in the resume. */
export type YearMonth = Brand<string, 'YearMonth'>;

export interface InvalidYearMonth {
  readonly kind: 'InvalidYearMonth';
}

const INVALID: InvalidYearMonth = { kind: 'InvalidYearMonth' };

const PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

function toIndex(yearMonth: YearMonth): number {
  return Number(yearMonth.slice(0, 4)) * 12 + Number(yearMonth.slice(5, 7));
}

export const yearMonth = {
  create(year: number, month: number): Result<YearMonth, InvalidYearMonth> {
    const raw = `${year.toString()}-${month.toString().padStart(2, '0')}`;
    return PATTERN.test(raw) ? ok(raw as YearMonth) : err(INVALID);
  },

  compare(a: YearMonth, b: YearMonth): -1 | 0 | 1 {
    const diff = toIndex(a) - toIndex(b);
    return diff < 0 ? -1 : diff > 0 ? 1 : 0;
  },
};
