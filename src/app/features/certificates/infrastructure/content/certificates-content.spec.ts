import { describe, expect, it } from 'vitest';

import { certificateCatalog } from '../../domain/certificate-catalog/certificate-catalog';

import { certificatesContent } from './certificates-content';
import { toCertificates } from './to-certificates';

describe('certificatesContent', () => {
  it('parses without errors', () => {
    expect(toCertificates(certificatesContent)).toMatchObject({ ok: true });
  });

  it('covers all three blocks: professional, courses and hackathon', () => {
    const parsed = toCertificates(certificatesContent);
    if (!parsed.ok) {
      throw new Error('content must parse');
    }

    const groups = certificateCatalog.group(parsed.value);
    expect(groups.map((group) => group.category)).toEqual(['professional', 'course', 'hackathon']);
    expect(groups[0]?.certificates).toHaveLength(2);
    expect(groups[1]?.certificates).toHaveLength(7);
    expect(groups[2]?.certificates).toHaveLength(1);
  });

  it('ships every pdf artifact from public/certificates', () => {
    const parsed = toCertificates(certificatesContent);
    if (!parsed.ok) {
      throw new Error('content must parse');
    }

    const pdfs = parsed.value
      .map((item) => item.artifact)
      .filter((artifact) => artifact.kind === 'pdf')
      .map((artifact) => artifact.path);
    expect(pdfs).toEqual([
      'certificates/astra-linux-1702.pdf',
      'certificates/astra-linux-1703.pdf',
      'certificates/hackathon-2025.pdf',
    ]);
  });

  it('reports the breaking entry index when content is invalid', () => {
    const broken = [
      certificatesContent[0]!,
      { ...certificatesContent[1]!, issued: { year: 2025, month: 13 } },
    ];

    expect(toCertificates(broken)).toEqual({
      ok: false,
      error: { kind: 'InvalidCertificatesContent', path: 'certificates[1]' },
    });
  });
});
