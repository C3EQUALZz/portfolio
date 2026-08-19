import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { certificate } from './certificate';

const validInput = {
  title: { en: 'Astra Linux AL-1702', ru: 'Astra Linux AL-1702' },
  issuer: { en: 'Astra Linux', ru: 'Astra Linux' },
  category: 'professional' as const,
  issued: { year: 2025, month: 4 },
  artifact: { kind: 'pdf' as const, path: 'certificates/astra-linux-1702.pdf' },
};

describe('certificate', () => {
  it('creates a certificate with a pdf artifact', () => {
    const value = must(certificate.create(validInput));

    expect(value.title.en).toBe('Astra Linux AL-1702');
    expect(value.issuer.ru).toBe('Astra Linux');
    expect(value.category).toBe('professional');
    expect(value.issued).toBe('2025-04');
    expect(value.artifact).toEqual({
      kind: 'pdf',
      path: 'certificates/astra-linux-1702.pdf',
    });
  });

  it('creates a certificate with an external link artifact', () => {
    const value = must(
      certificate.create({
        ...validInput,
        category: 'course',
        artifact: { kind: 'link', url: 'https://stepik.org/cert/1560586' },
      }),
    );

    expect(value.artifact).toEqual({ kind: 'link', url: 'https://stepik.org/cert/1560586' });
  });

  it('rejects an empty title', () => {
    expect(certificate.create({ ...validInput, title: { en: '', ru: 'AL-1702' } })).toEqual({
      ok: false,
      error: { kind: 'InvalidCertificate' },
    });
  });

  it('rejects an unknown category', () => {
    expect(certificate.create({ ...validInput, category: 'diploma' as never })).toEqual({
      ok: false,
      error: { kind: 'InvalidCertificate' },
    });
  });

  it('rejects an insecure artifact url', () => {
    expect(
      certificate.create({
        ...validInput,
        artifact: { kind: 'link', url: 'http://stepik.org/cert/1560586' },
      }),
    ).toEqual({ ok: false, error: { kind: 'InvalidCertificate' } });
  });

  it('rejects an empty pdf path', () => {
    expect(certificate.create({ ...validInput, artifact: { kind: 'pdf', path: '  ' } })).toEqual({
      ok: false,
      error: { kind: 'InvalidCertificate' },
    });
  });

  it('rejects a pdf path outside the local certificates directory', () => {
    const traversal = certificate.create({
      ...validInput,
      artifact: { kind: 'pdf', path: '../secret.pdf' },
    });
    const external = certificate.create({
      ...validInput,
      artifact: { kind: 'pdf', path: 'https://evil.example/x.pdf' },
    });

    expect(traversal).toEqual({ ok: false, error: { kind: 'InvalidCertificate' } });
    expect(external).toEqual({ ok: false, error: { kind: 'InvalidCertificate' } });
  });

  it('rejects an impossible issue date', () => {
    expect(certificate.create({ ...validInput, issued: { year: 2025, month: 13 } })).toEqual({
      ok: false,
      error: { kind: 'InvalidCertificate' },
    });
  });
});
