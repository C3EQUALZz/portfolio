import { codingProfile, type CodingProfile } from '../../domain/coding-profile/coding-profile';
import type { InvalidPayload } from '../../domain/coding-stats-source/coding-stats-source';

import { err, type Result } from '../../../../shared/kernel/result/result';
import { asNumber, asRecord, asString, type JsonRecord } from './json-guard';

const INVALID: InvalidPayload = { kind: 'InvalidPayload' };

interface CodewarsFields {
  readonly honor: number;
  readonly rank: number;
  readonly kyuName: string;
  readonly completedKata: number;
}

function readFields(user: JsonRecord | undefined): CodewarsFields | undefined {
  if (user === undefined) {
    return undefined;
  }
  const overall = asRecord(asRecord(user['ranks'])?.['overall']);
  const challenges = asRecord(user['codeChallenges']);
  const fields = {
    honor: asNumber(user['honor']),
    rank: asNumber(overall?.['rank']),
    kyuName: asString(overall?.['name']),
    completedKata: asNumber(challenges?.['totalCompleted']),
  };
  return Object.values(fields).includes(undefined) ? undefined : (fields as CodewarsFields);
}

/**
 * Maps the Codewars `GET /api/v1/users/:name` payload to a validated
 * CodingProfile. Codewars reports ranks as negative numbers (−8 = "8 kyu");
 * the domain keeps the positive kyu.
 */
export function toCodewarsProfile(input: {
  readonly raw: unknown;
  readonly handle: string;
  readonly profileUrl: string;
  readonly fetchedAt: string;
}): Result<CodingProfile, InvalidPayload> {
  const user = asRecord(input.raw);
  const fields = readFields(user);
  if (fields === undefined) {
    return err(INVALID);
  }
  const { honor, rank, kyuName, completedKata } = fields;
  const created = codingProfile.create({
    platform: 'codewars',
    handle: input.handle,
    profileUrl: input.profileUrl,
    fetchedAt: input.fetchedAt,
    totalSolved: completedKata,
    facts: {
      kind: 'codewars',
      honor,
      kyu: -rank,
      kyuName,
      completedKata,
      leaderboardPosition: asNumber(user?.['leaderboardPosition']),
    },
  });
  // Domain rejection here means the source's payload is incoherent — report
  // it as the source's fault, not as a content bug.
  return created.ok ? created : err(INVALID);
}
