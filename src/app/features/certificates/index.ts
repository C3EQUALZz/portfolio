import type { EnvironmentProviders, Provider } from '@angular/core';

import { CERTIFICATES } from './application/certificates-store/certificates-store';

import { certificatesContent } from './infrastructure/content/certificates-content';
import { toCertificates } from './infrastructure/content/to-certificates';

export { CertificatesPage } from './ui/certificates-page/certificates-page';

/**
 * Provides the validated certificates. The content is static and covered by
 * the "content parses" spec; if it ever breaks, the app fails fast at
 * bootstrap with the breaking path instead of rendering a broken page.
 */
export function provideCertificatesFeature(): (Provider | EnvironmentProviders)[] {
  const parsed = toCertificates(certificatesContent);
  if (!parsed.ok) {
    throw new Error(`Invalid certificates content at ${parsed.error.path}`);
  }
  return [{ provide: CERTIFICATES, useValue: parsed.value }];
}
