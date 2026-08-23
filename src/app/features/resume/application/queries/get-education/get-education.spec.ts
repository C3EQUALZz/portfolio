import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { resumeContent } from '../../../infrastructure/content/resume-content';
import { toResume } from '../../../infrastructure/content/to-resume';

import { provideResumeFeature } from '../../..';
import { must } from '../../../../../shared/testing/must';
import { GetEducationHandler } from './get-education';

describe('GetEducationHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideResumeFeature()] });
  });

  it('answers with the education and languages of the loaded resume', async () => {
    const handler = TestBed.inject(GetEducationHandler);
    const overview = handler.handle({ kind: 'getEducation' });
    await TestBed.inject(ApplicationRef).whenStable();

    const expected = must(toResume(resumeContent));
    expect(overview()?.education).toEqual(expected.education);
    expect(overview()?.languages).toEqual(expected.languages);
  });
});
