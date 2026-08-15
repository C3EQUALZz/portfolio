import { err, ok, type Result } from '../result/result';
import { yearMonth, type YearMonth } from './year-month';

/** A work interval: month to month, or "to present". */
export interface Period {
  readonly start: YearMonth;
  readonly end: YearMonth | 'present';
}

export interface InvalidPeriod {
  readonly kind: 'InvalidPeriod';
}

const INVALID: InvalidPeriod = { kind: 'InvalidPeriod' };

export const period = {
  create(start: YearMonth, end: YearMonth | 'present'): Result<Period, InvalidPeriod> {
    if (end !== 'present' && yearMonth.compare(end, start) < 0) {
      return err(INVALID);
    }
    return ok({ start, end });
  },

  /** Inclusive counting: both the start and end months are part of the duration. */
  durationInMonths(period: Period, asOf: YearMonth): number {
    const end = period.end === 'present' ? asOf : period.end;
    return yearMonth.diffInMonths(end, period.start) + 1;
  },

  isOngoing(period: Period): boolean {
    return period.end === 'present';
  },

  /** Overlap under inclusive counting: a single shared month is enough. */
  overlaps(a: Period, b: Period): boolean {
    const startsBeforeEnds = b.end === 'present' || yearMonth.compare(a.start, b.end) <= 0;
    const endsAfterStarts = a.end === 'present' || yearMonth.compare(b.start, a.end) <= 0;
    return startsBeforeEnds && endsAfterStarts;
  },
};
