import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { resumeContent } from '../../../infrastructure/content/resume-content';
import { toResume } from '../../../infrastructure/content/to-resume';

import { provideResumeFeature } from '../../..';
import { must } from '../../../../../shared/testing/must';
import { GetSkillGroupsHandler } from './get-skill-groups';

describe('GetSkillGroupsHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideResumeFeature()] });
  });

  it('answers with every skill group from the content', async () => {
    const handler = TestBed.inject(GetSkillGroupsHandler);
    const groups = handler.handle({ kind: 'getSkillGroups' });
    await TestBed.inject(ApplicationRef).whenStable();

    const expected = must(toResume(resumeContent));
    expect(groups().map((group) => group.title)).toEqual(
      expected.skillGroups.map((group) => group.title),
    );
    expect(groups().flatMap((group) => group.entries)).toHaveLength(
      expected.skillGroups.flatMap((group) => group.entries).length,
    );
  });

  it('resolves the emphasis into a plain lead flag', async () => {
    const handler = TestBed.inject(GetSkillGroupsHandler);
    const groups = handler.handle({ kind: 'getSkillGroups' });
    await TestBed.inject(ApplicationRef).whenStable();

    const expected = must(toResume(resumeContent));
    const expectedLeads = expected.skillGroups.map((group) =>
      group.entries.map((entry) => entry.emphasis === 'lead'),
    );
    expect(groups().map((group) => group.entries.map((entry) => entry.lead))).toEqual(
      expectedLeads,
    );
  });
});
