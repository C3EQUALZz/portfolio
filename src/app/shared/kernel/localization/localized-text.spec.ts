import { describe, expect, it } from 'vitest';

import { must } from '../../testing/must';
import { localizedText } from './localized-text';

describe('LocalizedText', () => {
  it('принимает текст с обеими локалями', () => {
    const result = localizedText.create({ en: 'Nine months', ru: 'Девять месяцев' });

    expect(result).toEqual({ ok: true, value: { en: 'Nine months', ru: 'Девять месяцев' } });
  });

  it.each([
    ['пустой en', { en: '', ru: 'Девять месяцев' }],
    ['пустой ru', { en: 'Nine months', ru: '' }],
    ['оба пустые', { en: '', ru: '' }],
  ])('отклоняет ввод: %s', (_name, input) => {
    expect(localizedText.create(input)).toEqual({
      ok: false,
      error: { kind: 'InvalidLocalizedText' },
    });
  });

  it.each([
    ['en' as const, 'Nine months'],
    ['ru' as const, 'Девять месяцев'],
  ])('pick выбирает локаль %s', (locale, expected) => {
    const text = must(localizedText.create({ en: 'Nine months', ru: 'Девять месяцев' }));

    expect(localizedText.pick(text, locale)).toBe(expected);
  });
});
