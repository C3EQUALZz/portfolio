import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import { err, ok, type Result } from '../../../../shared/kernel/result/result';

/**
 * A claim about the result of an Experience. The label poses the question,
 * the value answers it — with a number ("−40% manager load") or a word
 * ("compile-time"). See CONTEXT.md. Both are content, so both are localized.
 */
export interface Impact {
  readonly label: LocalizedText;
  readonly value: ImpactValue;
}

type ImpactValue =
  | {
      readonly kind: 'numeric';
      readonly amount: number;
      readonly unit: ImpactUnit;
      readonly direction: ImpactDirection;
    }
  | { readonly kind: 'literal'; readonly text: LocalizedText };

export type ImpactUnit = 'percent' | 'times' | 'milliseconds' | 'none';
export type ImpactDirection = 'increase' | 'decrease' | 'absolute';

export interface InvalidImpact {
  readonly kind: 'InvalidImpact';
}

const INVALID: InvalidImpact = { kind: 'InvalidImpact' };

export const impact = {
  numeric(input: {
    readonly label: { readonly en: string; readonly ru: string };
    readonly amount: number;
    readonly unit: ImpactUnit;
    readonly direction: ImpactDirection;
  }): Result<Impact, InvalidImpact> {
    const label = localizedText.create(input.label);
    if (!label.ok) {
      return err(INVALID);
    }
    return ok({
      label: label.value,
      value: {
        kind: 'numeric',
        amount: input.amount,
        unit: input.unit,
        direction: input.direction,
      },
    });
  },

  literal(input: {
    readonly label: { readonly en: string; readonly ru: string };
    readonly text: { readonly en: string; readonly ru: string };
  }): Result<Impact, InvalidImpact> {
    const label = localizedText.create(input.label);
    const text = localizedText.create(input.text);
    if (!label.ok || !text.ok) {
      return err(INVALID);
    }
    return ok({ label: label.value, value: { kind: 'literal', text: text.value } });
  },

  /** Only numeric values can be animated as counters. */
  isAnimatable(impact: Impact): boolean {
    return impact.value.kind === 'numeric';
  },
};
