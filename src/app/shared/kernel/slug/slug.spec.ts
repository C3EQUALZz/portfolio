import { describe, expect, it } from 'vitest';

import { slug } from './slug';

describe('Slug', () => {
  it('принимает slug со строчными буквами, цифрами и дефисами', () => {
    expect(slug.create('dishka-telegram-2')).toEqual({ ok: true, value: 'dishka-telegram-2' });
  });

  it.each(['Dishka', 'dishka--telegram', '-dishka', 'dishka-', 'dishka telegram', ''])(
    'отклоняет «%s»',
    (raw) => {
      expect(slug.create(raw)).toEqual({ ok: false, error: { kind: 'InvalidSlug' } });
    },
  );

  it('derive нормализует имя: строчные буквы, дефисы вместо прочих символов', () => {
    expect(slug.derive('Dishka AG2')).toEqual({ ok: true, value: 'dishka-ag2' });
    expect(slug.derive('dishka-ag2')).toEqual({ ok: true, value: 'dishka-ag2' });
  });

  it('derive отклоняет имя, из которого не выводится slug', () => {
    expect(slug.derive('   ')).toEqual({ ok: false, error: { kind: 'InvalidSlug' } });
  });
});
