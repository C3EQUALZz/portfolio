import type { Result } from '../../../../shared/kernel/result/result';
import type { CodingProfile } from '../coding-profile/coding-profile';

/** The request hung past the source timeout. */
interface SourceTimeout {
  readonly kind: 'SourceTimeout';
}

/** Network failure or a 5xx from the source. */
interface SourceUnavailable {
  readonly kind: 'SourceUnavailable';
}

/** The source answered, but the payload does not match the expected shape. */
export interface InvalidPayload {
  readonly kind: 'InvalidPayload';
}

/** The source answered and the handle does not exist there. */
interface ProfileNotFound {
  readonly kind: 'ProfileNotFound';
}

/** What one source can fail with. */
export type SingleSourceError =
  SourceTimeout | SourceUnavailable | InvalidPayload | ProfileNotFound;

/** One failed attempt of the failover chain, kept for diagnostics. */
export interface SourceAttempt {
  /** Human-readable source name (e.g. the host), presentational. */
  readonly source: string;
  readonly error: SingleSourceError;
}

/** The chain as a whole failed — carries every attempt in order. */
interface AllSourcesUnavailable {
  readonly kind: 'AllSourcesUnavailable';
  readonly attempts: readonly SourceAttempt[];
}

export type StatsSourceError = SingleSourceError | AllSourcesUnavailable;

/**
 * Domain port: loads one platform profile from an external API. Promise, not
 * Observable — the domain knows nothing about RxJS. The Angular adapter
 * (failover chain, timeout, cache) lives in the infrastructure layer.
 */
export interface CodingStatsSource {
  fetch(handle: string): Promise<Result<CodingProfile, StatsSourceError>>;
}
