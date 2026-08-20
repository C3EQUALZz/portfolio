import { type Routes } from '@angular/router';

import { CertificatesPage } from './features/certificates';
import { LandingPage } from './pages/landing-page';

export const routes: Routes = [
  { path: '', component: LandingPage, pathMatch: 'full' },
  { path: 'certificates', component: CertificatesPage },
];
