import { computed, inject, Injectable, type Signal } from '@angular/core';

import type { Availability } from '../../../domain/availability/availability';
import type { Person } from '../../../domain/person/person';

import type { Query, QueryHandler } from '../../../../../shared/cqs/query/query';
import { ResumeStore } from '../../resume-store/resume-store';

export interface GetResumeProfileQuery extends Query {
  readonly kind: 'getResumeProfile';
}

/** The hero block of the resume: who the candidate is and their availability. */
export interface ResumeProfile {
  readonly person: Person;
  readonly availability: Availability;
}

@Injectable({ providedIn: 'root' })
export class GetResumeProfileHandler implements QueryHandler<
  GetResumeProfileQuery,
  ResumeProfile | undefined
> {
  private readonly store = inject(ResumeStore);

  handle(_query: GetResumeProfileQuery): Signal<ResumeProfile | undefined> {
    return computed(() => {
      const data = this.store.data();
      return data === undefined
        ? undefined
        : { person: data.person, availability: data.availability };
    });
  }
}
