import { describe, expect, it } from 'vitest';

import { slug } from '../../../../shared/kernel/slug/slug';
import { period } from '../../../../shared/kernel/time/period';
import { yearMonth, type YearMonth } from '../../../../shared/kernel/time/year-month';
import { must } from '../../../../shared/testing/must';
import { achievement } from '../achievement/achievement';
import { availability } from '../availability/availability';
import { company } from '../company/company';
import { experience, type ExperienceInput } from '../experience/experience';
import { impact } from '../impact/impact';
import { languageSkill } from '../language-skill/language-skill';
import { person } from '../person/person';
import { skillGroup } from '../skill-group/skill-group';
import { technologyCluster } from '../technology-cluster/technology-cluster';
import { resume, type ResumeInput } from './resume';

function ym(year: number, month: number): YearMonth {
  return must(yearMonth.create(year, month));
}

function buildExperience(
  id: string,
  start: readonly [number, number],
  end: 'present' | readonly [number, number],
): ExperienceInput {
  return {
    id: must(slug.create(id)),
    period: must(
      period.create(ym(start[0], start[1]), end === 'present' ? 'present' : ym(end[0], end[1])),
    ),
    position: { en: 'Backend Developer', ru: 'Backend-разработчик' },
    company: must(company.create('Company')),
    product: { en: 'Product', ru: 'Продукт' },
    engagement: 'remote',
    impacts: [
      must(
        impact.numeric({
          label: { en: 'Metric', ru: 'Метрика' },
          amount: 40,
          unit: 'percent',
          direction: 'decrease',
        }),
      ),
    ],
    achievements: [
      must(
        achievement.create({
          lead: { en: 'Did a thing', ru: 'Сделал дело' },
          detail: { en: 'and it worked', ru: 'и оно сработало' },
        }),
      ),
    ],
    technologies: [must(technologyCluster.create({ technologies: ['Rust'], emphasis: 'lead' }))],
  };
}

function validInput(): ResumeInput {
  return {
    person: must(
      person.create({
        name: 'Danil Kovalev',
        headline: { en: 'Backend engineer building', ru: 'Backend-инженер' },
        roleHeadlines: [{ en: 'high-load Rust services', ru: 'сервисы на Rust' }],
        summary: { en: 'Summary', ru: 'О себе' },
      }),
    ),
    availability: must(
      availability.create({
        status: 'open',
        base: { en: 'Rostov-on-Don', ru: 'Ростов-на-Дону' },
        relocatesTo: [],
        employment: { en: 'Full-time', ru: 'Полная занятость' },
      }),
    ),
    experiences: [
      must(experience.create(buildExperience('ecom-tech', [2022, 9], [2024, 12]))),
      must(experience.create(buildExperience('iktin', [2025, 6], [2025, 12]))),
      must(experience.create(buildExperience('spetsvuz', [2025, 12], 'present'))),
    ],
    skillGroups: [
      must(
        skillGroup.create({
          title: { en: 'Data & transport', ru: 'Данные и транспорт' },
          entries: [{ technology: 'PostgreSQL', emphasis: 'lead' }],
        }),
      ),
    ],
    highlights: [],
    education: [],
    languages: [
      must(languageSkill.create({ language: { en: 'Russian', ru: 'Русский' }, level: 'native' })),
      must(languageSkill.create({ language: { en: 'English', ru: 'Английский' }, level: 'b2' })),
    ],
    credentials: [],
  };
}

describe('resume.create invariants', () => {
  it('creates a valid resume', () => {
    expect(resume.create(validInput()).ok).toBe(true);
  });

  it('rejects empty experiences', () => {
    expect(resume.create({ ...validInput(), experiences: [] })).toEqual({
      ok: false,
      error: { kind: 'EmptyExperiences' },
    });
  });

  it('rejects duplicated experience ids', () => {
    const input = validInput();
    const [first] = input.experiences;

    expect(resume.create({ ...input, experiences: [first!, first!] })).toEqual({
      ok: false,
      error: { kind: 'DuplicateExperienceIds' },
    });
  });

  it('rejects overlapping periods', () => {
    const input = validInput();
    const overlapping = must(experience.create(buildExperience('overlap', [2024, 6], [2025, 6])));

    expect(resume.create({ ...input, experiences: [...input.experiences, overlapping] })).toEqual({
      ok: false,
      error: { kind: 'OverlappingPeriods' },
    });
  });

  it('allows a shared boundary month — a job transition, not parallel work', () => {
    // validInput has Iktin "Jun – Dec 2025" and Spetsvuz "Dec 2025 – now" sharing December.
    expect(resume.create(validInput()).ok).toBe(true);
  });

  it('allows gaps between periods', () => {
    expect(resume.create(validInput()).ok).toBe(true);
  });

  it('rejects a period deeply overlapping the ongoing role, in any order', () => {
    const input = validInput();
    const insideOngoing = must(experience.create(buildExperience('inside', [2026, 3], [2026, 5])));

    expect(resume.create({ ...input, experiences: [...input.experiences, insideOngoing] })).toEqual(
      { ok: false, error: { kind: 'OverlappingPeriods' } },
    );
    expect(resume.create({ ...input, experiences: [insideOngoing, ...input.experiences] })).toEqual(
      { ok: false, error: { kind: 'OverlappingPeriods' } },
    );
  });

  it('rejects more than one ongoing role', () => {
    const input = validInput();
    const alsoOngoing = must(experience.create(buildExperience('other', [2026, 1], 'present')));

    expect(resume.create({ ...input, experiences: [...input.experiences, alsoOngoing] })).toEqual({
      ok: false,
      error: { kind: 'MultipleOngoingRoles' },
    });
  });

  it('rejects empty skill groups', () => {
    expect(resume.create({ ...validInput(), skillGroups: [] })).toEqual({
      ok: false,
      error: { kind: 'EmptySkillGroups' },
    });
  });

  it('rejects zero or several native languages', () => {
    const input = validInput();
    const noNative = input.languages.filter((lang) => lang.level !== 'native');
    const twoNative = [
      ...input.languages,
      must(languageSkill.create({ language: { en: 'Tatar', ru: 'Татарский' }, level: 'native' })),
    ];

    expect(resume.create({ ...input, languages: noNative })).toEqual({
      ok: false,
      error: { kind: 'NativeLanguageCount' },
    });
    expect(resume.create({ ...input, languages: twoNative })).toEqual({
      ok: false,
      error: { kind: 'NativeLanguageCount' },
    });
  });
});

describe('resume queries', () => {
  it('totalExperience merges intervals, counting the transition month once', () => {
    const created = must(resume.create(validInput()));

    // 28 (Sep 2022 – Dec 2024) + 15 (Jun 2025 – Aug 2026: Iktin and Spetsvuz share Dec 2025)
    expect(resume.totalExperience(created, ym(2026, 8))).toEqual({ years: 3, months: 7 });
  });

  it('totalExperience keeps separated gaps apart while merging the last cluster', () => {
    const input = validInput();
    const experiences = [
      must(experience.create(buildExperience('first', [2022, 1], [2022, 3]))),
      must(experience.create(buildExperience('second', [2022, 6], [2022, 8]))),
      must(experience.create(buildExperience('third', [2022, 10], [2022, 12]))),
      must(experience.create(buildExperience('fourth', [2022, 12], [2023, 2]))),
    ];
    const created = must(resume.create({ ...input, experiences }));

    // 3 (Jan – Mar) + 3 (Jun – Aug) + 5 (Oct – Feb, the shared December counted once)
    expect(resume.totalExperience(created, ym(2026, 8))).toEqual({ years: 0, months: 11 });
  });

  it('currentRole returns the ongoing experience', () => {
    const created = must(resume.create(validInput()));

    expect(resume.currentRole(created)?.id).toBe('spetsvuz');
  });

  it('currentRole is undefined when nothing is ongoing', () => {
    const input = validInput();
    const [, second] = input.experiences;
    const finished = must(resume.create({ ...input, experiences: [second!] }));

    expect(resume.currentRole(finished)).toBeUndefined();
  });

  it('experiencesByRecency sorts by period start, newest first', () => {
    const created = must(resume.create(validInput()));

    expect(resume.experiencesByRecency(created).map((item) => item.id)).toEqual([
      'spetsvuz',
      'iktin',
      'ecom-tech',
    ]);
  });

  it('technologies unions cluster technologies across experiences without duplicates', () => {
    const input = validInput();
    const [ecom, iktin] = input.experiences;
    const withRustAndAxum = must(
      experience.create({
        ...buildExperience('spetsvuz', [2025, 12], 'present'),
        technologies: [
          must(technologyCluster.create({ technologies: ['Rust', 'Axum'], emphasis: 'lead' })),
        ],
      }),
    );
    const created = must(
      resume.create({ ...input, experiences: [ecom!, iktin!, withRustAndAxum] }),
    );

    const names = resume.technologies(created).map((tech) => tech.name);
    expect(names).toEqual(['Rust', 'Axum']);
  });
});
