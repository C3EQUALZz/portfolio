import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { codingProfile, type PlatformFacts } from './coding-profile';

const LEETCODE_FACTS: PlatformFacts = {
  kind: 'leetcode',
  solvedByDifficulty: { easy: 6, medium: 3, hard: 0 },
  availableByDifficulty: { easy: 960, medium: 2103, hard: 966 },
  ranking: 500001,
  contestRating: undefined,
  calendar: [{ date: '2026-08-01', submissions: 2 }],
  languages: [{ name: 'Python', solved: 9 }],
  recentAccepted: [{ title: 'Two Sum', slug: 'two-sum', at: '2026-08-01T12:00:00.000Z' }],
};

function leetcodeInput(
  facts: PlatformFacts = LEETCODE_FACTS,
): Parameters<typeof codingProfile.create>[0] {
  return {
    platform: 'leetcode' as const,
    handle: 'c3equalzRU',
    profileUrl: 'https://leetcode.com/u/c3equalzRU/',
    fetchedAt: '2026-08-22T18:00:00.000Z',
    totalSolved: 9,
    facts,
  };
}

describe('codingProfile', () => {
  it('creates a LeetCode profile when the total matches the difficulty breakdown', () => {
    const profile = must(codingProfile.create(leetcodeInput()));

    expect(profile.platform).toBe('leetcode');
    expect(profile.totalSolved).toBe(9);
    expect(profile.facts.kind).toBe('leetcode');
  });

  it('rejects a LeetCode profile whose total drifts from the difficulty sum', () => {
    expect(codingProfile.create({ ...leetcodeInput(), totalSolved: 10 })).toEqual({
      ok: false,
      error: { kind: 'InvalidCodingProfile' },
    });
  });

  it('rejects facts of a different platform than the profile declares', () => {
    const codewarsFacts: PlatformFacts = {
      kind: 'codewars',
      honor: 16,
      kyu: 8,
      kyuName: '8 kyu',
      completedKata: 9,
      leaderboardPosition: undefined,
    };

    expect(codingProfile.create(leetcodeInput(codewarsFacts))).toEqual({
      ok: false,
      error: { kind: 'InvalidCodingProfile' },
    });
  });

  it('rejects an empty handle', () => {
    expect(codingProfile.create({ ...leetcodeInput(), handle: '  ' })).toEqual({
      ok: false,
      error: { kind: 'InvalidCodingProfile' },
    });
  });

  it('rejects a non-https profile URL', () => {
    expect(
      codingProfile.create({ ...leetcodeInput(), profileUrl: 'http://leetcode.com/u/x/' }),
    ).toEqual({ ok: false, error: { kind: 'InvalidCodingProfile' } });
  });

  it('rejects an unparseable fetchedAt', () => {
    expect(codingProfile.create({ ...leetcodeInput(), fetchedAt: 'not-a-date' })).toEqual({
      ok: false,
      error: { kind: 'InvalidCodingProfile' },
    });
  });

  it('rejects negative difficulty counts', () => {
    const facts: PlatformFacts = {
      ...LEETCODE_FACTS,
      kind: 'leetcode',
      solvedByDifficulty: { easy: -1, medium: 10, hard: 0 },
    };

    expect(codingProfile.create(leetcodeInput(facts))).toEqual({
      ok: false,
      error: { kind: 'InvalidCodingProfile' },
    });
  });

  it('rejects a calendar day that does not exist', () => {
    const facts: PlatformFacts = {
      ...LEETCODE_FACTS,
      kind: 'leetcode',
      calendar: [{ date: '2026-02-30', submissions: 1 }],
    };

    expect(codingProfile.create(leetcodeInput(facts))).toEqual({
      ok: false,
      error: { kind: 'InvalidCodingProfile' },
    });
  });

  it('creates an unrated Codeforces profile — no contests is a normal state', () => {
    const profile = must(
      codingProfile.create({
        platform: 'codeforces',
        handle: 'c3equalz',
        profileUrl: 'https://codeforces.com/profile/c3equalz',
        fetchedAt: '2026-08-22T18:00:00.000Z',
        totalSolved: 0,
        facts: {
          kind: 'codeforces',
          rating: undefined,
          maxRating: undefined,
          rank: undefined,
          ratingHistory: [],
        },
      }),
    );

    expect(profile.facts).toMatchObject({ kind: 'codeforces', rating: undefined });
  });

  it('creates a Codewars profile when completed kata equals the total', () => {
    const profile = must(
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

    expect(profile.facts).toMatchObject({ kind: 'codewars', kyu: 8 });
  });

  it('rejects a Codewars profile whose completed kata drift from the total', () => {
    expect(
      codingProfile.create({
        platform: 'codewars',
        handle: 'C3EQUALZz',
        profileUrl: 'https://www.codewars.com/users/C3EQUALZz',
        fetchedAt: '2026-08-22T18:00:00.000Z',
        totalSolved: 8,
        facts: {
          kind: 'codewars',
          honor: 16,
          kyu: 8,
          kyuName: '8 kyu',
          completedKata: 7,
          leaderboardPosition: undefined,
        },
      }),
    ).toEqual({ ok: false, error: { kind: 'InvalidCodingProfile' } });
  });

  it('rejects a kyu outside the 1..8 range', () => {
    expect(
      codingProfile.create({
        platform: 'codewars',
        handle: 'C3EQUALZz',
        profileUrl: 'https://www.codewars.com/users/C3EQUALZz',
        fetchedAt: '2026-08-22T18:00:00.000Z',
        totalSolved: 7,
        facts: {
          kind: 'codewars',
          honor: 16,
          kyu: 9,
          kyuName: '9 kyu',
          completedKata: 7,
          leaderboardPosition: undefined,
        },
      }),
    ).toEqual({ ok: false, error: { kind: 'InvalidCodingProfile' } });
  });
});
