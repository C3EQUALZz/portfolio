import { computed, inject, Injectable, type Signal } from '@angular/core';

import type { CodingPlatformTarget } from '../../../domain/coding-platform/coding-platform';
import { codingStats } from '../../../domain/coding-stats/coding-stats';

import type { Query, QueryHandler } from '../../../../../shared/cqs/query/query';
import {
  CODING_STATS_TARGETS,
  CodingStatsStore,
  type PlatformStatsState,
} from '../../coding-stats-store/coding-stats-store';

/** The read request: every platform card with its current state. */
export interface GetCodingStatsQuery extends Query {
  readonly kind: 'getCodingStats';
}

/** One card's worth of view data: the content target plus the live state. */
export interface PlatformStatsView {
  readonly target: CodingPlatformTarget;
  readonly state: PlatformStatsState;
}

export interface CodingStatsView {
  /** Solved across the platforms that answered; the page headline. */
  readonly totalSolved: number;
  /** How many platforms are in the ready state right now. */
  readonly readyCount: number;
  readonly platforms: readonly PlatformStatsView[];
}

/**
 * Reads the store and shapes it for the page: per-platform states plus the
 * aggregate headline. The headline counts only platforms that answered —
 * a down platform shows its unavailable card without zeroing the total.
 */
@Injectable({ providedIn: 'root' })
export class GetCodingStatsHandler implements QueryHandler<GetCodingStatsQuery, CodingStatsView> {
  private readonly store = inject(CodingStatsStore);
  private readonly targets = inject(CODING_STATS_TARGETS);

  handle(_query: GetCodingStatsQuery): Signal<CodingStatsView> {
    return computed(() => {
      const platforms = this.targets.map((target) => ({
        target,
        state: this.store.state(target.platform)(),
      }));
      const ready = platforms.flatMap((view) =>
        view.state.status === 'ready' ? [view.state.profile] : [],
      );
      return {
        totalSolved: codingStats.totalSolved(ready),
        readyCount: ready.length,
        platforms,
      };
    });
  }
}
