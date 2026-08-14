import type { Brand } from './brand';
import { err, ok, type Result } from './result';

/** Phone number in E.164 format: '+' plus up to 15 digits, the first one not zero. */
export type PhoneNumber = Brand<string, 'PhoneNumber'>;

export interface InvalidPhone {
  readonly kind: 'InvalidPhone';
}

const INVALID: InvalidPhone = { kind: 'InvalidPhone' };

const E164_PATTERN = /^\+[1-9]\d{1,14}$/;

export const phoneNumber = {
  create(raw: string): Result<PhoneNumber, InvalidPhone> {
    return E164_PATTERN.test(raw) ? ok(raw as PhoneNumber) : err(INVALID);
  },
};
