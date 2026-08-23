import { computed, inject, Injectable, type Signal } from '@angular/core';

import type { Education } from '../../../domain/education/education';
import type { LanguageSkill } from '../../../domain/language-skill/language-skill';

import type { Query, QueryHandler } from '../../../../../shared/cqs/query/query';
import { ResumeStore } from '../../resume-store/resume-store';

export interface GetEducationQuery extends Query {
  readonly kind: 'getEducation';
}

/** The education block of the resume: formal education and spoken languages. */
export interface EducationOverview {
  readonly education: readonly Education[];
  readonly languages: readonly LanguageSkill[];
}

@Injectable({ providedIn: 'root' })
export class GetEducationHandler implements QueryHandler<
  GetEducationQuery,
  EducationOverview | undefined
> {
  private readonly store = inject(ResumeStore);

  handle(_query: GetEducationQuery): Signal<EducationOverview | undefined> {
    return computed(() => {
      const data = this.store.data();
      return data === undefined
        ? undefined
        : { education: data.education, languages: data.languages };
    });
  }
}
