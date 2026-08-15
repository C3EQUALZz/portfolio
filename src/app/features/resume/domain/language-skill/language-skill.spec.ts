import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { languageSkill } from './language-skill';

describe('languageSkill', () => {
  it('creates a language skill with a CEFR level or native', () => {
    const native = must(
      languageSkill.create({ language: { en: 'Russian', ru: 'Русский' }, level: 'native' }),
    );
    const b2 = must(
      languageSkill.create({ language: { en: 'English', ru: 'Английский' }, level: 'b2' }),
    );

    expect(native.level).toBe('native');
    expect(b2.language.en).toBe('English');
  });

  it('rejects an empty language name', () => {
    expect(languageSkill.create({ language: { en: '', ru: '' }, level: 'c1' })).toEqual({
      ok: false,
      error: { kind: 'InvalidLanguageSkill' },
    });
  });
});
