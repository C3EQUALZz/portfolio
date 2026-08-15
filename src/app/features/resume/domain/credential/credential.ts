import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import { err, ok, type Result } from '../../../../shared/kernel/result/result';

/** A certificate or completed course: title, optionally issuer and year. */
export interface Credential {
  readonly title: LocalizedText;
  readonly issuer?: LocalizedText;
  readonly year?: number;
}

export interface InvalidCredential {
  readonly kind: 'InvalidCredential';
}

const INVALID: InvalidCredential = { kind: 'InvalidCredential' };

export const credential = {
  create(input: {
    readonly title: { readonly en: string; readonly ru: string };
    readonly issuer?: { readonly en: string; readonly ru: string };
    readonly year?: number;
  }): Result<Credential, InvalidCredential> {
    const title = localizedText.create(input.title);
    if (!title.ok) {
      return err(INVALID);
    }
    const year = input.year === undefined ? {} : { year: input.year };
    if (input.issuer === undefined) {
      return ok({ title: title.value, ...year });
    }
    const issuer = localizedText.create(input.issuer);
    return issuer.ok ? ok({ title: title.value, issuer: issuer.value, ...year }) : err(INVALID);
  },
};
