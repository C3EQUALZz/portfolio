import { inject, Injectable, InjectionToken } from '@angular/core';

import type {
  CodingPlatform,
  CodingPlatformTarget,
} from '../../domain/coding-platform/coding-platform';
import type { CodingProfile } from '../../domain/coding-profile/coding-profile';
import type {
  CodingStatsSource,
  StatsSourceError,
} from '../../domain/coding-stats-source/coding-stats-source';
import type { StatsCache } from '../../domain/stats-cache/stats-cache';

import { err, ok, type Result } from '../../../../shared/kernel/result/result';

/** DI token for the failover source chains, one per platform. */
export const CODING_STATS_SOURCES = new InjectionToken<
  Readonly<Record<CodingPlatform, CodingStatsSource>>
>('CODING_STATS_SOURCES');

/** DI token for the read-through cache port. */
export const STATS_CACHE = new InjectionToken<StatsCache>('STATS_CACHE');

/** DI token for the cache TTL in minutes (a content decision). */
export const CODING_STATS_TTL_MINUTES = new InjectionToken<number>('CODING_STATS_TTL_MINUTES');

/** A profile as the page consumes it: the data plus its cache provenance. */
export interface LoadedProfile {
  readonly profile: CodingProfile;
  /** ISO instant when this value entered the cache (fetch time). */
  readonly cachedAt: string;
  /** True when served past the TTL — a background refresh is expected. */
  readonly stale: boolean;
}

/**
 * The use case behind the stats page: read-through caching with
 * stale-while-revalidate. Fresh cache wins without a network round-trip,
 * stale cache is served and marked, a miss goes through the failover chain
 * and populates the cache on success.
 */
@Injectable({ providedIn: 'root' })
export class LoadCodingStats {
  private readonly sources = inject(CODING_STATS_SOURCES);
  private readonly cache = inject(STATS_CACHE);
  private readonly ttlMinutes = inject(CODING_STATS_TTL_MINUTES);

  async load(target: CodingPlatformTarget): Promise<Result<LoadedProfile, StatsSourceError>> {
    const cached = this.cache.read(target.platform);
    if (cached !== undefined) {
      const ageMs = Date.now() - Date.parse(cached.cachedAt);
      return ok({
        profile: cached.profile,
        cachedAt: cached.cachedAt,
        stale: ageMs > this.ttlMinutes * 60_000,
      });
    }
    return this.fetchAndCache(target);
  }

  /** Drops the cached value so the next load goes to the network. */
  invalidate(platform: CodingPlatform): void {
    this.cache.clear(platform);
  }

  private async fetchAndCache(
    target: CodingPlatformTarget,
  ): Promise<Result<LoadedProfile, StatsSourceError>> {
    const source = this.sources[target.platform];
    const result = await source.fetch(target.handle);
    if (!result.ok) {
      return err(result.error);
    }
    const cachedAt = new Date().toISOString();
    this.cache.write(result.value, cachedAt);
    return ok({ profile: result.value, cachedAt, stale: false });
  }
}
