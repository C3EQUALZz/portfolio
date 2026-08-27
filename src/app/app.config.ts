import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideCertificatesFeature } from './features/certificates';
import { provideCodingStatsFeature } from './features/coding-stats';
import { provideContactFeature } from './features/contact';
import { provideProjectsFeature } from './features/projects';
import { provideResumeFeature } from './features/resume';
import { provideI18n } from './shared/i18n/provide-i18n';
import { shouldSkipViewTransition } from './view-transition-policy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // anchorScrolling keeps the header's #section links working on the landing.
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
      // Crossfade between routes; anchor-only navigations must not flash.
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: ({ transition, from, to }) => {
          if (shouldSkipViewTransition(from, to)) {
            transition.skipTransition();
          }
        },
      }),
    ),
    provideI18n(),
    provideResumeFeature(),
    provideProjectsFeature(),
    provideContactFeature(),
    provideCertificatesFeature(),
    provideCodingStatsFeature(),
  ],
};
