/**
 * Real API responses captured at authoring time (Codeforces, Codewars) and
 * the documented alfa-leetcode-api shape. They pin the mapping contract: a
 * silent upstream change fails these specs the next time a fixture is
 * refreshed deliberately, not in production.
 */

/** alfa-leetcode-api `GET /:username/profile` (documented shape). */
export const alfaProfileFixture: Record<string, unknown> = {
  username: 'c3equalzRU',
  ranking: 500001,
  reputation: 0,
  totalSolved: 9,
  totalQuestions: 3989,
  easySolved: 6,
  totalEasy: 960,
  mediumSolved: 3,
  totalMedium: 2103,
  hardSolved: 0,
  totalHard: 966,
  contestAttend: 0,
};

/** alfa-leetcode-api `GET /:username/calendar` (documented shape). */
export const alfaCalendarFixture: Record<string, unknown> = {
  streak: 2,
  totalActiveDays: 5,
  submissionCalendar: '{"1753982400": 2, "1754068800": 1}',
};

/** alfa-leetcode-api `GET /:username/language` (GraphQL-style wrapper). */
export const alfaLanguagesFixture: Record<string, unknown> = {
  matchedUser: {
    languageProblemCount: [
      { languageName: 'Python3', problemsSolved: 8 },
      { languageName: 'Rust', problemsSolved: 1 },
    ],
  },
};

/** alfa-leetcode-api `GET /:username/acSubmission?limit=5` (documented shape). */
export const alfaRecentAcceptedFixture: Record<string, unknown> = {
  count: 2,
  submission: [
    {
      title: 'Two Sum',
      titleSlug: 'two-sum',
      timestamp: '1753982400',
      statusDisplay: 'Accepted',
      lang: 'python3',
    },
    {
      title: 'Palindrome Number',
      titleSlug: 'palindrome-number',
      timestamp: '1754068800',
      statusDisplay: 'Accepted',
      lang: 'rust',
    },
  ],
};

/** codeforces.com `GET /api/user.info?handles=c3equalz` (captured 2026-08-22). */
export const codeforcesInfoFixture: Record<string, unknown> = {
  status: 'OK',
  result: [
    {
      contribution: 0,
      lastOnlineTimeSeconds: 1787491181,
      friendOfCount: 0,
      handle: 'c3equalz',
      avatar: 'https://userpic.codeforces.org/no-avatar.jpg',
      registrationTimeSeconds: 1701032920,
    },
  ],
};

/** codeforces.com `GET /api/user.rating?handle=c3equalz` (captured 2026-08-22). */
export const codeforcesRatingFixture: Record<string, unknown> = { status: 'OK', result: [] };

/** codeforces.com `GET /api/user.status?handle=c3equalz` (captured 2026-08-22). */
export const codeforcesStatusFixture: Record<string, unknown> = { status: 'OK', result: [] };

/** codewars.com `GET /api/v1/users/C3EQUALZz` (captured 2026-08-22). */
export const codewarsUserFixture: Record<string, unknown> = {
  id: '63d98de742452f30b9a59698',
  username: 'C3EQUALZz',
  name: 'C3EQUALZ',
  honor: 16,
  clan: null,
  leaderboardPosition: null,
  skills: null,
  ranks: {
    overall: { rank: -8, name: '8 kyu', color: 'white', score: 16 },
    languages: { python: { rank: -8, name: '8 kyu', color: 'white', score: 16 } },
  },
  codeChallenges: { totalAuthored: 0, totalCompleted: 7 },
};
