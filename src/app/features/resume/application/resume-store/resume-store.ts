import { computed, inject, Injectable, InjectionToken, resource, type Signal } from '@angular/core';

import { resume, type Resume } from '../../domain/resume/resume';
import type { ResumeRepository } from '../../domain/resume/resume-repository';

import { type Technology } from '../../../../shared/kernel/technology/technology';
import { yearMonth, type YearMonth } from '../../../../shared/kernel/time/year-month';

/** DI token for the domain port; the adapter is wired by provideResumeFeature. */
export const RESUME_REPOSITORY = new InjectionToken<ResumeRepository>('RESUME_REPOSITORY');

/** Technologies the hero ring shows: the lead pick from the skill groups. */
const HERO_RING_LIMIT = 18;

/**
 * Feature state: the Resume loaded through the port, plus derived signals.
 * Works only through the port — the adapter choice (static content, JSON,
 * CMS) is invisible here.
 */
@Injectable({ providedIn: 'root' })
export class ResumeStore {
  private readonly repository = inject(RESUME_REPOSITORY);
  /** asOf is fixed at page load; the resume does not age while you read it. */
  private readonly asOf: YearMonth = yearMonth.fromDate(new Date());

  private readonly resumeResource = resource({
    loader: async () => {
      const result = await this.repository.load();
      if (!result.ok) {
        throw new Error(result.error.kind);
      }
      return result.value;
    },
  });

  readonly data: Signal<Resume | undefined> = this.resumeResource.value;
  readonly isLoading = this.resumeResource.isLoading;
  readonly failed = this.resumeResource.error;

  readonly currentRole = computed(() => {
    const value = this.data();
    return value === undefined ? undefined : resume.currentRole(value);
  });

  readonly totalExperience = computed(() => {
    const value = this.data();
    return value === undefined ? undefined : resume.totalExperience(value, this.asOf);
  });

  readonly leadTechnologies: Signal<readonly Technology[]> = computed(() => {
    const value = this.data();
    if (value === undefined) {
      return [];
    }
    return value.skillGroups
      .flatMap((group) => group.entries)
      .filter((entry) => entry.emphasis === 'lead')
      .map((entry) => entry.technology)
      .slice(0, HERO_RING_LIMIT);
  });
}
