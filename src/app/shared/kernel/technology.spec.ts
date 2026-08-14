import { describe, expect, it } from 'vitest';

import { technology } from './technology';

describe('Technology', () => {
  it('сохраняет каноническое имя и выводит slug из него', () => {
    const result = technology.create('PostgreSQL');

    expect(result).toEqual({ ok: true, value: { name: 'PostgreSQL', slug: 'postgresql' } });
  });

  it('выводит slug со спецсимволами: пробелы и точки становятся дефисами', () => {
    const result = technology.create('Spring Boot');

    expect(result).toEqual({ ok: true, value: { name: 'Spring Boot', slug: 'spring-boot' } });
  });

  it('отклоняет пустое имя', () => {
    expect(technology.create('')).toEqual({ ok: false, error: { kind: 'InvalidTechnology' } });
  });

  it('отклоняет имя, из которого не выводится slug', () => {
    expect(technology.create('!!!')).toEqual({ ok: false, error: { kind: 'InvalidTechnology' } });
  });
});
