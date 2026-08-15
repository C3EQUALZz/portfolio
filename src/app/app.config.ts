import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideI18n } from './core/i18n/provide-i18n';
import { provideResumeFeature } from './features/resume';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideI18n(),
    provideResumeFeature(),
  ],
};
