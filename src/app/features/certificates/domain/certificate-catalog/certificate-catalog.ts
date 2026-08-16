import { yearMonth } from '../../../../shared/kernel/time/year-month';
import {
  type Certificate,
  CERTIFICATE_CATEGORIES,
  type CertificateCategory,
} from '../certificate/certificate';

/** A page block: one category with its certificates, newest first. */
export interface CertificateGroup {
  readonly category: CertificateCategory;
  readonly certificates: readonly Certificate[];
}

export const certificateCatalog = {
  /**
   * Groups certificates into page blocks. Block order follows
   * CERTIFICATE_CATEGORIES; empty blocks are skipped.
   */
  group(certificates: readonly Certificate[]): readonly CertificateGroup[] {
    return CERTIFICATE_CATEGORIES.flatMap((category) => {
      const inCategory = certificates
        .filter((item) => item.category === category)
        .sort((a, b) => yearMonth.compare(b.issued, a.issued));
      return inCategory.length === 0 ? [] : [{ category, certificates: inCategory }];
    });
  },
};
