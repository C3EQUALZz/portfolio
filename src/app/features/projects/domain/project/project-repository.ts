import type { Result } from '../../../../shared/kernel/result/result';
import type { Project } from './project';

export interface ProjectsUnavailable {
  readonly kind: 'ProjectsUnavailable';
}

/**
 * The port through which the application layer lists the Projects. Promise,
 * not Observable: the domain knows nothing about RxJS. The Angular adapter
 * wraps this in `resource()`.
 */
export interface ProjectRepository {
  list(): Promise<Result<readonly Project[], ProjectsUnavailable>>;
}
