import { TestBed } from '@angular/core/testing';

import {
  type CodingPlatform,
  type CodingPlatformTarget,
} from '../../domain/coding-platform/coding-platform';
import { codingProfile, type CodingProfile } from '../../domain/coding-profile/coding-profile';
import type { CodingStatsSource } from '../../domain/coding-stats-source/coding-stats-source';
import type { CachedProfile, StatsCache } from '../../domain/stats-cache/stats-cache';

import { err, ok } from '../../../../shared/kernel/result/result';
import { must } from '../../../../shared/testing/must';
import {
  CODING_STATS_SOURCES,
  CODING_STATS_TTL_MINUTES,
  LoadCodingStats,
  STATS_CACHE,
} from './load-coding-stats';

const TARGET: CodingPlatformTarget = {
  platform: 'codewars',
  handle: 'C3EQUALZz',
  profileUrl: 'https://www.codewars.com/users/C3EQUALZz',
};

function profile(fetchedAt = '2026-08-22T18:00:00.000Z'): CodingProfile {
  return must(
    codingProfile.create({
      platform: 'codewars',
      handle: TARGET.handle,
      profileUrl: TARGET.profileUrl,
      fetchedAt,
      totalSolved: 7,
      facts: {
        kind: 'codewars',
        honor: 16,
        kyu: 8,
        kyuName: '8 kyu',
        completedKata: 7,
        leaderboardPosition: undefined,
      },
    }),
  );
}

class MemoryCache implements StatsCache {
  readonly store = new Map<CodingPlatform, CachedProfile>();

  read(platform: CodingPlatform): CachedProfile | undefined {
    return this.store.get(platform);
  }

  write(profile: CodingProfile, cachedAt: string): void {
    this.store.set(profile.platform, { profile, cachedAt });
  }

  clear(platform: CodingPlatform): void {
    this.store.delete(platform);
  }
}

function setup(options: {
  readonly cache: StatsCache;
  readonly fetch: CodingStatsSource['fetch'];
  readonly ttlMinutes?: number;
}): LoadCodingStats {
  TestBed.configureTestingModule({
    providers: [
      { provide: STATS_CACHE, useValue: options.cache },
      {
        provide: CODING_STATS_SOURCES,
        useValue: { codewars: { fetch: options.fetch } },
      },
      { provide: CODING_STATS_TTL_MINUTES, useValue: options.ttlMinutes ?? 60 },
    ],
  });
  return TestBed.inject(LoadCodingStats);
}

describe('LoadCodingStats', () => {
  it('serves a fresh cache entry without touching the network', async () => {
    const cache = new MemoryCache();
    cache.write(profile(), new Date().toISOString());
    let fetches = 0;
    const useCase = setup({
      cache,
      fetch: () => {
        fetches++;
        return Promise.reject(new Error('must not be called'));
      },
    });

    const loaded = must(await useCase.load(TARGET));

    expect(loaded.stale).toBe(false);
    expect(fetches).toBe(0);
  });

  it('serves an expired cache entry as stale', async () => {
    const cache = new MemoryCache();
    cache.write(profile(), '2020-01-01T00:00:00.000Z');
    const useCase = setup({ cache, fetch: () => Promise.reject(new Error('unused')) });

    const loaded = must(await useCase.load(TARGET));

    expect(loaded.stale).toBe(true);
    expect(loaded.cachedAt).toBe('2020-01-01T00:00:00.000Z');
  });

  it('fetches on a cache miss and populates the cache', async () => {
    const cache = new MemoryCache();
    const useCase = setup({ cache, fetch: () => Promise.resolve(ok(profile())) });

    const loaded = must(await useCase.load(TARGET));

    expect(loaded.profile.totalSolved).toBe(7);
    expect(cache.read('codewars')).toBeDefined();
  });

  it('propagates the source error when there is no cache', async () => {
    const useCase = setup({
      cache: new MemoryCache(),
      fetch: () => Promise.resolve(err({ kind: 'AllSourcesUnavailable', attempts: [] })),
    });

    const result = await useCase.load(TARGET);

    expect(result.ok).toBe(false);
  });

  it('invalidate drops the cached value', () => {
    const cache = new MemoryCache();
    cache.write(profile(), new Date().toISOString());
    const useCase = setup({ cache, fetch: () => Promise.resolve(ok(profile())) });

    useCase.invalidate('codewars');

    expect(cache.read('codewars')).toBeUndefined();
  });
});
