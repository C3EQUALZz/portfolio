import type { CodingProfile } from '../coding-profile/coding-profile';

/** Queries over the whole set of platform profiles. */
export const codingStats = {
  /** The headline number of the stats page: solved across all platforms. */
  totalSolved(profiles: readonly CodingProfile[]): number {
    return profiles.reduce((total, profile) => total + profile.totalSolved, 0);
  },
};
