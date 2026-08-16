import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import {
  certificate,
  type Certificate,
  type CertificateCategory,
} from '../certificate/certificate';
import { certificateCatalog } from './certificate-catalog';

function sample(
  category: CertificateCategory,
  title: string,
  issued: { readonly year: number; readonly month: number },
): Certificate {
  return must(
    certificate.create({
      title: { en: title, ru: title },
      issuer: { en: 'Issuer', ru: 'Issuer' },
      category,
      issued,
      artifact: { kind: 'link', url: 'https://example.com/cert' },
    }),
  );
}

describe('certificateCatalog', () => {
  it('groups certificates by category in the fixed block order', () => {
    const groups = certificateCatalog.group([
      sample('hackathon', 'Hack', { year: 2025, month: 4 }),
      sample('professional', 'Astra', { year: 2025, month: 4 }),
      sample('course', 'Stepik', { year: 2022, month: 6 }),
    ]);

    expect(groups.map((group) => group.category)).toEqual(['professional', 'course', 'hackathon']);
  });

  it('sorts certificates inside a group newest first', () => {
    const groups = certificateCatalog.group([
      sample('course', 'Old', { year: 2022, month: 6 }),
      sample('course', 'New', { year: 2024, month: 2 }),
      sample('course', 'Mid', { year: 2023, month: 8 }),
    ]);

    expect(groups[0]?.certificates.map((item) => item.title.en)).toEqual(['New', 'Mid', 'Old']);
  });

  it('skips categories without certificates', () => {
    const groups = certificateCatalog.group([
      sample('hackathon', 'Hack', { year: 2025, month: 4 }),
    ]);

    expect(groups.map((group) => group.category)).toEqual(['hackathon']);
  });
});
