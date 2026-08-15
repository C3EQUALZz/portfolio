import type { Resume } from '../../domain/resume/resume';
import type { ResumeRepository, ResumeUnavailable } from '../../domain/resume/resume-repository';

import { err, type Result } from '../../../../shared/kernel/result/result';
import { resumeContent } from './resume-content';
import { toResume } from './to-resume';

const UNAVAILABLE: ResumeUnavailable = { kind: 'ResumeUnavailable' };

/**
 * The current adapter: loads the Resume from the typed content literal.
 * Moving to JSON over HTTP or a CMS means replacing this one adapter —
 * the port and the domain stay untouched.
 */
export const staticResumeRepository: ResumeRepository = {
  load(): Promise<Result<Resume, ResumeUnavailable>> {
    const parsed = toResume(resumeContent);
    return Promise.resolve(parsed.ok ? parsed : err(UNAVAILABLE));
  },
};
