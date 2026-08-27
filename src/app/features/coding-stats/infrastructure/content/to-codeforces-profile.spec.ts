import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import {
  codeforcesInfoFixture,
  codeforcesRatingFixture,
  codeforcesStatusFixture,
} from './fixtures/api-fixtures';
import { toCodeforcesProfile } from './to-codeforces-profile';

const META = {
  handle: 'c3equalz',
  profileUrl: 'https://codeforces.com/profile/c3equalz',
  fetchedAt: '2026-08-22T18:00:00.000Z',
};

describe('toCodeforcesProfile', () => {
  it('maps an unrated account — no contests is a normal state', () => {
    const profile = must(
      toCodeforcesProfile({
        raw: {
          info: codeforcesInfoFixture,
          rating: codeforcesRatingFixture,
          status: codeforcesStatusFixture,
        },
        ...META,
      }),
    );

    expect(profile.totalSolved).toBe(0);
    expect(profile.facts).toMatchObject({
      kind: 'codeforces',
      rating: undefined,
      maxRating: undefined,
      rank: undefined,
      ratingHistory: [],
    });
  });

  it('maps rating, rank and contest history for a rated account', () => {
    const profile = must(
      toCodeforcesProfile({
        raw: {
          info: {
            status: 'OK',
            result: [{ handle: 'x', rating: 1400, maxRating: 1500, rank: 'specialist' }],
          },
          rating: {
            status: 'OK',
            result: [{ ratingUpdateTimeSeconds: 1700000000, newRating: 1400 }],
          },
          status: {
            status: 'OK',
            result: [
              { verdict: 'OK', problem: { contestId: 1, index: 'A' } },
              { verdict: 'OK', problem: { contestId: 1, index: 'A' } },
              { verdict: 'WRONG_ANSWER', problem: { contestId: 1, index: 'B' } },
              { verdict: 'OK', problem: { contestId: 2, index: 'C' } },
            ],
          },
        },
        ...META,
      }),
    );

    expect(profile.totalSolved).toBe(2);
    expect(profile.facts).toMatchObject({
      kind: 'codeforces',
      rating: 1400,
      maxRating: 1500,
      rank: 'specialist',
    });
    if (profile.facts.kind !== 'codeforces') {
      throw new Error('narrowing');
    }
    expect(profile.facts.ratingHistory).toHaveLength(1);
  });

  it('rejects a payload without a user entry', () => {
    expect(toCodeforcesProfile({ raw: { info: { status: 'OK', result: [] } }, ...META })).toEqual({
      ok: false,
      error: { kind: 'InvalidPayload' },
    });
  });

  it('rejects a non-object payload', () => {
    expect(toCodeforcesProfile({ raw: { info: 'oops' }, ...META })).toEqual({
      ok: false,
      error: { kind: 'InvalidPayload' },
    });
  });
});
