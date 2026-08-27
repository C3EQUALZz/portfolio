import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type {
  CodingPlatform,
  CodingPlatformTarget,
} from '../../domain/coding-platform/coding-platform';
import { codingProfile, type CodingProfile } from '../../domain/coding-profile/coding-profile';
import type { CodingStatsSource } from '../../domain/coding-stats-source/coding-stats-source';
import type { CachedProfile, StatsCache } from '../../domain/stats-cache/stats-cache';

import { err, ok } from '../../../../shared/kernel/result/result';
import { must } from '../../../../shared/testing/must';
import {
  CODING_STATS_SOURCES,
  CODING_STATS_TTL_MINUTES,
  STATS_CACHE,
} from '../load-coding-stats/load-coding-stats';
import { CODING_STATS_TARGETS, CodingStatsStore } from './coding-stats-store';

const TARGETS: readonly CodingPlatformTarget[] = [
  {
    platform: 'codewars',
    handle: 'C3EQUALZz',
    profileUrl: 'https://www.codewars.com/users/C3EQUALZz',
  },
];

function profile(): CodingProfile {
  return must(
    codingProfile.create({
      platform: 'codewars',
      handle: 'C3EQUALZz',
      profileUrl: 'https://www.codewars.com/users/C3EQUALZz',
      fetchedAt: '2026-08-22T18:00:00.000Z',
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

function setup(fetch: CodingStatsSource['fetch']): CodingStatsStore {
  TestBed.configureTestingModule({
    providers: [
      { provide: CODING_STATS_TARGETS, useValue: TARGETS },
      { provide: STATS_CACHE, useValue: new MemoryCache() },
      { provide: CODING_STATS_SOURCES, useValue: { codewars: { fetch } } },
      { provide: CODING_STATS_TTL_MINUTES, useValue: 60 },
    ],
  });
  return TestBed.inject(CodingStatsStore);
}

describe('CodingStatsStore', () => {
  it('reaches the ready state when the source answers', async () => {
    const store = setup(() => Promise.resolve(ok(profile())));

    await TestBed.inject(ApplicationRef).whenStable();

    const state = store.state('codewars')();
    expect(state.status).toBe('ready');
    expect(state).toMatchObject({ stale: false, profile: { totalSolved: 7 } });
  });

  it('reaches the unavailable state when every source fails and the cache is empty', async () => {
    const store = setup(() =>
      Promise.resolve(err({ kind: 'AllSourcesUnavailable', attempts: [] })),
    );

    await TestBed.inject(ApplicationRef).whenStable();

    expect(store.state('codewars')().status).toBe('unavailable');
  });

  it('refresh re-fetches after a failure', async () => {
    let calls = 0;
    const store = setup(() => {
      calls++;
      return calls === 1
        ? Promise.resolve(err({ kind: 'SourceUnavailable' }))
        : Promise.resolve(ok(profile()));
    });
    await TestBed.inject(ApplicationRef).whenStable();
    expect(store.state('codewars')().status).toBe('unavailable');

    store.refresh('codewars');
    await TestBed.inject(ApplicationRef).whenStable();

    expect(store.state('codewars')().status).toBe('ready');
    expect(calls).toBe(2);
  });
});
