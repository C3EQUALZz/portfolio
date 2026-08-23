import { inject, Injectable, InjectionToken, resource, type Signal } from '@angular/core';

import type { Resume } from '../../domain/resume/resume';
import type { ResumeRepository } from '../../domain/resume/resume-repository';

import { yearMonth, type YearMonth } from '../../../../shared/kernel/time/year-month';

/** DI token for the domain port; the adapter is wired by provideResumeFeature. */
export const RESUME_REPOSITORY = new InjectionToken<ResumeRepository>('RESUME_REPOSITORY');

/**
 * Feature state: the Resume loaded through the port. Pure state — data,
 * loading flags and the fixed asOf — that the query handlers derive from;
 * no derived signals live here. Works only through the port — the adapter
 * choice (static content, JSON, CMS) is invisible here.
 */
@Injectable({ providedIn: 'root' })
export class ResumeStore {
  private readonly repository = inject(RESUME_REPOSITORY);
  /** asOf is fixed at page load; the resume does not age while you read it. */
  private readonly asOf: YearMonth = yearMonth.fromDate(new Date());

  private readonly resumeResource = resource({
    loader: async () => {
      const result = await this.repository.load();
      if (!result.ok) {
        throw new Error(result.error.kind);
      }
      return result.value;
    },
  });

  readonly data: Signal<Resume | undefined> = this.resumeResource.value;
  readonly isLoading = this.resumeResource.isLoading;
  readonly failed = this.resumeResource.error;

  /** The asOf the query derivations are made with — fixed at page load. */
  get asOfDate(): YearMonth {
    return this.asOf;
  }
}
