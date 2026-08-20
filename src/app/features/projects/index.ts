import type { EnvironmentProviders, Provider } from '@angular/core';

import { PROJECT_REPOSITORY } from './application/projects-store/projects-store';

import { staticProjectRepository } from './infrastructure/content/static-project-repository';

export { ProjectsSection } from './presentation/projects-section/projects-section';

/**
 * Wires the domain port to the current adapter. Swapping the source
 * (static literal → GitHub API) means changing this one provider.
 */
export function provideProjectsFeature(): (Provider | EnvironmentProviders)[] {
  return [{ provide: PROJECT_REPOSITORY, useValue: staticProjectRepository }];
}
