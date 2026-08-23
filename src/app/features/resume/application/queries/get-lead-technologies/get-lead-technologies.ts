import { computed, inject, Injectable, type Signal } from '@angular/core';

import type { Query, QueryHandler } from '../../../../../shared/cqs/query/query';
import type { Technology } from '../../../../../shared/kernel/technology/technology';
import { ResumeStore } from '../../resume-store/resume-store';

export interface GetLeadTechnologiesQuery extends Query {
  readonly kind: 'getLeadTechnologies';
  /** How many lead technologies to return; the caller knows its own capacity. */
  readonly limit: number;
}

/** The lead technologies of the skill groups, trimmed to the requested limit. */
@Injectable({ providedIn: 'root' })
export class GetLeadTechnologiesHandler implements QueryHandler<
  GetLeadTechnologiesQuery,
  readonly Technology[]
> {
  private readonly store = inject(ResumeStore);

  handle(query: GetLeadTechnologiesQuery): Signal<readonly Technology[]> {
    return computed(() => {
      const data = this.store.data();
      if (data === undefined) {
        return [];
      }
      return data.skillGroups
        .flatMap((group) => group.entries)
        .filter((entry) => entry.emphasis === 'lead')
        .map((entry) => entry.technology)
        .slice(0, query.limit);
    });
  }
}
