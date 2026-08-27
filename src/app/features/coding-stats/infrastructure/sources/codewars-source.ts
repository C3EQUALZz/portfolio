import type { CodingProfile } from '../../domain/coding-profile/coding-profile';
import type {
  CodingStatsSource,
  StatsSourceError,
} from '../../domain/coding-stats-source/coding-stats-source';

import { err, type Result } from '../../../../shared/kernel/result/result';
import { toCodewarsProfile } from '../content/to-codewars-profile';
import { fetchJson, type FetchLike } from './fetch-json';

const BASE_URL = 'https://www.codewars.com';
const TIMEOUT_MS = 45_000;

/** Codewars public API adapter (CORS is open, no proxy needed). */
export class CodewarsSource implements CodingStatsSource {
  private readonly profileUrl: string;
  private readonly fetchImpl: FetchLike | undefined;

  constructor(profileUrl: string, fetchImpl?: FetchLike) {
    this.profileUrl = profileUrl;
    this.fetchImpl = fetchImpl;
  }

  async fetch(handle: string): Promise<Result<CodingProfile, StatsSourceError>> {
    const user = await fetchJson(`${BASE_URL}/api/v1/users/${handle}`, TIMEOUT_MS, this.fetchImpl);
    if (!user.ok) {
      return err(user.error);
    }
    return toCodewarsProfile({
      raw: user.value,
      handle,
      profileUrl: this.profileUrl,
      fetchedAt: new Date().toISOString(),
    });
  }
}
