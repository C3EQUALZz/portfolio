import type { Project } from '../project/project';
import type { RepositorySnapshot } from '../repository-snapshot/repository-snapshot';

/**
 * A Project together with its RepositorySnapshot, when there is one. The
 * absence of a snapshot is a normal state, not an error: the project is
 * shown without stars. See CONTEXT.md.
 */
export interface ShowcasedProject {
  readonly project: Project;
  readonly snapshot?: RepositorySnapshot;
}

export const showcasedProject = {
  of(project: Project, snapshot?: RepositorySnapshot): ShowcasedProject {
    return snapshot === undefined ? { project } : { project, snapshot };
  },
};
