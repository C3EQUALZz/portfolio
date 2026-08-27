import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { codingProfile, type CodingProfile } from '../coding-profile/coding-profile';
import { codingStats } from './coding-stats';

function leetcode(totalSolved: number): CodingProfile {
  return must(
    codingProfile.create({
      platform: 'leetcode',
      handle: 'c3equalzRU',
      profileUrl: 'https://leetcode.com/u/c3equalzRU/',
      fetchedAt: '2026-08-22T18:00:00.000Z',
      totalSolved,
      facts: {
        kind: 'leetcode',
        solvedByDifficulty: { easy: totalSolved, medium: 0, hard: 0 },
        availableByDifficulty: undefined,
        ranking: undefined,
        contestRating: undefined,
        calendar: [],
        languages: [],
        recentAccepted: [],
      },
    }),
  );
}

describe('codingStats', () => {
  it('sums solved counts across platforms for the page headline', () => {
    expect(codingStats.totalSolved([leetcode(9), leetcode(7)])).toBe(16);
  });

  it('is zero when there are no profiles at all', () => {
    expect(codingStats.totalSolved([])).toBe(0);
  });
});
