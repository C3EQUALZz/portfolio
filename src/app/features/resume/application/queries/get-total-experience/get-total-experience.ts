import { computed, inject, Injectable, type Signal } from '@angular/core';

import { resume } from '../../../domain/resume/resume';

import type { Query, QueryHandler } from '../../../../../shared/cqs/query/query';
import { ResumeStore } from '../../resume-store/resume-store';

export interface GetTotalExperienceQuery extends Query {
  readonly kind: 'getTotalExperience';
}

/** Total experience as whole years and months; undefined until the resume loads. */
export interface TotalExperience {
  readonly years: number;
  readonly months: number;
}

@Injectable({ providedIn: 'root' })
export class GetTotalExperienceHandler implements QueryHandler<
  GetTotalExperienceQuery,
  TotalExperience | undefined
> {
  private readonly store = inject(ResumeStore);

  handle(_query: GetTotalExperienceQuery): Signal<TotalExperience | undefined> {
    return computed(() => {
      const data = this.store.data();
      return data === undefined ? undefined : resume.totalExperience(data, this.store.asOfDate);
    });
  }
}
