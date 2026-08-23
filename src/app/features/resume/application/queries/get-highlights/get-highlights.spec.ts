import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { resumeContent } from '../../../infrastructure/content/resume-content';
import { toResume } from '../../../infrastructure/content/to-resume';

import { provideResumeFeature } from '../../..';
import { must } from '../../../../../shared/testing/must';
import { GetHighlightsHandler } from './get-highlights';

describe('GetHighlightsHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideResumeFeature()] });
  });

  it('answers with the highlights in content order', async () => {
    const handler = TestBed.inject(GetHighlightsHandler);
    const highlights = handler.handle({ kind: 'getHighlights' });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(highlights()).toEqual(must(toResume(resumeContent)).highlights);
  });
});
