import { computed, inject, Injectable, type Signal } from '@angular/core';

import type { Experience } from '../../../domain/experience/experience';
import { resume } from '../../../domain/resume/resume';

import type { Query, QueryHandler } from '../../../../../shared/cqs/query/query';
import { period } from '../../../../../shared/kernel/time/period';
import { ResumeStore } from '../../resume-store/resume-store';

export interface GetExperienceTimelineQuery extends Query {
  readonly kind: 'getExperienceTimeline';
}

/** One timeline row: the role, newest first, plus its duration resolved asOf page load. */
export interface ExperienceTimelineItem {
  readonly experience: Experience;
  readonly durationInMonths: number;
}

@Injectable({ providedIn: 'root' })
export class GetExperienceTimelineHandler implements QueryHandler<
  GetExperienceTimelineQuery,
  readonly ExperienceTimelineItem[]
> {
  private readonly store = inject(ResumeStore);

  handle(_query: GetExperienceTimelineQuery): Signal<readonly ExperienceTimelineItem[]> {
    return computed(() => {
      const data = this.store.data();
      if (data === undefined) {
        return [];
      }
      return resume.experiencesByRecency(data).map((item) => ({
        experience: item,
        durationInMonths: period.durationInMonths(item.period, this.store.asOfDate),
      }));
    });
  }
}
