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
});
