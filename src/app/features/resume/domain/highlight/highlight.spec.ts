import { describe, expect, it } from 'vitest';

import { must } from '../../../../shared/testing/must';
import { highlight } from './highlight';

describe('highlight', () => {
  it('creates a highlight with a typed topic and text', () => {
    const created = must(
      highlight.create({
        topic: 'open-source',
        text: { en: 'I maintain dishka integrations', ru: 'Я поддерживаю интеграции dishka' },
      }),
    );

    expect(created.topic).toBe('open-source');
    expect(created.text.en).toBe('I maintain dishka integrations');
  });

  it('rejects an empty text', () => {
    expect(highlight.create({ topic: 'architecture', text: { en: '', ru: '' } })).toEqual({
      ok: false,
      error: { kind: 'InvalidHighlight' },
    });
  });
});
