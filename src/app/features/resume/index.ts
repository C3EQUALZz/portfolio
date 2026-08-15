import type { EnvironmentProviders, Provider } from '@angular/core';

import { RESUME_REPOSITORY } from './application/resume-store/resume-store';

import { staticResumeRepository } from './infrastructure/content/static-resume-repository';

export { Hero } from './ui/hero/hero';

/**
 * Wires the domain port to the current adapter. Swapping the content source
 * (static literal → JSON/GitHub API) means changing this one provider.
 */
export function provideResumeFeature(): (Provider | EnvironmentProviders)[] {
  return [{ provide: RESUME_REPOSITORY, useValue: staticResumeRepository }];
}
