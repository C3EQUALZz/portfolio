import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import { err, ok, type Result } from '../../../../shared/kernel/result/result';

/** Formal education: institution, program, city and the graduation year. */
export interface Education {
  readonly institution: LocalizedText;
  readonly program: LocalizedText;
  readonly city: LocalizedText;
  readonly graduationYear: number;
}

export interface InvalidEducation {
  readonly kind: 'InvalidEducation';
}

const INVALID: InvalidEducation = { kind: 'InvalidEducation' };

export const education = {
  create(input: {
    readonly institution: { readonly en: string; readonly ru: string };
    readonly program: { readonly en: string; readonly ru: string };
    readonly city: { readonly en: string; readonly ru: string };
    readonly graduationYear: number;
  }): Result<Education, InvalidEducation> {
    const institution = localizedText.create(input.institution);
    const program = localizedText.create(input.program);
    const city = localizedText.create(input.city);
    if (!institution.ok || !program.ok || !city.ok) {
      return err(INVALID);
    }
    return ok({
      institution: institution.value,
      program: program.value,
      city: city.value,
      graduationYear: input.graduationYear,
    });
  },
};
