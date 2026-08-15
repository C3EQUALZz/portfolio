import type { Brand } from '../brand/brand';
import { err, ok, type Result } from '../result/result';

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

  /**
   * Derives a slug from a display name: lowercases it and replaces every run
   * of non-alphanumerics with a single dash, then validates the result.
   */
  derive(name: string): Result<Slug, InvalidSlug> {
    const normalized = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return slug.create(normalized);
  },
};
