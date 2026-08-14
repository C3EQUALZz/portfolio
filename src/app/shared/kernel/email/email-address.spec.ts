import { describe, expect, it } from 'vitest';

import { emailAddress } from './email-address';

describe('EmailAddress', () => {
  it('принимает валидный адрес', () => {
    expect(emailAddress.create('danil.kovalev2016@gmail.com')).toEqual({
      ok: true,
      value: 'danil.kovalev2016@gmail.com',
    });
  });

  it.each(['без-собаки.example.com', '@нет-локали.com', 'два@@раза.com', 'пробелы в адресе', ''])(
    'отклоняет «%s»',
    (raw) => {
      expect(emailAddress.create(raw)).toEqual({ ok: false, error: { kind: 'InvalidEmail' } });
    },
  );
});
