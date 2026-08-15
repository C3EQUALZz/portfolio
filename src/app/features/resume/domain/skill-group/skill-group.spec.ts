import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { skillGroup } from './skill-group';

const TITLE = { en: 'Data & transport', ru: 'Данные и транспорт' };

describe('skillGroup', () => {
  it('creates a titled group of technologies with emphasis per entry', () => {
    const created = must(
      skillGroup.create({
        title: TITLE,
        entries: [
          { technology: 'PostgreSQL', emphasis: 'lead' },
          { technology: 'Redis', emphasis: 'lead' },
          { technology: 'NATS', emphasis: 'supporting' },
        ],
      }),
    );

    expect(created.title.en).toBe('Data & transport');
    expect(created.entries.map((entry) => entry.technology.name)).toEqual([
      'PostgreSQL',
      'Redis',
      'NATS',
    ]);
    expect(created.entries[2]?.emphasis).toBe('supporting');
  });

  it('rejects an empty group', () => {
    expect(skillGroup.create({ title: TITLE, entries: [] })).toEqual({
      ok: false,
      error: { kind: 'InvalidSkillGroup' },
    });
  });

  it('rejects repeated technologies inside one group', () => {
    expect(
      skillGroup.create({
        title: TITLE,
        entries: [
          { technology: 'PostgreSQL', emphasis: 'lead' },
          { technology: 'postgresql', emphasis: 'supporting' },
        ],
      }),
    ).toEqual({ ok: false, error: { kind: 'InvalidSkillGroup' } });
  });

  it('rejects an unknown technology name', () => {
    expect(
      skillGroup.create({ title: TITLE, entries: [{ technology: '', emphasis: 'lead' }] }),
    ).toEqual({ ok: false, error: { kind: 'InvalidSkillGroup' } });
  });
});
