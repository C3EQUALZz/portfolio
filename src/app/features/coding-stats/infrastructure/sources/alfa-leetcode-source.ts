import type { CodingProfile } from '../../domain/coding-profile/coding-profile';
import type {
  CodingStatsSource,
  StatsSourceError,
} from '../../domain/coding-stats-source/coding-stats-source';

import { err, type Result } from '../../../../shared/kernel/result/result';
import { toLeetCodeProfile } from '../content/to-leetcode-profile';
import { fetchJson, type FetchLike } from './fetch-json';

/** Per-request timeout: covers the public instance waking up from sleep. */
const TIMEOUT_MS = 45_000;

/**
 * alfa-leetcode-api adapter. The profile endpoint is required; the heatmap,
 * languages and recent submissions are enrichment — when one of them fails,
 * the mapper degrades that section to empty instead of failing the profile.
 */
export class AlfaLeetCodeSource implements CodingStatsSource {
  private readonly baseUrl: string;
  private readonly profileUrl: string;
  private readonly fetchImpl: FetchLike | undefined;

  constructor(baseUrl: string, profileUrl: string, fetchImpl?: FetchLike) {
    this.baseUrl = baseUrl;
    this.profileUrl = profileUrl;
    this.fetchImpl = fetchImpl;
  }

  async fetch(handle: string): Promise<Result<CodingProfile, StatsSourceError>> {
    const profile = await fetchJson(
      `${this.baseUrl}/${handle}/profile`,
      TIMEOUT_MS,
      this.fetchImpl,
    );
    if (!profile.ok) {
      return err(profile.error);
    }
    const [calendar, languages, recentAccepted] = await Promise.all([
      fetchJson(`${this.baseUrl}/${handle}/calendar`, TIMEOUT_MS, this.fetchImpl),
      fetchJson(`${this.baseUrl}/${handle}/language`, TIMEOUT_MS, this.fetchImpl),
      fetchJson(`${this.baseUrl}/${handle}/acSubmission?limit=5`, TIMEOUT_MS, this.fetchImpl),
    ]);
    return toLeetCodeProfile({
      raw: {
        profile: profile.value,
        calendar: calendar.ok ? calendar.value : undefined,
        languages: languages.ok ? languages.value : undefined,
        recentAccepted: recentAccepted.ok ? recentAccepted.value : undefined,
      },
      handle,
      profileUrl: this.profileUrl,
      fetchedAt: new Date().toISOString(),
    });
  }
}
