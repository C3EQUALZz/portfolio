import {
  type AcceptedSubmission,
  codingProfile,
  type CodingProfile,
  type DailyActivity,
  type LanguageCount,
  type LeetCodeFacts,
} from '../../domain/coding-profile/coding-profile';
import type { InvalidPayload } from '../../domain/coding-stats-source/coding-stats-source';

import { err, type Result } from '../../../../shared/kernel/result/result';
import { asArray, asNumber, asRecord, asString, type JsonRecord } from './json-guard';

const INVALID: InvalidPayload = { kind: 'InvalidPayload' };

/** LeetCode facts are assembled from several alfa-leetcode-api endpoints. */
export interface LeetCodeRawResponses {
  /** `GET /:username/profile` — required: solved breakdown and ranking. */
  readonly profile: unknown;
  /** `GET /:username/calendar` — optional heatmap data. */
  readonly calendar?: unknown;
  /** `GET /:username/language` — optional per-language counts. */
  readonly languages?: unknown;
  /** `GET /:username/acSubmission?limit=…` — optional recent accepted list. */
  readonly recentAccepted?: unknown;
}

interface SolvedBreakdown {
  readonly totalSolved: number;
  readonly easySolved: number;
  readonly mediumSolved: number;
  readonly hardSolved: number;
}

function toCalendarDay(seconds: string, count: unknown): DailyActivity | undefined {
  const timestamp = asNumber(seconds);
  const submissions = asNumber(count);
  if (timestamp === undefined || submissions === undefined) {
    return undefined;
  }
  return { date: new Date(timestamp * 1000).toISOString().slice(0, 10), submissions };
}

function parseCalendarJson(calendarJson: string): DailyActivity[] {
  try {
    const entries = Object.entries(asRecord(JSON.parse(calendarJson) as unknown) ?? {});
    return entries
      .map(([seconds, count]) => toCalendarDay(seconds, count))
      .filter((day) => day !== undefined)
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

function toCalendar(raw: unknown): DailyActivity[] {
  const calendarJson = asString(asRecord(raw)?.['submissionCalendar']);
  return calendarJson === undefined ? [] : parseCalendarJson(calendarJson);
}

function languageList(raw: unknown): readonly unknown[] | undefined {
  const record = asRecord(raw);
  // The endpoint shape has changed before: accept the bare array, a wrapper,
  // or the GraphQL-style `matchedUser` nesting.
  return (
    asArray(raw) ??
    asArray(record?.['languageProblemCount']) ??
    asArray(asRecord(record?.['matchedUser'])?.['languageProblemCount'])
  );
}

function toLanguage(entry: unknown): LanguageCount | undefined {
  const item = asRecord(entry);
  const name = asString(item?.['languageName']);
  const solved = asNumber(item?.['problemsSolved']);
  return name === undefined || solved === undefined ? undefined : { name, solved };
}

function toLanguages(raw: unknown): LanguageCount[] {
  return (languageList(raw) ?? [])
    .map(toLanguage)
    .filter((language) => language !== undefined)
    .sort((a, b) => b.solved - a.solved);
}

function toSubmission(entry: unknown): AcceptedSubmission | undefined {
  const item = asRecord(entry);
  const title = asString(item?.['title']);
  const slug = asString(item?.['titleSlug']);
  const seconds = asNumber(item?.['timestamp']);
  if (title === undefined || slug === undefined || seconds === undefined) {
    return undefined;
  }
  return { title, slug, at: new Date(seconds * 1000).toISOString() };
}

function toRecentAccepted(raw: unknown): AcceptedSubmission[] {
  return (asArray(asRecord(raw)?.['submission']) ?? [])
    .map(toSubmission)
    .filter((submission) => submission !== undefined);
}

function toAvailable(profile: JsonRecord | undefined): LeetCodeFacts['availableByDifficulty'] {
  const easy = asNumber(profile?.['totalEasy']);
  const medium = asNumber(profile?.['totalMedium']);
  const hard = asNumber(profile?.['totalHard']);
  return easy === undefined || medium === undefined || hard === undefined
    ? undefined
    : { easy, medium, hard };
}

function readBreakdown(profile: JsonRecord | undefined): SolvedBreakdown | undefined {
  if (profile === undefined) {
    return undefined;
  }
  const breakdown = {
    totalSolved: asNumber(profile['totalSolved']),
    easySolved: asNumber(profile['easySolved']),
    mediumSolved: asNumber(profile['mediumSolved']),
    hardSolved: asNumber(profile['hardSolved']),
  };
  return Object.values(breakdown).includes(undefined) ? undefined : (breakdown as SolvedBreakdown);
}

/**
 * Maps alfa-leetcode-api responses to a validated CodingProfile. Only the
 * solved breakdown is required — heatmap, languages and recent submissions
 * degrade to empty sections rather than failing the whole profile.
 */
export function toLeetCodeProfile(input: {
  readonly raw: LeetCodeRawResponses;
  readonly handle: string;
  readonly profileUrl: string;
  readonly fetchedAt: string;
}): Result<CodingProfile, InvalidPayload> {
  const profile = asRecord(input.raw.profile);
  const breakdown = readBreakdown(profile);
  if (breakdown === undefined) {
    return err(INVALID);
  }
  const created = codingProfile.create({
    platform: 'leetcode',
    handle: input.handle,
    profileUrl: input.profileUrl,
    fetchedAt: input.fetchedAt,
    totalSolved: breakdown.totalSolved,
    facts: {
      kind: 'leetcode',
      solvedByDifficulty: {
        easy: breakdown.easySolved,
        medium: breakdown.mediumSolved,
        hard: breakdown.hardSolved,
      },
      availableByDifficulty: toAvailable(profile),
      ranking: asNumber(profile?.['ranking']),
      contestRating: asNumber(profile?.['contestRating']),
      calendar: toCalendar(input.raw.calendar),
      languages: toLanguages(input.raw.languages),
      recentAccepted: toRecentAccepted(input.raw.recentAccepted),
    },
  });
  // Domain rejection here means the source's payload is incoherent — report
  // it as the source's fault, not as a content bug.
  return created.ok ? created : err(INVALID);
}
