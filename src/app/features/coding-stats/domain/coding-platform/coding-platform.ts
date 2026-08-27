/**
 * An algorithmic-practice platform the candidate is present on. The union is
 * deliberately closed: every platform carries its own facts shape in
 * CodingProfile, and a new platform is a new union member plus an adapter.
 */
export type CodingPlatform = 'leetcode' | 'codeforces' | 'codewars';

/** All supported platforms, in display order. */
export const CODING_PLATFORMS: readonly CodingPlatform[] = ['leetcode', 'codeforces', 'codewars'];

/** One account to show on the stats page: platform, handle, public URL. */
export interface CodingPlatformTarget {
  readonly platform: CodingPlatform;
  readonly handle: string;
  readonly profileUrl: string;
}
