import { err, ok, type Result } from '../../../../shared/kernel/result/result';
import type { Technology } from '../../../../shared/kernel/technology/technology';
import type { Period } from '../../../../shared/kernel/time/period';
import { yearMonth, type YearMonth } from '../../../../shared/kernel/time/year-month';
import type { Availability } from '../availability/availability';
import type { Credential } from '../credential/credential';
import type { Education } from '../education/education';
import { experience, type Experience } from '../experience/experience';
import type { Highlight } from '../highlight/highlight';
import type { LanguageSkill } from '../language-skill/language-skill';
import type { Person } from '../person/person';
import type { SkillGroup } from '../skill-group/skill-group';

/**
 * An immutable document describing one person as a candidate. Validated whole
 * at parse time; afterwards it is only read — there are no commands that
 * change it. See CONTEXT.md.
 */
export interface Resume {
  readonly person: Person;
  readonly availability: Availability;
  readonly experiences: readonly Experience[];
  readonly skillGroups: readonly SkillGroup[];
  readonly highlights: readonly Highlight[];
  readonly education: readonly Education[];
  readonly languages: readonly LanguageSkill[];
  readonly credentials: readonly Credential[];
}

export type ResumeInput = Resume;

export type ResumeErrorKind =
  | 'EmptyExperiences'
  | 'DuplicateExperienceIds'
  | 'MultipleOngoingRoles'
  | 'OverlappingPeriods'
  | 'EmptySkillGroups'
  | 'NativeLanguageCount';

export interface ResumeError {
  readonly kind: ResumeErrorKind;
}

function failure(kind: ResumeErrorKind): Result<never, ResumeError> {
  return err({ kind });
}

interface Interval {
  readonly start: YearMonth;
  readonly end: YearMonth;
}

/**
 * A conflict is an intersection deeper than one shared month. Sharing a
 * boundary month is a job transition, not parallel work. Disjoint periods
 * never conflict: their later start is past the earlier end.
 */
function periodsConflict(a: Period, b: Period): boolean {
  const earlierEnd = minEnd(a.end, b.end);
  if (earlierEnd === 'present') {
    // Both roles are ongoing. Unreachable in practice: the MultipleOngoingRoles
    // invariant runs first, so at most one period can end in 'present' here.
    return true;
  }
  return yearMonth.compare(laterStart(a, b), earlierEnd) < 0;
}

function laterStart(a: Period, b: Period): YearMonth {
  return yearMonth.compare(a.start, b.start) >= 0 ? a.start : b.start;
}

/** 'present' is unbounded: the other end is the earlier one. */
function minEnd(a: YearMonth | 'present', b: YearMonth | 'present'): YearMonth | 'present' {
  if (a === 'present') {
    return b;
  }
  if (b === 'present') {
    return a;
  }
  return yearMonth.compare(a, b) <= 0 ? a : b;
}

function toInterval(item: Experience, asOf: YearMonth): Interval {
  return { start: item.period.start, end: item.period.end === 'present' ? asOf : item.period.end };
}

function mergeIntervals(sorted: readonly Interval[]): Interval[] {
  const merged: { start: YearMonth; end: YearMonth }[] = [];
  for (const interval of sorted) {
    const last = merged.at(-1);
    if (last !== undefined && yearMonth.diffInMonths(interval.start, last.end) <= 1) {
      last.end = yearMonth.compare(interval.end, last.end) > 0 ? interval.end : last.end;
    } else {
      merged.push({ start: interval.start, end: interval.end });
    }
  }
  return merged;
}

type Invariant = (input: ResumeInput) => ResumeErrorKind | undefined;

const hasDuplicateIds: Invariant = (input) => {
  const ids = input.experiences.map((item) => item.id);
  return new Set(ids).size === ids.length ? undefined : 'DuplicateExperienceIds';
};

const hasMultipleOngoing: Invariant = (input) =>
  input.experiences.filter((item) => experience.isOngoing(item)).length > 1
    ? 'MultipleOngoingRoles'
    : undefined;

const hasConflictingPeriods: Invariant = (input) =>
  input.experiences.some((item, index) =>
    input.experiences.slice(index + 1).some((other) => periodsConflict(item.period, other.period)),
  )
    ? 'OverlappingPeriods'
    : undefined;

const INVARIANTS: readonly Invariant[] = [
  (input) => (input.experiences.length === 0 ? 'EmptyExperiences' : undefined),
  hasDuplicateIds,
  hasMultipleOngoing,
  hasConflictingPeriods,
  (input) => (input.skillGroups.length === 0 ? 'EmptySkillGroups' : undefined),
  (input) =>
    input.languages.filter((lang) => lang.level === 'native').length === 1
      ? undefined
      : 'NativeLanguageCount',
];

export const resume = {
  create(input: ResumeInput): Result<Resume, ResumeError> {
    for (const check of INVARIANTS) {
      const violation = check(input);
      if (violation !== undefined) {
        return failure(violation);
      }
    }
    return ok(input);
  },

  /**
   * Total experience as the union of work intervals with inclusive month
   * counting. Gaps — like the real Dec 2024 – Jun 2025 break — do not count,
   * and a transition month shared by two roles is counted once.
   */
  totalExperience(resume: Resume, asOf: YearMonth): { years: number; months: number } {
    const intervals = resume.experiences
      .map((item) => toInterval(item, asOf))
      .sort((a, b) => yearMonth.compare(a.start, b.start));
    const months = mergeIntervals(intervals).reduce(
      (total, interval) => total + yearMonth.diffInMonths(interval.end, interval.start) + 1,
      0,
    );
    return { years: Math.floor(months / 12), months: months % 12 };
  },

  currentRole(resume: Resume): Experience | undefined {
    return resume.experiences.find((item) => experience.isOngoing(item));
  },

  experiencesByRecency(resume: Resume): readonly Experience[] {
    return [...resume.experiences].sort((a, b) =>
      yearMonth.compare(b.period.start, a.period.start),
    );
  },

  /** Union of all cluster technologies across experiences, deduplicated by slug. */
  technologies(resume: Resume): readonly Technology[] {
    const all = resume.experiences.flatMap((item) =>
      item.technologies.flatMap((cluster) => cluster.technologies),
    );
    return [...new Map(all.map((tech) => [tech.slug, tech])).values()];
  },
};
