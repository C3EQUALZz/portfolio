import { ViewportScroller } from '@angular/common';
import { ApplicationRef, PendingTasks } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { provideContactFeature } from '../features/contact';
import { provideProjectsFeature } from '../features/projects';
import { provideResumeFeature } from '../features/resume';
import { provideI18n } from '../shared/i18n/provide-i18n';
import { LandingPage } from './landing-page';

describe('LandingPage', () => {
  const snapshot: { fragment: string | null } = { fragment: null };

  beforeEach(async () => {
    snapshot.fragment = null;
    await TestBed.configureTestingModule({
      imports: [LandingPage],
      providers: [
        provideRouter([]),
        provideI18n(),
        provideResumeFeature(),
        provideProjectsFeature(),
        provideContactFeature(),
        { provide: ActivatedRoute, useValue: { snapshot } },
      ],
    }).compileComponents();
  });

  it('waits for initial content to settle and does not scroll again on later renders', async () => {
    snapshot.fragment = 'stack';
    const scroll = vi
      .spyOn(TestBed.inject(ViewportScroller), 'scrollToAnchor')
      .mockImplementation(() => undefined);
    const release = TestBed.inject(PendingTasks).add();
    const fixture = TestBed.createComponent(LandingPage);
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(scroll).not.toHaveBeenCalled();

    release();
    await fixture.whenStable();
    expect(scroll).toHaveBeenCalledExactlyOnceWith('stack');
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();
    expect(scroll).toHaveBeenCalledOnce();
  });

  it('leaves the reading position alone when there is no initial anchor', async () => {
    const scroll = vi
      .spyOn(TestBed.inject(ViewportScroller), 'scrollToAnchor')
      .mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(LandingPage);
    await fixture.whenStable();
    expect(scroll).not.toHaveBeenCalled();
  });

  it('does not scroll after the reader has left the landing while content was loading', async () => {
    snapshot.fragment = 'stack';
    const scroll = vi
      .spyOn(TestBed.inject(ViewportScroller), 'scrollToAnchor')
      .mockImplementation(() => undefined);
    const release = TestBed.inject(PendingTasks).add();
    const fixture = TestBed.createComponent(LandingPage);
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.destroy();
    release();
    await TestBed.inject(ApplicationRef).whenStable();
    expect(scroll).not.toHaveBeenCalled();
  });
});
