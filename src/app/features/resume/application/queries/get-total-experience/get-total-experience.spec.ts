import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { resume } from '../../../domain/resume/resume';

import { resumeContent } from '../../../infrastructure/content/resume-content';
import { toResume } from '../../../infrastructure/content/to-resume';

import { provideResumeFeature } from '../../..';
import { yearMonth } from '../../../../../shared/kernel/time/year-month';
import { must } from '../../../../../shared/testing/must';
import { GetTotalExperienceHandler } from './get-total-experience';

describe('GetTotalExperienceHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideResumeFeature()] });
  });

  it('answers with the union-of-intervals total derived from the content dates', async () => {
    const handler = TestBed.inject(GetTotalExperienceHandler);
    const total = handler.handle({ kind: 'getTotalExperience' });
    await TestBed.inject(ApplicationRef).whenStable();

    const expected = must(toResume(resumeContent));
    expect(total()).toEqual(resume.totalExperience(expected, yearMonth.fromDate(new Date())));
  });
});
