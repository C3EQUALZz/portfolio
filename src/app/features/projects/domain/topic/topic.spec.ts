import { describe, expect, it } from 'vitest';

import { topic } from './topic';

describe('topic', () => {
  it('creates a topic from a localized label', () => {
    expect(topic.create({ en: 'Data pipelines', ru: 'Пайплайны данных' })).toEqual({
      ok: true,
      value: { label: { en: 'Data pipelines', ru: 'Пайплайны данных' } },
    });
  });

  it.each([
    { en: '', ru: 'Пайплайны данных' },
    { en: 'Data pipelines', ru: '  ' },
  ])('rejects a topic with an empty locale: %j', (label) => {
    expect(topic.create(label)).toEqual({ ok: false, error: { kind: 'InvalidTopic' } });
  });
});
