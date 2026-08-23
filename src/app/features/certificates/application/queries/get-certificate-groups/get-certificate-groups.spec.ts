import { TestBed } from '@angular/core/testing';

import { certificateCatalog } from '../../../domain/certificate-catalog/certificate-catalog';
import { CERTIFICATE_CATEGORIES } from '../../../domain/certificate/certificate';

import { provideCertificatesFeature } from '../../..';
import { CERTIFICATES, GetCertificateGroupsHandler } from './get-certificate-groups';

describe('GetCertificateGroupsHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideCertificatesFeature()] });
  });

  it('returns the same groups the domain catalog builds from the real content', () => {
    const handler = TestBed.inject(GetCertificateGroupsHandler);
    const certificates = TestBed.inject(CERTIFICATES);

    const groups = handler.handle({ kind: 'getCertificateGroups' });

    expect(groups()).toEqual(certificateCatalog.group(certificates));
  });

  it('orders the blocks by CERTIFICATE_CATEGORIES and skips the empty ones', () => {
    const handler = TestBed.inject(GetCertificateGroupsHandler);
    const certificates = TestBed.inject(CERTIFICATES);

    const groups = handler.handle({ kind: 'getCertificateGroups' })();

    const present = CERTIFICATE_CATEGORIES.filter((category) =>
      certificates.some((item) => item.category === category),
    );
    expect(groups.map((group) => group.category)).toEqual(present);
  });

  it('keeps every real certificate in exactly one block, none lost to grouping', () => {
    const handler = TestBed.inject(GetCertificateGroupsHandler);
    const certificates = TestBed.inject(CERTIFICATES);

    const groups = handler.handle({ kind: 'getCertificateGroups' })();

    expect(groups.flatMap((group) => group.certificates)).toHaveLength(certificates.length);
  });
});
