import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import { collect, err, ok, type Result } from '../../../../shared/kernel/result/result';

/**
 * The candidate's readiness for work: open or not, the base city,
 * where they would relocate and in which employment format. See CONTEXT.md.
 */
export interface Availability {
  readonly status: 'open' | 'closed';
  readonly base: LocalizedText;
  readonly relocatesTo: readonly LocalizedText[];
  readonly employment: LocalizedText;
}

export interface InvalidAvailability {
  readonly kind: 'InvalidAvailability';
}

const INVALID: InvalidAvailability = { kind: 'InvalidAvailability' };

export const availability = {
  create(input: {
    readonly status: 'open' | 'closed';
    readonly base: { readonly en: string; readonly ru: string };
    readonly relocatesTo: readonly { readonly en: string; readonly ru: string }[];
    readonly employment: { readonly en: string; readonly ru: string };
  }): Result<Availability, InvalidAvailability> {
    const base = localizedText.create(input.base);
    const relocatesTo = collect(input.relocatesTo.map((city) => localizedText.create(city)));
    const employment = localizedText.create(input.employment);
    if (!base.ok || !relocatesTo.ok || !employment.ok) {
      return err(INVALID);
    }
    return ok({
      status: input.status,
      base: base.value,
      relocatesTo: relocatesTo.value,
      employment: employment.value,
    });
  },
};
