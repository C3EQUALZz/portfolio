import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideResumeFeature } from '../..';
import { ResumeStore } from './resume-store';

describe('ResumeStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideResumeFeature()] });
  });

  it('loads the resume through the wired adapter, no test doubles', async () => {
    const store = TestBed.inject(ResumeStore);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(store.isLoading()).toBe(false);
    expect(store.failed()).toBeUndefined();
    expect(store.data()?.person.name).toBe('Danil Kovalev');
  });

  it('fixes the asOf at page load so the resume does not age while read', () => {
    const store = TestBed.inject(ResumeStore);

    expect(store.asOfDate).toMatch(/^\d{4}-\d{2}$/);
  });
});
