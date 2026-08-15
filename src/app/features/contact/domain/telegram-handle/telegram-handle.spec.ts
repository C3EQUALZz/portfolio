import { describe, expect, it } from 'vitest';

import { telegramHandle } from './telegram-handle';

describe('telegramHandle', () => {
  it('accepts a valid handle', () => {
    expect(telegramHandle.create('computerScienceEnjoyer')).toEqual({
      ok: true,
      value: 'computerScienceEnjoyer',
    });
  });

  it.each(['', 'ab', 'a'.repeat(33), '1starts-with-digit', 'with-dash', 'with space', '@with-at'])(
    'rejects «%s»',
    (raw) => {
      expect(telegramHandle.create(raw)).toEqual({
        ok: false,
        error: { kind: 'InvalidTelegramHandle' },
      });
    },
  );
});
