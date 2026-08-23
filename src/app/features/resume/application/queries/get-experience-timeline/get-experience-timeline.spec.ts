import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { resume } from '../../../domain/resume/resume';

import { resumeContent } from '../../../infrastructure/content/resume-content';
import { toResume } from '../../../infrastructure/content/to-resume';

import { provideResumeFeature } from '../../..';
import { period } from '../../../../../shared/kernel/time/period';
import { yearMonth } from '../../../../../shared/kernel/time/year-month';
import { must } from '../../../../../shared/testing/must';
import { ResumeStore } from '../../resume-store/resume-store';
import { GetExperienceTimelineHandler } from './get-experience-timeline';

describe('GetExperienceTimelineHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideResumeFeature()] });
  });

  it('answers with the roles newest first', async () => {
    const handler = TestBed.inject(GetExperienceTimelineHandler);
    const timeline = handler.handle({ kind: 'getExperienceTimeline' });
    await TestBed.inject(ApplicationRef).whenStable();

    const expected = resume.experiencesByRecency(must(toResume(resumeContent)));
    expect(timeline().map((item) => item.experience.id)).toEqual(expected.map((item) => item.id));
  });

  it('resolves each duration in months against the store asOf', async () => {
    const handler = TestBed.inject(GetExperienceTimelineHandler);
    const timeline = handler.handle({ kind: 'getExperienceTimeline' });
    await TestBed.inject(ApplicationRef).whenStable();

    const asOf = TestBed.inject(ResumeStore).asOfDate;
    expect(asOf).toEqual(yearMonth.fromDate(new Date()));
    for (const item of timeline()) {
      expect(item.durationInMonths).toBe(period.durationInMonths(item.experience.period, asOf));
    }
  });
});
