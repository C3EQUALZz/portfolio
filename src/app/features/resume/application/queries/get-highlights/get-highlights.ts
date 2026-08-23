import { computed, inject, Injectable, type Signal } from '@angular/core';

import type { Highlight } from '../../../domain/highlight/highlight';

import type { Query, QueryHandler } from '../../../../../shared/cqs/query/query';
import { ResumeStore } from '../../resume-store/resume-store';

export interface GetHighlightsQuery extends Query {
  readonly kind: 'getHighlights';
}

/** The candidate's highlights in content order; empty until the resume loads. */
@Injectable({ providedIn: 'root' })
export class GetHighlightsHandler implements QueryHandler<
  GetHighlightsQuery,
  readonly Highlight[]
> {
  private readonly store = inject(ResumeStore);

  handle(_query: GetHighlightsQuery): Signal<readonly Highlight[]> {
    return computed(() => this.store.data()?.highlights ?? []);
  }
}
