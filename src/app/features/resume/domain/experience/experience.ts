import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import { err, ok, type Result } from '../../../../shared/kernel/result/result';
import type { Slug } from '../../../../shared/kernel/slug/slug';
import { period, type Period } from '../../../../shared/kernel/time/period';
import type { YearMonth } from '../../../../shared/kernel/time/year-month';
import type { Achievement } from '../achievement/achievement';
import type { Company } from '../company/company';
import type { Impact } from '../impact/impact';
import type { TechnologyCluster } from '../technology-cluster/technology-cluster';

/** Collaboration format: on-site, remote, hybrid, outstaff. See CONTEXT.md. */
export type Engagement = 'on-site' | 'remote' | 'hybrid' | 'outstaff';

/**
 * One period of work at one company on one product. Always created whole:
 * at least one achievement (a result, not a duty), unique impact labels
 * and a non-empty stack. See CONTEXT.md.
 */
export interface Experience {
  readonly id: Slug;
  readonly period: Period;
  readonly position: LocalizedText;
  readonly company: Company;
  readonly product: LocalizedText;
  readonly engagement: Engagement;
  readonly impacts: readonly Impact[];
  readonly achievements: readonly Achievement[];
  readonly technologies: readonly TechnologyCluster[];
}

export interface ExperienceInput {
  readonly id: Slug;
  readonly period: Period;
  readonly position: { readonly en: string; readonly ru: string };
  readonly company: Company;
  readonly product: { readonly en: string; readonly ru: string };
  readonly engagement: Engagement;
  readonly impacts: readonly Impact[];
  readonly achievements: readonly Achievement[];
  readonly technologies: readonly TechnologyCluster[];
}

export interface InvalidExperience {
  readonly kind: 'InvalidExperience';
}

const INVALID: InvalidExperience = { kind: 'InvalidExperience' };

export const experience = {
  create(input: ExperienceInput): Result<Experience, InvalidExperience> {
    if (input.achievements.length === 0 || input.technologies.length === 0) {
      return err(INVALID);
    }
    const labels = input.impacts.map((item) => item.label.en);
    if (new Set(labels).size !== labels.length) {
      return err(INVALID);
    }
    const position = localizedText.create(input.position);
    const product = localizedText.create(input.product);
    if (!position.ok || !product.ok) {
      return err(INVALID);
    }
    return ok({
      id: input.id,
      period: input.period,
      position: position.value,
      company: input.company,
      product: product.value,
      engagement: input.engagement,
      impacts: input.impacts,
      achievements: input.achievements,
      technologies: input.technologies,
    });
  },

  /** Months worked, inclusive counting. See Period. */
  duration(experience: Experience, asOf: YearMonth): number {
    return period.durationInMonths(experience.period, asOf);
  },

  isOngoing(experience: Experience): boolean {
    return period.isOngoing(experience.period);
  },
};
