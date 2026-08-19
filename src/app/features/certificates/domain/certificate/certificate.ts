import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import {
  nonEmptyString,
  type NonEmptyString,
} from '../../../../shared/kernel/non-empty-string/non-empty-string';
import { err, ok, type Result } from '../../../../shared/kernel/result/result';
import { yearMonth, type YearMonth } from '../../../../shared/kernel/time/year-month';
import { httpsUrl, type HttpsUrl } from '../../../../shared/kernel/url/https-url';

/** Logical block the certificate belongs to on the certificates page. */
export type CertificateCategory = 'professional' | 'course' | 'hackathon';

/** Display order of the blocks on the certificates page. */
export const CERTIFICATE_CATEGORIES: readonly CertificateCategory[] = [
  'professional',
  'course',
  'hackathon',
];

/**
 * How the visitor inspects the certificate: a PDF hosted with the site
 * (opened in the page viewer) or an external verification page.
 */
export type CertificateArtifact =
  | { readonly kind: 'pdf'; readonly path: NonEmptyString }
  | { readonly kind: 'link'; readonly url: HttpsUrl };

/** A earned certificate: course, professional certification or hackathon. */
export interface Certificate {
  readonly title: LocalizedText;
  readonly issuer: LocalizedText;
  readonly category: CertificateCategory;
  readonly issued: YearMonth;
  readonly artifact: CertificateArtifact;
}

export interface InvalidCertificate {
  readonly kind: 'InvalidCertificate';
}

const INVALID: InvalidCertificate = { kind: 'InvalidCertificate' };

function isCategory(raw: string): raw is CertificateCategory {
  return (CERTIFICATE_CATEGORIES as readonly string[]).includes(raw);
}

type ArtifactInput =
  { readonly kind: 'pdf'; readonly path: string } | { readonly kind: 'link'; readonly url: string };

/**
 * PDF artifacts are local assets only: a fixed public/certificates directory
 * and a plain kebab-case filename. This is what lets the UI trust the path in
 * an iframe without opening a redirect / traversal hole (Sonar S6268).
 */
const PDF_PATH_PATTERN = /^certificates\/[a-z0-9-]+\.pdf$/;

function parseArtifact(input: ArtifactInput): Result<CertificateArtifact, InvalidCertificate> {
  if (input.kind === 'pdf') {
    const path = nonEmptyString.create(input.path);
    return path.ok && PDF_PATH_PATTERN.test(path.value)
      ? ok({ kind: 'pdf', path: path.value })
      : err(INVALID);
  }
  const url = httpsUrl.create(input.url);
  return url.ok ? ok({ kind: 'link', url: url.value }) : err(INVALID);
}

export const certificate = {
  create(input: {
    readonly title: { readonly en: string; readonly ru: string };
    readonly issuer: { readonly en: string; readonly ru: string };
    readonly category: CertificateCategory;
    readonly issued: { readonly year: number; readonly month: number };
    readonly artifact: ArtifactInput;
  }): Result<Certificate, InvalidCertificate> {
    const title = localizedText.create(input.title);
    const issuer = localizedText.create(input.issuer);
    const issued = yearMonth.create(input.issued.year, input.issued.month);
    const artifact = parseArtifact(input.artifact);
    if (!title.ok || !issuer.ok || !issued.ok || !artifact.ok || !isCategory(input.category)) {
      return err(INVALID);
    }
    return ok({
      title: title.value,
      issuer: issuer.value,
      category: input.category,
      issued: issued.value,
      artifact: artifact.value,
    });
  },
};
