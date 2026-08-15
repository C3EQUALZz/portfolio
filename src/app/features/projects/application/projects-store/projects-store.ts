import { inject, Injectable, InjectionToken, resource, type Signal } from '@angular/core';

import type { Project } from '../../domain/project/project';
import type { ProjectRepository } from '../../domain/project/project-repository';

/** DI token for the domain port; the adapter is wired by provideProjectsFeature. */
export const PROJECT_REPOSITORY = new InjectionToken<ProjectRepository>('PROJECT_REPOSITORY');

/**
 * Feature state: the Project list loaded through the port. Works only
 * through the port — the adapter choice (static content, GitHub API) is
 * invisible here.
 */
@Injectable({ providedIn: 'root' })
export class ProjectsStore {
  private readonly repository = inject(PROJECT_REPOSITORY);

  private readonly projectsResource = resource({
    loader: async () => {
      const result = await this.repository.list();
      if (!result.ok) {
        throw new Error(result.error.kind);
      }
      return result.value;
    },
  });

  readonly data: Signal<readonly Project[] | undefined> = this.projectsResource.value;
  readonly isLoading = this.projectsResource.isLoading;
  readonly failed = this.projectsResource.error;
}
