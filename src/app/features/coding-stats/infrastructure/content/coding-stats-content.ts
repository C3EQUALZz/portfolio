import type { CodingPlatformTarget } from '../../domain/coding-platform/coding-platform';

/** One member of a failover chain: a human name plus the API base URL. */
export interface SourceEndpoint {
  readonly name: string;
  readonly baseUrl: string;
}

/**
 * The stats-page content: which accounts to show, where to fetch them and how
 * long a fetched profile may be served from the cache. Typed TS, not JSON
 * over HTTP — the compiler checks it. The TTL is a content decision: how
 * stale the stats may look, not a domain rule.
 */
export const codingStatsContent = {
  /** Minutes a cached profile is served without a network round-trip. */
  ttlMinutes: 60,
  /**
   * LeetCode has no CORS-open API of its own, so the chain walks public
   * proxy APIs. leetcode-rest-api's response shape is unverified (the public
   * instance was unreachable at authoring time) — it joins the chain once a
   * real response has been mapped; until then alfa-leetcode-api is the only
   * member, and the failover design stays.
   */
  leetcodeSources: [
    { name: 'alfa-leetcode-api', baseUrl: 'https://alfa-leetcode-api.onrender.com' },
  ] satisfies readonly SourceEndpoint[],
  targets: [
    {
      platform: 'leetcode',
      handle: 'c3equalzRU',
      profileUrl: 'https://leetcode.com/u/c3equalzRU/',
    },
    {
      platform: 'codeforces',
      handle: 'c3equalz',
      profileUrl: 'https://codeforces.com/profile/c3equalz',
    },
    {
      platform: 'codewars',
      handle: 'C3EQUALZz',
      profileUrl: 'https://www.codewars.com/users/C3EQUALZz',
    },
  ] satisfies readonly CodingPlatformTarget[],
};
