import {
  codingProfile,
  type CodingProfile,
  type RatingPoint,
} from '../../domain/coding-profile/coding-profile';
import type { InvalidPayload } from '../../domain/coding-stats-source/coding-stats-source';

import { err, type Result } from '../../../../shared/kernel/result/result';
import { asArray, asNumber, asRecord, asString } from './json-guard';

const INVALID: InvalidPayload = { kind: 'InvalidPayload' };

/** Codeforces facts are assembled from three official API calls. */
export interface CodeforcesRawResponses {
  /** `GET /api/user.info?handles=…` — required: rating, maxRating, rank. */
  readonly info: unknown;
  /** `GET /api/user.rating?handle=…` — optional: contest history. */
  readonly rating?: unknown;
  /** `GET /api/user.status?handle=…` — optional: submissions for solved count. */
  readonly status?: unknown;
}

function firstResult(raw: unknown): Record<string, unknown> | undefined {
  return asArray(asRecord(raw)?.['result'])
    ?.map(asRecord)
    .find((entry) => entry !== undefined);
}

function toRatingHistory(raw: unknown): RatingPoint[] {
  const list = asArray(asRecord(raw)?.['result']);
  if (list === undefined) {
    return [];
  }
  const points: RatingPoint[] = [];
  for (const entry of list) {
    const item = asRecord(entry);
    const seconds = asNumber(item?.['ratingUpdateTimeSeconds']);
    const rating = asNumber(item?.['newRating']);
    if (seconds === undefined || rating === undefined) {
      continue;
    }
    points.push({ at: new Date(seconds * 1000).toISOString(), rating });
  }
  return points;
}

/** The distinct-problem key of an accepted submission, undefined otherwise. */
function solvedProblemKey(entry: unknown): string | undefined {
  const submission = asRecord(entry);
  if (submission?.['verdict'] !== 'OK') {
    return undefined;
  }
  const problem = asRecord(submission['problem']);
  const contestId = asNumber(problem?.['contestId']);
  const index = asString(problem?.['index']);
  return contestId === undefined || index === undefined
    ? undefined
    : `${contestId.toString()}:${index}`;
}

/** Distinct problems with an OK verdict — the Codeforces "solved" number. */
function toSolvedCount(raw: unknown): number {
  const list = asArray(asRecord(raw)?.['result']) ?? [];
  return new Set(list.map(solvedProblemKey).filter((key) => key !== undefined)).size;
}

/**
 * Maps official Codeforces API responses to a validated CodingProfile. An
 * unrated account (no contests, no submissions) is a normal state: the rating
 * fields stay undefined and the totals are zero.
 */
export function toCodeforcesProfile(input: {
  readonly raw: CodeforcesRawResponses;
  readonly handle: string;
  readonly profileUrl: string;
  readonly fetchedAt: string;
}): Result<CodingProfile, InvalidPayload> {
  const user = firstResult(input.raw.info);
  if (user === undefined) {
    return err(INVALID);
  }
  const created = codingProfile.create({
    platform: 'codeforces',
    handle: input.handle,
    profileUrl: input.profileUrl,
    fetchedAt: input.fetchedAt,
    totalSolved: toSolvedCount(input.raw.status),
    facts: {
      kind: 'codeforces',
      rating: asNumber(user['rating']),
      maxRating: asNumber(user['maxRating']),
      rank: asString(user['rank']),
      ratingHistory: toRatingHistory(input.raw.rating),
    },
  });
  // Domain rejection here means the source's payload is incoherent — report
  // it as the source's fault, not as a content bug.
  return created.ok ? created : err(INVALID);
}
