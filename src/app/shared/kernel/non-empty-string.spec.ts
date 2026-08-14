import { describe, expect, it } from 'vitest';

import { nonEmptyString } from './non-empty-string';

describe('NonEmptyString', () => {
  it('принимает непустую строку', () => {
    expect(nonEmptyString.create('PostgreSQL')).toEqual({ ok: true, value: 'PostgreSQL' });
  });

  it('отклоняет пустую строку', () => {
    const result = nonEmptyString.create('');

    expect(result).toEqual({ ok: false, error: { kind: 'EmptyString' } });
  });

  it('отклоняет строку из одних пробелов', () => {
    const result = nonEmptyString.create('   ');

    expect(result).toEqual({ ok: false, error: { kind: 'EmptyString' } });
  });
});
