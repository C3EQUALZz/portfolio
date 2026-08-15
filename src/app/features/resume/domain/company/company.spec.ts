import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { company } from './company';

describe('company', () => {
  it('creates a company with a name and an optional site', () => {
    const withSite = must(company.create('Ecom.tech', 'https://ecom.tech'));
    const withoutSite = must(company.create('Iktin Group'));

    expect(withSite.name).toBe('Ecom.tech');
    expect(withSite.site).toBe('https://ecom.tech');
    expect(withoutSite.site).toBeUndefined();
  });

  it('rejects an empty name', () => {
    expect(company.create('')).toEqual({ ok: false, error: { kind: 'InvalidCompany' } });
  });

  it('rejects a non-https site', () => {
    expect(company.create('Ecom.tech', 'http://ecom.tech')).toEqual({
      ok: false,
      error: { kind: 'InvalidCompany' },
    });
  });
});
