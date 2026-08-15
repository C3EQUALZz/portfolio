import type { Project } from '../../domain/project/project';
import type {
  ProjectRepository,
  ProjectsUnavailable,
} from '../../domain/project/project-repository';

import { err, type Result } from '../../../../shared/kernel/result/result';
import { projectsContent } from './projects-content';
import { toProjects } from './to-project';

const UNAVAILABLE: ProjectsUnavailable = { kind: 'ProjectsUnavailable' };

/**
 * The current adapter: lists the Projects from the typed content literal.
 * Moving to the GitHub API means replacing this one adapter — the port
 * and the domain stay untouched.
 */
export const staticProjectRepository: ProjectRepository = {
  list(): Promise<Result<readonly Project[], ProjectsUnavailable>> {
    const parsed = toProjects(projectsContent);
    return Promise.resolve(parsed.ok ? parsed : err(UNAVAILABLE));
  },
};
