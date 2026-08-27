import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { codewarsUserFixture } from './fixtures/api-fixtures';
import { toCodewarsProfile } from './to-codewars-profile';

const META = {
  handle: 'C3EQUALZz',
  profileUrl: 'https://www.codewars.com/users/C3EQUALZz',
  fetchedAt: '2026-08-22T18:00:00.000Z',
};

describe('toCodewarsProfile', () => {
  it('maps the captured user payload, flipping the negative rank to a kyu', () => {
    const profile = must(toCodewarsProfile({ raw: codewarsUserFixture, ...META }));

    expect(profile.totalSolved).toBe(7);
    expect(profile.facts).toMatchObject({
      kind: 'codewars',
      honor: 16,
      kyu: 8,
      kyuName: '8 kyu',
      completedKata: 7,
      leaderboardPosition: undefined,
    });
  });

  it('maps a leaderboard position when the user is listed', () => {
    const profile = must(
      toCodewarsProfile({ raw: { ...codewarsUserFixture, leaderboardPosition: 12345 }, ...META }),
    );

    expect(profile.facts).toMatchObject({ leaderboardPosition: 12345 });
  });

  it('rejects a payload without the overall rank', () => {
    expect(
      toCodewarsProfile({
        raw: { honor: 16, codeChallenges: { totalCompleted: 7 } },
        ...META,
      }),
    ).toEqual({ ok: false, error: { kind: 'InvalidPayload' } });
  });
});
