import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { resumeContent } from '../../../infrastructure/content/resume-content';
import { toResume } from '../../../infrastructure/content/to-resume';

import { provideResumeFeature } from '../../..';
import { must } from '../../../../../shared/testing/must';
import { GetLeadTechnologiesHandler } from './get-lead-technologies';

describe('GetLeadTechnologiesHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideResumeFeature()] });
  });

  it('answers with exactly the lead technologies of the skill groups', async () => {
    const handler = TestBed.inject(GetLeadTechnologiesHandler);
    const lead = handler.handle({ kind: 'getLeadTechnologies', limit: 18 });
    await TestBed.inject(ApplicationRef).whenStable();

    const expectedNames = must(toResume(resumeContent))
      .skillGroups.flatMap((group) => group.entries)
      .filter((entry) => entry.emphasis === 'lead')
      .map((entry) => entry.technology.name);

    expect(lead().map((technology) => technology.name)).toEqual(expectedNames.slice(0, 18));
  });

  it('trims the answer to the requested limit', async () => {
    const handler = TestBed.inject(GetLeadTechnologiesHandler);
    const lead = handler.handle({ kind: 'getLeadTechnologies', limit: 3 });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(lead()).toHaveLength(3);
  });
});
