import type { Brand } from './brand';
import { err, ok, type Result } from './result';

/** Email address — the employer contact channel. */
export type EmailAddress = Brand<string, 'EmailAddress'>;

export interface InvalidEmail {
  readonly kind: 'InvalidEmail';
}

const INVALID: InvalidEmail = { kind: 'InvalidEmail' };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailAddress = {
  create(raw: string): Result<EmailAddress, InvalidEmail> {
    return EMAIL_PATTERN.test(raw) ? ok(raw as EmailAddress) : err(INVALID);
  },
};
