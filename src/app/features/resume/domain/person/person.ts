import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import {
  nonEmptyString,
  type NonEmptyString,
} from '../../../../shared/kernel/non-empty-string/non-empty-string';
import { collect, err, ok, type Result } from '../../../../shared/kernel/result/result';

/**
 * The person the Resume describes. The name is a proper noun (not localized);
 * the headline, rotating roles and summary are content — localized.
 */
export interface Person {
  readonly name: NonEmptyString;
  readonly headline: LocalizedText;
  readonly roleHeadlines: readonly LocalizedText[];
  readonly summary: LocalizedText;
}

export interface InvalidPerson {
  readonly kind: 'InvalidPerson';
}

const INVALID: InvalidPerson = { kind: 'InvalidPerson' };

export const person = {
  create(input: {
    readonly name: string;
    readonly headline: { readonly en: string; readonly ru: string };
    readonly roleHeadlines: readonly { readonly en: string; readonly ru: string }[];
    readonly summary: { readonly en: string; readonly ru: string };
  }): Result<Person, InvalidPerson> {
    const name = nonEmptyString.create(input.name);
    const headline = localizedText.create(input.headline);
    const summary = localizedText.create(input.summary);
    const roleHeadlines = collect(input.roleHeadlines.map((role) => localizedText.create(role)));
    if (!name.ok || !headline.ok || !summary.ok || !roleHeadlines.ok) {
      return err(INVALID);
    }
    if (roleHeadlines.value.length === 0) {
      return err(INVALID);
    }
    return ok({
      name: name.value,
      headline: headline.value,
      roleHeadlines: roleHeadlines.value,
      summary: summary.value,
    });
  },
};
