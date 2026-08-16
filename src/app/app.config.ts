import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideI18n } from './core/i18n/provide-i18n';
import { provideCertificatesFeature } from './features/certificates';
import { provideContactFeature } from './features/contact';
import { provideProjectsFeature } from './features/projects';
import { provideResumeFeature } from './features/resume';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // anchorScrolling keeps the header's #section links working on the landing.
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
    ),
    provideI18n(),
    provideResumeFeature(),
    provideProjectsFeature(),
    provideContactFeature(),
    provideCertificatesFeature(),
  ],
};
