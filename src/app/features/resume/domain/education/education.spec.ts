import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { education } from './education';

const INPUT = {
  institution: {
    en: 'Don State Technical University',
    ru: 'Донской государственный технический университет',
  },
  program: { en: 'Computer Security', ru: 'Компьютерная безопасность' },
  city: { en: 'Rostov-on-Don', ru: 'Ростов-на-Дону' },
  graduationYear: 2028,
};

describe('education', () => {
  it('creates an education entry', () => {
    const created = must(education.create(INPUT));

    expect(created.institution.en).toBe('Don State Technical University');
    expect(created.graduationYear).toBe(2028);
  });

  it('rejects an empty institution', () => {
    expect(education.create({ ...INPUT, institution: { en: '', ru: '' } })).toEqual({
      ok: false,
      error: { kind: 'InvalidEducation' },
    });
  });
});
