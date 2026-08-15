import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { availability } from './availability';

const OPEN = {
  status: 'open' as const,
  base: { en: 'Rostov-on-Don', ru: 'Ростов-на-Дону' },
  relocatesTo: [
    { en: 'Moscow', ru: 'Москва' },
    { en: 'St. Petersburg', ru: 'Санкт-Петербург' },
  ],
  employment: { en: 'Full-time, on-site', ru: 'Полная занятость, офис' },
};

describe('availability', () => {
  it('creates an availability with base, relocation targets and employment', () => {
    const created = must(availability.create(OPEN));

    expect(created.status).toBe('open');
    expect(created.base.en).toBe('Rostov-on-Don');
    expect(created.relocatesTo).toHaveLength(2);
    expect(created.employment.ru).toBe('Полная занятость, офис');
  });

  it('accepts a closed status without relocation targets', () => {
    const created = must(availability.create({ ...OPEN, status: 'closed', relocatesTo: [] }));

    expect(created.status).toBe('closed');
    expect(created.relocatesTo).toHaveLength(0);
  });

  it('rejects an empty base', () => {
    expect(availability.create({ ...OPEN, base: { en: '', ru: '' } })).toEqual({
      ok: false,
      error: { kind: 'InvalidAvailability' },
    });
  });
});
