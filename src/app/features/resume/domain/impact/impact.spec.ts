import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { impact, type Impact } from './impact';

const LABEL = {
  en: 'Manager load with RAG answering routine requests',
  ru: 'Нагрузка на менеджеров',
};

describe('impact', () => {
  it('creates a numeric impact with amount, unit and direction', () => {
    const created = must(
      impact.numeric({ label: LABEL, amount: 40, unit: 'percent', direction: 'decrease' }),
    );

    expect(created.value).toEqual({
      kind: 'numeric',
      amount: 40,
      unit: 'percent',
      direction: 'decrease',
    });
    expect(created.label.ru).toBe('Нагрузка на менеджеров');
  });

  it('creates a literal impact for worded values', () => {
    const created = must(
      impact.literal({
        label: { en: 'Realtime scaling', ru: 'Масштабирование realtime' },
        text: { en: 'horizontal', ru: 'горизонтально' },
      }),
    );

    expect(created.value).toEqual({
      kind: 'literal',
      text: { en: 'horizontal', ru: 'горизонтально' },
    });
  });

  it('rejects an empty label', () => {
    expect(
      impact.literal({
        label: { en: '', ru: 'Метка' },
        text: { en: 'horizontal', ru: 'горизонтально' },
      }),
    ).toEqual({ ok: false, error: { kind: 'InvalidImpact' } });
  });

  it('rejects an empty literal text', () => {
    expect(
      impact.literal({
        label: { en: 'Realtime scaling', ru: 'Масштабирование realtime' },
        text: { en: 'horizontal', ru: ' ' },
      }),
    ).toEqual({ ok: false, error: { kind: 'InvalidImpact' } });
  });

  it('isAnimatable is true only for numeric values', () => {
    const numeric: Impact = must(
      impact.numeric({ label: LABEL, amount: 50, unit: 'percent', direction: 'decrease' }),
    );
    const literal: Impact = must(
      impact.literal({
        label: { en: 'Waybill creation', ru: 'Создание накладных' },
        text: { en: 'voice', ru: 'голосом' },
      }),
    );

    expect(impact.isAnimatable(numeric)).toBe(true);
    expect(impact.isAnimatable(literal)).toBe(false);
  });
});
