import { describe, expect, it } from 'vitest';

import { slug } from '../../../../shared/kernel/slug/slug';
import { period } from '../../../../shared/kernel/time/period';
import { yearMonth, type YearMonth } from '../../../../shared/kernel/time/year-month';
import { must } from '../../../../shared/testing/must';
import { achievement } from '../achievement/achievement';
import { company } from '../company/company';
import { impact } from '../impact/impact';
import { technologyCluster } from '../technology-cluster/technology-cluster';
import { experience, type ExperienceInput } from './experience';

function ym(year: number, month: number): YearMonth {
  return must(yearMonth.create(year, month));
}

function validInput(): ExperienceInput {
  return {
    id: must(slug.create('iktin')),
    period: must(period.create(ym(2025, 6), ym(2025, 12))),
    position: { en: 'Backend Developer', ru: 'Backend-разработчик' },
    company: must(company.create('Iktin Group')),
    product: { en: 'An AI assistant for CDEK franchisees', ru: 'AI-ассистент для франчайзи СДЭК' },
    engagement: 'remote',
    impacts: [
      must(
        impact.numeric({
          label: { en: 'Manager load', ru: 'Нагрузка на менеджеров' },
          amount: 40,
          unit: 'percent',
          direction: 'decrease',
        }),
      ),
    ],
    achievements: [
      must(
        achievement.create({
          lead: {
            en: 'Designed the RAG answering system',
            ru: 'Спроектировал RAG-систему ответов',
          },
          detail: { en: 'manager load fell 40%', ru: 'нагрузка на менеджеров упала на 40%' },
        }),
      ),
    ],
    technologies: [
      must(technologyCluster.create({ technologies: ['Python 3.12'], emphasis: 'lead' })),
    ],
  };
}

describe('experience.create', () => {
  it('creates a valid experience', () => {
    const created = must(experience.create(validInput()));

    expect(created.company.name).toBe('Iktin Group');
    expect(created.engagement).toBe('remote');
  });

  it('rejects an experience without achievements', () => {
    expect(experience.create({ ...validInput(), achievements: [] })).toEqual({
      ok: false,
      error: { kind: 'InvalidExperience' },
    });
  });

  it('rejects an experience without technologies', () => {
    expect(experience.create({ ...validInput(), technologies: [] })).toEqual({
      ok: false,
      error: { kind: 'InvalidExperience' },
    });
  });

  it('rejects duplicated impact labels', () => {
    const input = validInput();
    const duplicated = must(
      impact.literal({
        label: { en: 'Manager load', ru: 'Другая формулировка' },
        text: { en: 'voice', ru: 'голосом' },
      }),
    );

    expect(experience.create({ ...input, impacts: [...input.impacts, duplicated] })).toEqual({
      ok: false,
      error: { kind: 'InvalidExperience' },
    });
  });
});

describe('experience queries', () => {
  it('duration delegates to the period with inclusive counting', () => {
    const created = must(experience.create(validInput()));

    expect(experience.duration(created, ym(2026, 8))).toBe(7);
  });

  it('isOngoing reflects an open period', () => {
    const finished = must(experience.create(validInput()));
    const ongoing = must(
      experience.create({ ...validInput(), period: must(period.create(ym(2025, 12), 'present')) }),
    );

    expect(experience.isOngoing(finished)).toBe(false);
    expect(experience.isOngoing(ongoing)).toBe(true);
  });
});
