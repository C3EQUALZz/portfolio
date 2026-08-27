import type { CodingProfile } from '../../domain/coding-profile/coding-profile';
import type {
  CodingStatsSource,
  SourceAttempt,
  StatsSourceError,
} from '../../domain/coding-stats-source/coding-stats-source';

import { err, type Result } from '../../../../shared/kernel/result/result';

/** One named member of the failover chain. */
export interface FailoverMember {
  readonly name: string;
  readonly source: CodingStatsSource;
}

/**
 * Walks the chain in order and returns the first success — Chain of
 * Responsibility in miniature. Every failure is recorded, so a total outage
 * surfaces as one AllSourcesUnavailable with the full attempt log instead of
 * swallowing which sources were tried.
 */
export class FailoverCodingStatsSource implements CodingStatsSource {
  private readonly members: readonly FailoverMember[];

  constructor(members: readonly FailoverMember[]) {
    this.members = members;
  }

  async fetch(handle: string): Promise<Result<CodingProfile, StatsSourceError>> {
    const attempts: SourceAttempt[] = [];
    for (const member of this.members) {
      const result = await member.source.fetch(handle);
      if (result.ok) {
        return result;
      }
      const error = result.error;
      if (error.kind !== 'AllSourcesUnavailable') {
        attempts.push({ source: member.name, error });
      }
    }
    return err({ kind: 'AllSourcesUnavailable', attempts });
  }
}
