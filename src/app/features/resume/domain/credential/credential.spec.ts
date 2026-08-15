import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { credential } from './credential';

describe('credential', () => {
  it('creates a credential with optional issuer and year', () => {
    const full = must(
      credential.create({
        title: { en: 'Astra Linux AL-1702', ru: 'Astra Linux AL-1702' },
        issuer: { en: 'Astra Linux', ru: 'Astra Linux' },
        year: 2024,
      }),
    );
    const bare = must(credential.create({ title: { en: 'Hack 2025', ru: 'Hack 2025' } }));

    expect(full.issuer?.en).toBe('Astra Linux');
    expect(full.year).toBe(2024);
    expect(bare.issuer).toBeUndefined();
    expect(bare.year).toBeUndefined();
  });

  it('rejects an empty title', () => {
    expect(credential.create({ title: { en: '', ru: '' } })).toEqual({
      ok: false,
      error: { kind: 'InvalidCredential' },
    });
  });
});
