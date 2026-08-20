import type { EnvironmentProviders, Provider } from '@angular/core';

import { RESUME_REPOSITORY } from './application/resume-store/resume-store';

import { staticResumeRepository } from './infrastructure/content/static-resume-repository';

export { AboutSection } from './presentation/about/about-section';
export { EducationSection } from './presentation/education/education-section';
export { ExperienceSection } from './presentation/experience/experience-section';
export { Hero } from './presentation/hero/hero';
export { StackSection } from './presentation/stack/stack-section';

/**
 * Wires the domain port to the current adapter. Swapping the content source
 * (static literal → JSON/GitHub API) means changing this one provider.
 */
export function provideResumeFeature(): (Provider | EnvironmentProviders)[] {
  return [{ provide: RESUME_REPOSITORY, useValue: staticResumeRepository }];
}
