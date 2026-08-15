import { describe, expect, it } from 'vitest';

import { must } from '../../testing/must';
import { yearMonth } from './year-month';

describe('YearMonth', () => {
  it('принимает год и месяц в диапазоне 1–12', () => {
    const result = yearMonth.create(2025, 12);

    expect(result.ok).toBe(true);
  });

  it.each([0, 13, -1])('отклоняет месяц %i', (month) => {
    expect(yearMonth.create(2025, month)).toEqual({
      ok: false,
      error: { kind: 'InvalidYearMonth' },
    });
  });

  it('compare упорядочивает сначала по году, потом по месяцу', () => {
    const dec2024 = yearMonth.create(2024, 12);
    const jun2025 = yearMonth.create(2025, 6);
    const dec2025 = yearMonth.create(2025, 12);
    if (!dec2024.ok || !jun2025.ok || !dec2025.ok) {
      throw new Error('failed to create YearMonth');
    }

    expect(yearMonth.compare(dec2024.value, jun2025.value)).toBe(-1);
    expect(yearMonth.compare(dec2025.value, jun2025.value)).toBe(1);
    expect(yearMonth.compare(jun2025.value, jun2025.value)).toBe(0);
  });

  it('diffInMonths returns the signed distance in months', () => {
    const dec2024 = must(yearMonth.create(2024, 12));
    const jun2025 = must(yearMonth.create(2025, 6));

    expect(yearMonth.diffInMonths(jun2025, dec2024)).toBe(6);
    expect(yearMonth.diffInMonths(dec2024, jun2025)).toBe(-6);
    expect(yearMonth.diffInMonths(jun2025, jun2025)).toBe(0);
  });
});
