import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { achievement } from './achievement';

const LEAD = { en: 'Rebuilt the DAST architecture', ru: 'Перестроил архитектуру DAST' };
const DETAIL = { en: 'moved the pipeline to async Rust', ru: 'перенёс конвейер на async Rust' };

describe('achievement', () => {
  it('creates an achievement with a lead and a detail', () => {
    const created = must(achievement.create({ lead: LEAD, detail: DETAIL }));

    expect(created.lead.en).toBe('Rebuilt the DAST architecture');
    expect(created.detail.ru).toBe('перенёс конвейер на async Rust');
  });

  it('rejects an empty lead', () => {
    expect(achievement.create({ lead: { en: '', ru: 'x' }, detail: DETAIL })).toEqual({
      ok: false,
      error: { kind: 'InvalidAchievement' },
    });
  });

  it('rejects an empty detail', () => {
    expect(achievement.create({ lead: LEAD, detail: { en: 'x', ru: '' } })).toEqual({
      ok: false,
      error: { kind: 'InvalidAchievement' },
    });
  });
});
