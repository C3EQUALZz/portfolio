import type { CodingProfile } from '../../domain/coding-profile/coding-profile';
import type {
  CodingStatsSource,
  StatsSourceError,
} from '../../domain/coding-stats-source/coding-stats-source';

import { err, type Result } from '../../../../shared/kernel/result/result';
import { toCodeforcesProfile } from '../content/to-codeforces-profile';
import { fetchJson, type FetchLike } from './fetch-json';

const BASE_URL = 'https://codeforces.com';
const TIMEOUT_MS = 45_000;

/**
 * Official Codeforces API adapter (CORS is open, no proxy needed). Only
 * user.info is required; the rating history and the submissions feed enrich
 * the card and degrade to empty on failure.
 *
 * user.status has no server-side aggregation, so the full feed is fetched and
 * the mapper counts distinct OK problems — acceptable while the feed is
 * small, worth revisiting if the account gets heavy.
 */
export class CodeforcesSource implements CodingStatsSource {
  private readonly profileUrl: string;
  private readonly fetchImpl: FetchLike | undefined;

  constructor(profileUrl: string, fetchImpl?: FetchLike) {
    this.profileUrl = profileUrl;
    this.fetchImpl = fetchImpl;
  }

  async fetch(handle: string): Promise<Result<CodingProfile, StatsSourceError>> {
    const info = await fetchJson(
      `${BASE_URL}/api/user.info?handles=${handle}`,
      TIMEOUT_MS,
      this.fetchImpl,
    );
    if (!info.ok) {
      return err(info.error);
    }
    const [rating, status] = await Promise.all([
      fetchJson(`${BASE_URL}/api/user.rating?handle=${handle}`, TIMEOUT_MS, this.fetchImpl),
      fetchJson(`${BASE_URL}/api/user.status?handle=${handle}`, TIMEOUT_MS, this.fetchImpl),
    ]);
    return toCodeforcesProfile({
      raw: {
        info: info.value,
        rating: rating.ok ? rating.value : undefined,
        status: status.ok ? status.value : undefined,
      },
      handle,
      profileUrl: this.profileUrl,
      fetchedAt: new Date().toISOString(),
    });
  }
}
