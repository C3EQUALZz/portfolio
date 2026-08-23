import { computed, inject, Injectable, InjectionToken, type Signal } from '@angular/core';

import {
  certificateCatalog,
  type CertificateGroup,
} from '../../../domain/certificate-catalog/certificate-catalog';
import type { Certificate } from '../../../domain/certificate/certificate';

import type { Query, QueryHandler } from '../../../../../shared/cqs/query/query';

/**
 * DI token for the validated certificates. No repository port: the source is
 * static content, and toCertificates already validates it at the boundary.
 */
export const CERTIFICATES = new InjectionToken<readonly Certificate[]>('CERTIFICATES');

/** Asks for the certificates grouped into page blocks, newest first. */
export interface GetCertificateGroupsQuery extends Query {
  readonly kind: 'getCertificateGroups';
}

/**
 * Answers GetCertificateGroupsQuery over the injected validated certificates.
 * The content is static, so a computed over the token is enough — no resource.
 */
@Injectable({ providedIn: 'root' })
export class GetCertificateGroupsHandler implements QueryHandler<
  GetCertificateGroupsQuery,
  readonly CertificateGroup[]
> {
  private readonly certificates = inject(CERTIFICATES);

  handle(_query: GetCertificateGroupsQuery): Signal<readonly CertificateGroup[]> {
    return computed(() => certificateCatalog.group(this.certificates));
  }
}
