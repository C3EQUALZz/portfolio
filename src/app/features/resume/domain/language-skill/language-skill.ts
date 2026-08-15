import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import { err, ok, type Result } from '../../../../shared/kernel/result/result';

/** A language the candidate speaks, with a CEFR level or 'native'. */
export type LanguageLevel = 'native' | 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';

export interface LanguageSkill {
  readonly language: LocalizedText;
  readonly level: LanguageLevel;
}

export interface InvalidLanguageSkill {
  readonly kind: 'InvalidLanguageSkill';
}

const INVALID: InvalidLanguageSkill = { kind: 'InvalidLanguageSkill' };

export const languageSkill = {
  create(input: {
    readonly language: { readonly en: string; readonly ru: string };
    readonly level: LanguageLevel;
  }): Result<LanguageSkill, InvalidLanguageSkill> {
    const language = localizedText.create(input.language);
    return language.ok ? ok({ language: language.value, level: input.level }) : err(INVALID);
  },
};
