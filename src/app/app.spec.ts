import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';
import { provideCertificatesFeature } from './features/certificates';
import { provideContactFeature } from './features/contact';
import { provideProjectsFeature } from './features/projects';
import { provideResumeFeature } from './features/resume';
import { provideI18n } from './shared/i18n/provide-i18n';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideI18n(),
        provideResumeFeature(),
        provideProjectsFeature(),
        provideContactFeature(),
        provideCertificatesFeature(),
      ],
    }).compileComponents();
  });

  it('creates the shell with header, router outlet and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-header')).toBeTruthy();
    expect(element.querySelector('router-outlet')).toBeTruthy();
    expect(element.querySelector('app-footer')).toBeTruthy();
  });
});
