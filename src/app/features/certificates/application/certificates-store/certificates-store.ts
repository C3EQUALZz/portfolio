import { inject, Injectable, InjectionToken, type Signal, signal } from '@angular/core';

import {
  certificateCatalog,
  type CertificateGroup,
} from '../../domain/certificate-catalog/certificate-catalog';
import type { Certificate } from '../../domain/certificate/certificate';

/**
 * DI token for the validated certificates. No repository port: the source is
 * static content, and toCertificates already validates it at the boundary.
 */
export const CERTIFICATES = new InjectionToken<readonly Certificate[]>('CERTIFICATES');

/** Feature state: certificates grouped into page blocks, newest first. */
@Injectable({ providedIn: 'root' })
export class CertificatesStore {
  private readonly certificates = inject(CERTIFICATES);

  readonly groups: Signal<readonly CertificateGroup[]> = signal(
    certificateCatalog.group(this.certificates),
  );
}
