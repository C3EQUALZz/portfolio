import { describe, expect, it } from 'vitest';

import { phoneNumber } from './phone-number';

describe('PhoneNumber', () => {
  it('принимает номер в E.164', () => {
    expect(phoneNumber.create('+79001234567')).toEqual({ ok: true, value: '+79001234567' });
  });

  it.each(['89001234567', '+0 900 123-45-67', '+', 'позвони мне', ''])('отклоняет «%s»', (raw) => {
    expect(phoneNumber.create(raw)).toEqual({ ok: false, error: { kind: 'InvalidPhone' } });
  });
});
