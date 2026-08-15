import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import { err, ok, type Result } from '../../../../shared/kernel/result/result';

/**
 * A change the candidate brought about within one Experience — a result,
 * not a duty: a bold lead-in plus the story behind it. See CONTEXT.md.
 */
export interface Achievement {
  readonly lead: LocalizedText;
  readonly detail: LocalizedText;
}

export interface InvalidAchievement {
  readonly kind: 'InvalidAchievement';
}

const INVALID: InvalidAchievement = { kind: 'InvalidAchievement' };

export const achievement = {
  create(input: {
    readonly lead: { readonly en: string; readonly ru: string };
    readonly detail: { readonly en: string; readonly ru: string };
  }): Result<Achievement, InvalidAchievement> {
    const lead = localizedText.create(input.lead);
    const detail = localizedText.create(input.detail);
    if (!lead.ok || !detail.ok) {
      return err(INVALID);
    }
    return ok({ lead: lead.value, detail: detail.value });
  },
};
