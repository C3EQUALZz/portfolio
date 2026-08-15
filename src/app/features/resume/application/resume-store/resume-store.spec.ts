import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { resume } from '../../domain/resume/resume';

import { resumeContent } from '../../infrastructure/content/resume-content';
import { toResume } from '../../infrastructure/content/to-resume';

import { provideResumeFeature } from '../..';
import { yearMonth } from '../../../../shared/kernel/time/year-month';
import { must } from '../../../../shared/testing/must';
import { ResumeStore } from './resume-store';

describe('ResumeStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideResumeFeature()] });
  });

  it('loads the resume through the wired adapter, no test doubles', async () => {
    const store = TestBed.inject(ResumeStore);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(store.isLoading()).toBe(false);
    expect(store.data()?.person.name).toBe('Danil Kovalev');
  });

  it('derives the current role and total experience from the content dates', async () => {
    const store = TestBed.inject(ResumeStore);
    await TestBed.inject(ApplicationRef).whenStable();

    const expected = must(toResume(resumeContent));
    expect(store.currentRole()?.id).toBe('spetsvuz');
    expect(store.totalExperience()).toEqual(
      resume.totalExperience(expected, yearMonth.fromDate(new Date())),
    );
  });

  it('exposes exactly the lead technologies for the hero ring', async () => {
    const store = TestBed.inject(ResumeStore);
    await TestBed.inject(ApplicationRef).whenStable();

    const leadNames = must(toResume(resumeContent))
      .skillGroups.flatMap((group) => group.entries)
      .filter((entry) => entry.emphasis === 'lead')
      .map((entry) => entry.technology.name);

    expect(store.leadTechnologies().map((technology) => technology.name)).toEqual(
      leadNames.slice(0, 18),
    );
  });
});
