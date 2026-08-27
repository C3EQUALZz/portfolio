import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { CodingPlatformTarget } from '../../../domain/coding-platform/coding-platform';
import { codingProfile, type CodingProfile } from '../../../domain/coding-profile/coding-profile';
import type { CodingStatsSource } from '../../../domain/coding-stats-source/coding-stats-source';
import type { StatsCache } from '../../../domain/stats-cache/stats-cache';

import { err, ok } from '../../../../../shared/kernel/result/result';
import { must } from '../../../../../shared/testing/must';
import { CODING_STATS_TARGETS } from '../../coding-stats-store/coding-stats-store';
import {
  CODING_STATS_SOURCES,
  CODING_STATS_TTL_MINUTES,
  STATS_CACHE,
} from '../../load-coding-stats/load-coding-stats';
import { GetCodingStatsHandler } from './get-coding-stats';

const TARGETS: readonly CodingPlatformTarget[] = [
  { platform: 'codewars', handle: 'a', profileUrl: 'https://www.codewars.com/users/a' },
  { platform: 'codeforces', handle: 'b', profileUrl: 'https://codeforces.com/profile/b' },
];

function codewarsProfile(totalSolved: number): CodingProfile {
  return must(
    codingProfile.create({
      platform: 'codewars',
      handle: 'a',
      profileUrl: 'https://www.codewars.com/users/a',
      fetchedAt: '2026-08-22T18:00:00.000Z',
      totalSolved,
      facts: {
        kind: 'codewars',
        honor: 16,
        kyu: 8,
        kyuName: '8 kyu',
        completedKata: totalSolved,
        leaderboardPosition: undefined,
      },
    }),
  );
}

class EmptyCache implements StatsCache {
  read(): undefined {
    return undefined;
  }

  write(): void {
    // Cache-less by design: the spec drives the sources directly.
  }

  clear(): void {
    // Same as write — intentionally a no-op.
  }
}

describe('GetCodingStatsHandler', () => {
  beforeEach(() => {
    const sources: Partial<Record<string, CodingStatsSource>> = {
      codewars: { fetch: () => Promise.resolve(ok(codewarsProfile(7))) },
      codeforces: {
        fetch: () => Promise.resolve(err({ kind: 'AllSourcesUnavailable', attempts: [] })),
      },
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: CODING_STATS_TARGETS, useValue: TARGETS },
        { provide: STATS_CACHE, useValue: new EmptyCache() },
        { provide: CODING_STATS_SOURCES, useValue: sources },
        { provide: CODING_STATS_TTL_MINUTES, useValue: 60 },
      ],
    });
  });

  it('aggregates the headline over ready platforms only', async () => {
    const handler = TestBed.inject(GetCodingStatsHandler);
    await TestBed.inject(ApplicationRef).whenStable();

    const view = handler.handle({ kind: 'getCodingStats' })();

    expect(view.totalSolved).toBe(7);
    expect(view.readyCount).toBe(1);
    expect(view.platforms.map((platform) => platform.state.status)).toEqual([
      'ready',
      'unavailable',
    ]);
  });
});
