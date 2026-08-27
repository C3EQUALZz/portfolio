import type { CodingPlatform } from '../coding-platform/coding-platform';
import type { CodingProfile } from '../coding-profile/coding-profile';

/** A profile kept between visits, with the instant it was cached (ISO). */
export interface CachedProfile {
  readonly profile: CodingProfile;
  readonly cachedAt: string;
}

/**
 * Domain port: the read-through cache behind the stats page. The domain
 * declares the shape only — the TTL policy is an application concern, the
 * localStorage mechanics are an infrastructure concern.
 */
export interface StatsCache {
  read(platform: CodingPlatform): CachedProfile | undefined;
  write(profile: CodingProfile, cachedAt: string): void;
  clear(platform: CodingPlatform): void;
}
