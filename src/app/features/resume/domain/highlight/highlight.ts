import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import { err, ok, type Result } from '../../../../shared/kernel/result/result';

/**
 * A short statement of what the candidate emphasizes about themselves.
 * The topic is a typed union; which icon to render is the UI layer's call.
 */
export type HighlightTopic = 'architecture' | 'open-source' | 'collaboration';

export interface Highlight {
  readonly topic: HighlightTopic;
  readonly text: LocalizedText;
}

export interface InvalidHighlight {
  readonly kind: 'InvalidHighlight';
}

const INVALID: InvalidHighlight = { kind: 'InvalidHighlight' };

export const highlight = {
  create(input: {
    readonly topic: HighlightTopic;
    readonly text: { readonly en: string; readonly ru: string };
  }): Result<Highlight, InvalidHighlight> {
    const text = localizedText.create(input.text);
    return text.ok ? ok({ topic: input.topic, text: text.value }) : err(INVALID);
  },
};
