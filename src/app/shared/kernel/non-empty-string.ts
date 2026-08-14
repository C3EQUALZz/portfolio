import type { Brand } from './brand';
import { err, ok, type Result } from './result';

/** A string guaranteed to contain at least one non-whitespace character. */
export type NonEmptyString = Brand<string, 'NonEmptyString'>;

export interface EmptyString {
  readonly kind: 'EmptyString';
}

const EMPTY: EmptyString = { kind: 'EmptyString' };

export const nonEmptyString = {
  create(raw: string): Result<NonEmptyString, EmptyString> {
    return raw.trim() === '' ? err(EMPTY) : ok(raw as NonEmptyString);
  },
};
