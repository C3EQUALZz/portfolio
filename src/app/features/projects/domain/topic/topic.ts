import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import { err, ok, type Result } from '../../../../shared/kernel/result/result';

/**
 * A short localized label on a Project card — "DI", "agents", "data
 * pipelines". One to four per project. See CONTEXT.md.
 */
export interface Topic {
  readonly label: LocalizedText;
}

export interface InvalidTopic {
  readonly kind: 'InvalidTopic';
}

const INVALID: InvalidTopic = { kind: 'InvalidTopic' };

export const topic = {
  create(input: { readonly en: string; readonly ru: string }): Result<Topic, InvalidTopic> {
    const label = localizedText.create(input);
    return label.ok ? ok({ label: label.value }) : err(INVALID);
  },
};
