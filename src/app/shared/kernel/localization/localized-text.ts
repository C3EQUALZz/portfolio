import { nonEmptyString, type NonEmptyString } from '../non-empty-string/non-empty-string';
import { err, ok, type Result } from '../result/result';

/**
 * Content text in two locales (ADR-0001). Both are required and live side by
 * side so the versions cannot drift apart. Choosing the current locale is the
 * UI layer's job — the domain knows nothing about language switching.
 */
export interface LocalizedText {
  readonly en: NonEmptyString;
  readonly ru: NonEmptyString;
}

export interface InvalidLocalizedText {
  readonly kind: 'InvalidLocalizedText';
}

const INVALID: InvalidLocalizedText = { kind: 'InvalidLocalizedText' };

export const localizedText = {
  create(input: {
    readonly en: string;
    readonly ru: string;
  }): Result<LocalizedText, InvalidLocalizedText> {
    const en = nonEmptyString.create(input.en);
    const ru = nonEmptyString.create(input.ru);
    return en.ok && ru.ok ? ok({ en: en.value, ru: ru.value }) : err(INVALID);
  },
};
