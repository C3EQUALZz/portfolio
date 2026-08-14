import type { Brand } from './brand';
import { err, ok, type Result } from './result';

/** Kebab-case identifier: `^[a-z0-9]+(-[a-z0-9]+)*$`. */
export type Slug = Brand<string, 'Slug'>;

export interface InvalidSlug {
  readonly kind: 'InvalidSlug';
}

const INVALID: InvalidSlug = { kind: 'InvalidSlug' };

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const slug = {
  create(raw: string): Result<Slug, InvalidSlug> {
    return SLUG_PATTERN.test(raw) ? ok(raw as Slug) : err(INVALID);
  },
};
