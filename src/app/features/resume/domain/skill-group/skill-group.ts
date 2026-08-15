import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import { collect, err, ok, type Result } from '../../../../shared/kernel/result/result';
import { technology, type Technology } from '../../../../shared/kernel/technology/technology';

/**
 * A titled section of the stack — "Data & transport" — with a flat list of
 * technologies inside. The emphasis says what the candidate considers
 * important; how it looks is the UI layer's decision. See CONTEXT.md.
 */
export interface SkillGroupEntry {
  readonly technology: Technology;
  readonly emphasis: 'lead' | 'supporting';
}

export interface SkillGroup {
  readonly title: LocalizedText;
  readonly entries: readonly SkillGroupEntry[];
}

export interface InvalidSkillGroup {
  readonly kind: 'InvalidSkillGroup';
}

const INVALID: InvalidSkillGroup = { kind: 'InvalidSkillGroup' };

export const skillGroup = {
  create(input: {
    readonly title: { readonly en: string; readonly ru: string };
    readonly entries: readonly {
      readonly technology: string;
      readonly emphasis: 'lead' | 'supporting';
    }[];
  }): Result<SkillGroup, InvalidSkillGroup> {
    const title = localizedText.create(input.title);
    const entries = collect(
      input.entries.map((entry) => {
        const parsed = technology.create(entry.technology);
        return parsed.ok
          ? ok<SkillGroupEntry>({ technology: parsed.value, emphasis: entry.emphasis })
          : err(INVALID);
      }),
    );
    if (!title.ok || !entries.ok) {
      return err(INVALID);
    }
    if (entries.value.length === 0) {
      return err(INVALID);
    }
    const slugs = entries.value.map((entry) => entry.technology.slug);
    if (new Set(slugs).size !== slugs.length) {
      return err(INVALID);
    }
    return ok({ title: title.value, entries: entries.value });
  },
};
