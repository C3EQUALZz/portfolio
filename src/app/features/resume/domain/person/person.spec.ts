import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { person } from './person';

const INPUT = {
  name: 'Danil Kovalev',
  headline: { en: 'Backend engineer building', ru: 'Backend-инженер, который строит' },
  roleHeadlines: [
    { en: 'high-load Rust services', ru: 'высоконагруженные сервисы на Rust' },
    { en: 'distributed systems that hold', ru: 'распределённые системы, которые держат нагрузку' },
  ],
  summary: {
    en: 'Three and a half years across security tooling',
    ru: 'Три с половиной года в инструментах безопасности',
  },
};

describe('person', () => {
  it('creates a person with headline, rotating roles and summary', () => {
    const created = must(person.create(INPUT));

    expect(created.name).toBe('Danil Kovalev');
    expect(created.roleHeadlines).toHaveLength(2);
    expect(created.roleHeadlines[0]?.en).toBe('high-load Rust services');
  });

  it('rejects an empty name', () => {
    expect(person.create({ ...INPUT, name: '' })).toEqual({
      ok: false,
      error: { kind: 'InvalidPerson' },
    });
  });

  it('rejects an empty role list', () => {
    expect(person.create({ ...INPUT, roleHeadlines: [] })).toEqual({
      ok: false,
      error: { kind: 'InvalidPerson' },
    });
  });
});
