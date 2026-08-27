import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import {
  alfaCalendarFixture,
  alfaLanguagesFixture,
  alfaProfileFixture,
  alfaRecentAcceptedFixture,
} from './fixtures/api-fixtures';
import { toLeetCodeProfile } from './to-leetcode-profile';

const META = {
  handle: 'c3equalzRU',
  profileUrl: 'https://leetcode.com/u/c3equalzRU/',
  fetchedAt: '2026-08-22T18:00:00.000Z',
};

describe('toLeetCodeProfile', () => {
  it('maps the full alfa payload with heatmap, languages and recent submissions', () => {
    const profile = must(
      toLeetCodeProfile({
        raw: {
          profile: alfaProfileFixture,
          calendar: alfaCalendarFixture,
          languages: alfaLanguagesFixture,
          recentAccepted: alfaRecentAcceptedFixture,
        },
        ...META,
      }),
    );

    expect(profile.totalSolved).toBe(9);
    expect(profile.facts).toMatchObject({
      kind: 'leetcode',
      solvedByDifficulty: { easy: 6, medium: 3, hard: 0 },
      ranking: 500001,
      contestRating: undefined,
    });
    if (profile.facts.kind !== 'leetcode') {
      throw new Error('narrowing');
    }
    expect(profile.facts.calendar).toEqual([
      { date: '2025-07-31', submissions: 2 },
      { date: '2025-08-01', submissions: 1 },
    ]);
    expect(profile.facts.languages).toEqual([
      { name: 'Python3', solved: 8 },
      { name: 'Rust', solved: 1 },
    ]);
    expect(profile.facts.recentAccepted).toHaveLength(2);
    expect(profile.facts.recentAccepted[0]?.slug).toBe('two-sum');
  });

  it('degrades gracefully when the optional endpoints are missing', () => {
    const profile = must(toLeetCodeProfile({ raw: { profile: alfaProfileFixture }, ...META }));

    expect(profile.facts).toMatchObject({
      kind: 'leetcode',
      calendar: [],
      languages: [],
      recentAccepted: [],
    });
  });

  it('accepts a numeric-string contest rating', () => {
    const profile = must(
      toLeetCodeProfile({
        raw: { profile: { ...alfaProfileFixture, contestRating: '1543.7' } },
        ...META,
      }),
    );

    expect(profile.facts).toMatchObject({ contestRating: 1543.7 });
  });

  it('rejects a payload without the solved breakdown', () => {
    expect(toLeetCodeProfile({ raw: { profile: { username: 'c3equalzRU' } }, ...META })).toEqual({
      ok: false,
      error: { kind: 'InvalidPayload' },
    });
  });

  it('rejects a payload whose breakdown contradicts the total', () => {
    expect(
      toLeetCodeProfile({
        raw: { profile: { ...alfaProfileFixture, hardSolved: 5 } },
        ...META,
      }),
    ).toEqual({ ok: false, error: { kind: 'InvalidPayload' } });
  });

  it('tolerates a broken submissionCalendar string', () => {
    const profile = must(
      toLeetCodeProfile({
        raw: { profile: alfaProfileFixture, calendar: { submissionCalendar: '{broken' } },
        ...META,
      }),
    );

    expect(profile.facts).toMatchObject({ calendar: [] });
  });
});
