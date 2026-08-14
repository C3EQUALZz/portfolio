import { describe, expect, it } from 'vitest';

import { httpsUrl } from './https-url';

describe('HttpsUrl', () => {
  it('принимает валидный https-адрес', () => {
    expect(httpsUrl.create('https://github.com/C3EQUALZz/dishka')).toEqual({
      ok: true,
      value: 'https://github.com/C3EQUALZz/dishka',
    });
  });

  it.each(['http://github.com/insecure', 'ftp://files.example.com', 'не ссылка', ''])(
    'отклоняет «%s»',
    (raw) => {
      expect(httpsUrl.create(raw)).toEqual({ ok: false, error: { kind: 'InvalidUrl' } });
    },
  );
});
