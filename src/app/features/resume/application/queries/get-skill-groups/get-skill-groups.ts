import { computed, inject, Injectable, type Signal } from '@angular/core';

import type { Query, QueryHandler } from '../../../../../shared/cqs/query/query';
import type { LocalizedText } from '../../../../../shared/kernel/localization/localized-text';
import type { Technology } from '../../../../../shared/kernel/technology/technology';
import { ResumeStore } from '../../resume-store/resume-store';

export interface GetSkillGroupsQuery extends Query {
  readonly kind: 'getSkillGroups';
}

/** One stack row; `lead` is the accent decision resolved from the emphasis. */
interface SkillGroupEntryItem {
  readonly technology: Technology;
  readonly lead: boolean;
}

/** A titled skill group for the stack section, ready to render. */
export interface SkillGroupItem {
  readonly title: LocalizedText;
  readonly entries: readonly SkillGroupEntryItem[];
}

@Injectable({ providedIn: 'root' })
export class GetSkillGroupsHandler implements QueryHandler<
  GetSkillGroupsQuery,
  readonly SkillGroupItem[]
> {
  private readonly store = inject(ResumeStore);

  handle(_query: GetSkillGroupsQuery): Signal<readonly SkillGroupItem[]> {
    return computed(() => {
      const data = this.store.data();
      if (data === undefined) {
        return [];
      }
      return data.skillGroups.map((group) => ({
        title: group.title,
        entries: group.entries.map((entry) => ({
          technology: entry.technology,
          lead: entry.emphasis === 'lead',
        })),
      }));
    });
  }
}
