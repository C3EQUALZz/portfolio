import { describe, expect, it } from 'vitest';

import { period, type Period } from './period';
import { yearMonth, type YearMonth } from './year-month';

function ym(year: number, month: number): YearMonth {
  const result = yearMonth.create(year, month);
  if (!result.ok) {
    throw new Error('failed to create YearMonth');
  }
  return result.value;
}

function makePeriod(
  startYear: number,
  startMonth: number,
  end: 'present' | readonly [number, number],
): Period {
  const result = period.create(
    ym(startYear, startMonth),
    end === 'present' ? 'present' : ym(end[0], end[1]),
  );
  if (!result.ok) {
    throw new Error('failed to create Period');
  }
  return result.value;
}

describe('period.create', () => {
  it('принимает период, где конец не раньше начала', () => {
    expect(period.create(ym(2025, 6), ym(2025, 12)).ok).toBe(true);
    expect(period.create(ym(2025, 6), ym(2025, 6)).ok).toBe(true);
  });

  it('принимает открытый период «по настоящее время»', () => {
    expect(period.create(ym(2025, 12), 'present').ok).toBe(true);
  });

  it('отклоняет период, где конец раньше начала', () => {
    expect(period.create(ym(2025, 12), ym(2025, 6))).toEqual({
      ok: false,
      error: { kind: 'InvalidPeriod' },
    });
  });
});

describe('period.durationInMonths', () => {
  it('считает включительно: начальный и конечный месяцы входят в длительность', () => {
    expect(period.durationInMonths(makePeriod(2025, 1, [2025, 3]), ym(2026, 8))).toBe(3);
  });

  it('даёт 1 месяц для периода из одного месяца', () => {
    expect(period.durationInMonths(makePeriod(2025, 6, [2025, 6]), ym(2026, 8))).toBe(1);
  });

  it('считает открытый период по asOf: «Dec 2025 — now» при Aug 2026 = 9 месяцев', () => {
    expect(period.durationInMonths(makePeriod(2025, 12, 'present'), ym(2026, 8))).toBe(9);
  });
});

describe('period.isOngoing', () => {
  it('открытый период — текущий, закрытый — нет', () => {
    expect(period.isOngoing(makePeriod(2025, 12, 'present'))).toBe(true);
    expect(period.isOngoing(makePeriod(2025, 1, [2025, 3]))).toBe(false);
  });
});

describe('period.overlaps', () => {
  it('разнесённые периоды не пересекаются', () => {
    expect(period.overlaps(makePeriod(2024, 1, [2024, 6]), makePeriod(2025, 1, [2025, 6]))).toBe(
      false,
    );
  });

  it('общий месяц — пересечение (счёт включительный)', () => {
    expect(period.overlaps(makePeriod(2024, 1, [2024, 6]), makePeriod(2024, 6, [2025, 1]))).toBe(
      true,
    );
    expect(period.overlaps(makePeriod(2024, 6, [2025, 1]), makePeriod(2024, 1, [2024, 6]))).toBe(
      true,
    );
  });

  it('вложенный период пересекается', () => {
    expect(period.overlaps(makePeriod(2024, 1, [2024, 12]), makePeriod(2024, 3, [2024, 5]))).toBe(
      true,
    );
  });

  it('открытый период пересекается с начавшимся позже', () => {
    expect(period.overlaps(makePeriod(2024, 1, 'present'), makePeriod(2025, 1, [2025, 6]))).toBe(
      true,
    );
  });

  it('открытый период не пересекается с завершившимся до него', () => {
    expect(period.overlaps(makePeriod(2025, 1, 'present'), makePeriod(2024, 1, [2024, 6]))).toBe(
      false,
    );
  });
});
