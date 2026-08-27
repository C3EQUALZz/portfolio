import type { EnvironmentProviders, Provider } from '@angular/core';

import type {
  CodingPlatform,
  CodingPlatformTarget,
} from './domain/coding-platform/coding-platform';
import type { CodingStatsSource } from './domain/coding-stats-source/coding-stats-source';

import { CODING_STATS_TARGETS } from './application/coding-stats-store/coding-stats-store';
import {
  CODING_STATS_SOURCES,
  CODING_STATS_TTL_MINUTES,
  STATS_CACHE,
} from './application/load-coding-stats/load-coding-stats';

import { LocalStorageStatsCache } from './infrastructure/cache/local-storage-stats-cache';
import { codingStatsContent } from './infrastructure/content/coding-stats-content';
import { AlfaLeetCodeSource } from './infrastructure/sources/alfa-leetcode-source';
import { CodeforcesSource } from './infrastructure/sources/codeforces-source';
import { CodewarsSource } from './infrastructure/sources/codewars-source';
import { FailoverCodingStatsSource } from './infrastructure/sources/failover-source';

export { CodingStatsPage } from './presentation/coding-stats-page/coding-stats-page';

function targetFor(platform: CodingPlatform): CodingPlatformTarget {
  const target = codingStatsContent.targets.find((entry) => entry.platform === platform);
  if (target === undefined) {
    // Guarded by the coding-stats-content spec; fail loud, not silent.
    throw new Error(`coding-stats content misses the ${platform} target`);
  }
  return target;
}

/**
 * Wires the runtime stats feature: failover chains per platform, the
 * localStorage cache and the content targets. Unlike the static features the
 * content is not validated at bootstrap — the network lives in the runtime,
 * and an unavailable source is a page state, not a boot failure.
 */
export function provideCodingStatsFeature(): (Provider | EnvironmentProviders)[] {
  const leetcode = targetFor('leetcode');
  const sources: Record<CodingPlatform, CodingStatsSource> = {
    leetcode: new FailoverCodingStatsSource(
      codingStatsContent.leetcodeSources.map((endpoint) => ({
        name: endpoint.name,
        source: new AlfaLeetCodeSource(endpoint.baseUrl, leetcode.profileUrl),
      })),
    ),
    codeforces: new CodeforcesSource(targetFor('codeforces').profileUrl),
    codewars: new CodewarsSource(targetFor('codewars').profileUrl),
  };
  return [
    { provide: CODING_STATS_TARGETS, useValue: codingStatsContent.targets },
    { provide: CODING_STATS_TTL_MINUTES, useValue: codingStatsContent.ttlMinutes },
    { provide: CODING_STATS_SOURCES, useValue: sources },
    // undefined during prerender — the cache then reads as permanently empty.
    {
      provide: STATS_CACHE,
      useValue: new LocalStorageStatsCache(
        typeof localStorage === 'undefined' ? undefined : localStorage,
      ),
    },
  ];
}
