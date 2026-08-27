import { err, ok, type Result } from '../../../../shared/kernel/result/result';
import type { CodingPlatform } from '../coding-platform/coding-platform';

/** One active day on the submission heatmap; `date` is `YYYY-MM-DD`. */
export interface DailyActivity {
  readonly date: string;
  readonly submissions: number;
}

/** Problems solved in one language, as reported by the platform. */
export interface LanguageCount {
  readonly name: string;
  readonly solved: number;
}

/** One accepted submission, most recent first. */
export interface AcceptedSubmission {
  readonly title: string;
  readonly slug: string;
  readonly at: string;
}

/** One rated contest in the history, oldest first. */
export interface RatingPoint {
  readonly at: string;
  readonly rating: number;
}

/**
 * Platform-specific facts, a discriminated union like ContactChannel: the
 * shared kernel of a profile is the same everywhere, the rating semantics are
 * not (Codeforces Elo vs Codewars kyu vs LeetCode contest rating), so nothing
 * is forced into a fake common field.
 */
export type PlatformFacts =
  | {
      readonly kind: 'leetcode';
      readonly solvedByDifficulty: {
        readonly easy: number;
        readonly medium: number;
        readonly hard: number;
      };
      /** How many problems exist per difficulty — the bars' denominators. */
      readonly availableByDifficulty:
        | {
            readonly easy: number;
            readonly medium: number;
            readonly hard: number;
          }
        | undefined;
      /** Global rank by solved count; undefined when the user is not listed. */
      readonly ranking: number | undefined;
      readonly contestRating: number | undefined;
      readonly calendar: readonly DailyActivity[];
      readonly languages: readonly LanguageCount[];
      readonly recentAccepted: readonly AcceptedSubmission[];
    }
  | {
      readonly kind: 'codeforces';
      /** Undefined for an unrated profile — a normal state, not an error. */
      readonly rating: number | undefined;
      readonly maxRating: number | undefined;
      readonly rank: string | undefined;
      readonly ratingHistory: readonly RatingPoint[];
    }
  | {
      readonly kind: 'codewars';
      readonly honor: number;
      /** Positive kyu number: 8 kyu is a beginner, 1 kyu is the top. */
      readonly kyu: number;
      readonly kyuName: string;
      readonly completedKata: number;
      readonly leaderboardPosition: number | undefined;
    };

/**
 * A snapshot of the candidate's profile on one platform, fetched at runtime
 * from an external API. Immutable and validated whole at parse time — the UI
 * never deals with half-broken payloads. See CONTEXT.md.
 */
export type LeetCodeFacts = Extract<PlatformFacts, { kind: 'leetcode' }>;
export type CodeforcesFacts = Extract<PlatformFacts, { kind: 'codeforces' }>;
export type CodewarsFacts = Extract<PlatformFacts, { kind: 'codewars' }>;

export interface CodingProfile {
  readonly platform: CodingPlatform;
  readonly handle: string;
  readonly profileUrl: string;
  /** ISO instant of the successful fetch. */
  readonly fetchedAt: string;
  readonly totalSolved: number;
  readonly facts: PlatformFacts;
}

export interface InvalidCodingProfile {
  readonly kind: 'InvalidCodingProfile';
}

const INVALID: InvalidCodingProfile = { kind: 'InvalidCodingProfile' };

function isNonNegativeInt(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

function isValidInstant(value: string): boolean {
  return value.length > 0 && !Number.isNaN(Date.parse(value));
}

function isValidDay(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

function availableCountsValid(facts: LeetCodeFacts): boolean {
  const available = facts.availableByDifficulty;
  if (available === undefined) {
    return true;
  }
  const solved = facts.solvedByDifficulty;
  const counts = [available.easy, available.medium, available.hard];
  const solvedCounts = [solved.easy, solved.medium, solved.hard];
  return (
    counts.every(isNonNegativeInt) &&
    counts.every((count, index) => count >= (solvedCounts[index] ?? 0))
  );
}

/** The donut and the bars share the numbers; a drift is rejected at parse. */
function leetcodeCountsValid(facts: LeetCodeFacts, totalSolved: number): boolean {
  const { easy, medium, hard } = facts.solvedByDifficulty;
  const nonNegative = isNonNegativeInt(easy) && isNonNegativeInt(medium) && isNonNegativeInt(hard);
  return nonNegative && easy + medium + hard === totalSolved;
}

function leetcodeOptionalsValid(facts: LeetCodeFacts): boolean {
  const rankingValid = facts.ranking === undefined || facts.ranking >= 1;
  const contestValid = facts.contestRating === undefined || facts.contestRating > 0;
  return rankingValid && contestValid;
}

function leetcodeListsValid(facts: LeetCodeFacts): boolean {
  const calendarValid = facts.calendar.every(
    (day) => isValidDay(day.date) && isNonNegativeInt(day.submissions),
  );
  const languagesValid = facts.languages.every(
    (language) => language.name.length > 0 && isNonNegativeInt(language.solved),
  );
  const submissionsValid = facts.recentAccepted.every(
    (submission) => submission.slug.length > 0 && isValidInstant(submission.at),
  );
  return calendarValid && languagesValid && submissionsValid;
}

function leetcodeFactsValid(facts: LeetCodeFacts, totalSolved: number): boolean {
  return (
    leetcodeCountsValid(facts, totalSolved) &&
    leetcodeOptionalsValid(facts) &&
    leetcodeListsValid(facts) &&
    availableCountsValid(facts)
  );
}

function codeforcesFactsValid(facts: CodeforcesFacts): boolean {
  const ratingsValid =
    (facts.rating === undefined || facts.rating >= 0) &&
    (facts.maxRating === undefined || facts.maxRating >= 0);
  return (
    ratingsValid &&
    facts.ratingHistory.every((point) => isValidInstant(point.at) && point.rating >= 0)
  );
}

function codewarsKyuValid(facts: CodewarsFacts): boolean {
  return Number.isInteger(facts.kyu) && facts.kyu >= 1 && facts.kyu <= 8;
}

function codewarsCountsValid(facts: CodewarsFacts, totalSolved: number): boolean {
  const nonNegative = isNonNegativeInt(facts.honor) && isNonNegativeInt(facts.completedKata);
  return nonNegative && facts.completedKata === totalSolved;
}

function codewarsFactsValid(facts: CodewarsFacts, totalSolved: number): boolean {
  const leaderboardValid =
    facts.leaderboardPosition === undefined || facts.leaderboardPosition >= 1;
  return (
    codewarsKyuValid(facts) &&
    codewarsCountsValid(facts, totalSolved) &&
    facts.kyuName.length > 0 &&
    leaderboardValid
  );
}

function factsValid(platform: CodingPlatform, facts: PlatformFacts, totalSolved: number): boolean {
  if (facts.kind !== platform) {
    return false;
  }
  switch (facts.kind) {
    case 'leetcode':
      return leetcodeFactsValid(facts, totalSolved);
    case 'codeforces':
      return codeforcesFactsValid(facts);
    case 'codewars':
      return codewarsFactsValid(facts, totalSolved);
  }
}

export const codingProfile = {
  create(input: {
    readonly platform: CodingPlatform;
    readonly handle: string;
    readonly profileUrl: string;
    readonly fetchedAt: string;
    readonly totalSolved: number;
    readonly facts: PlatformFacts;
  }): Result<CodingProfile, InvalidCodingProfile> {
    const handle = input.handle.trim();
    if (
      handle.length === 0 ||
      !input.profileUrl.startsWith('https://') ||
      !isValidInstant(input.fetchedAt) ||
      !isNonNegativeInt(input.totalSolved) ||
      !factsValid(input.platform, input.facts, input.totalSolved)
    ) {
      return err(INVALID);
    }
    return ok({
      platform: input.platform,
      handle,
      profileUrl: input.profileUrl,
      fetchedAt: input.fetchedAt,
      totalSolved: input.totalSolved,
      facts: input.facts,
    });
  },
};
