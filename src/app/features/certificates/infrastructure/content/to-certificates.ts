import { certificate, type Certificate } from '../../domain/certificate/certificate';

import { collect, err, ok, type Result } from '../../../../shared/kernel/result/result';

/** Raw content shape: plain strings, validated at the boundary. */
export interface CertificateDto {
  readonly title: { readonly en: string; readonly ru: string };
  readonly issuer: { readonly en: string; readonly ru: string };
  readonly category: string;
  readonly issued: { readonly year: number; readonly month: number };
  readonly artifact:
    | { readonly kind: 'pdf'; readonly path: string }
    | { readonly kind: 'link'; readonly url: string };
}

interface InvalidCertificatesContent {
  readonly kind: 'InvalidCertificatesContent';
  /** Where the content broke, e.g. "certificates[2]". */
  readonly path: string;
}

/** Maps the raw content literal to validated Certificate entities. */
export function toCertificates(
  dto: readonly CertificateDto[],
): Result<readonly Certificate[], InvalidCertificatesContent> {
  return collect(
    dto.map((item, index) => {
      const parsed = certificate.create({
        title: item.title,
        issuer: item.issuer,
        category: item.category as Certificate['category'],
        issued: item.issued,
        artifact: item.artifact,
      });
      return parsed.ok
        ? ok(parsed.value)
        : err({
            kind: 'InvalidCertificatesContent' as const,
            path: `certificates[${index.toString()}]`,
          });
    }),
  );
}
