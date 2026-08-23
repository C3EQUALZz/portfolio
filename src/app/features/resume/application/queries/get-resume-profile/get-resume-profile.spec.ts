import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { resumeContent } from '../../../infrastructure/content/resume-content';
import { toResume } from '../../../infrastructure/content/to-resume';

import { provideResumeFeature } from '../../..';
import { must } from '../../../../../shared/testing/must';
import { GetResumeProfileHandler } from './get-resume-profile';

describe('GetResumeProfileHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideResumeFeature()] });
  });

  it('answers with the person and availability of the loaded resume', async () => {
    const handler = TestBed.inject(GetResumeProfileHandler);
    const profile = handler.handle({ kind: 'getResumeProfile' });
    await TestBed.inject(ApplicationRef).whenStable();

    const expected = must(toResume(resumeContent));
    expect(profile()?.person).toEqual(expected.person);
    expect(profile()?.availability).toEqual(expected.availability);
  });
});
