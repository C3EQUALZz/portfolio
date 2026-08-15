import {
  nonEmptyString,
  type NonEmptyString,
} from '../../../../shared/kernel/non-empty-string/non-empty-string';
import { err, ok, type Result } from '../../../../shared/kernel/result/result';
import { httpsUrl, type HttpsUrl } from '../../../../shared/kernel/url/https-url';

/** The company behind an Experience. A proper noun — not localized. */
export interface Company {
  readonly name: NonEmptyString;
  readonly site?: HttpsUrl;
}

export interface InvalidCompany {
  readonly kind: 'InvalidCompany';
}

const INVALID: InvalidCompany = { kind: 'InvalidCompany' };

export const company = {
  create(name: string, site?: string): Result<Company, InvalidCompany> {
    const validName = nonEmptyString.create(name);
    if (!validName.ok) {
      return err(INVALID);
    }
    if (site === undefined) {
      return ok({ name: validName.value });
    }
    const url = httpsUrl.create(site);
    return url.ok ? ok({ name: validName.value, site: url.value }) : err(INVALID);
  },
};
