import type { Result } from '../../../../shared/kernel/result/result';
import type { Resume } from './resume';

export interface ResumeUnavailable {
  readonly kind: 'ResumeUnavailable';
}

/**
 * The port through which the application layer loads the Resume. Promise, not
 * Observable: the domain knows nothing about RxJS. The Angular adapter wraps
 * this in `resource()`.
 */
export interface ResumeRepository {
  load(): Promise<Result<Resume, ResumeUnavailable>>;
}
