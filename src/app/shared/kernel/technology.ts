import { nonEmptyString, type NonEmptyString } from './non-empty-string';
import { ok, type Result } from './result';
import { slug, type Slug } from './slug';

/**
 * A named tool, language or service. One spelling per document:
 * "PostgreSQL", not "Postgres" and not "postgresql" — the slug is derived
 * from the name, never set separately.
 */
export interface Technology {
  readonly name: NonEmptyString;
  readonly slug: Slug;
}

export interface InvalidTechnology {
  readonly kind: 'InvalidTechnology';
}

const INVALID: InvalidTechnology = { kind: 'InvalidTechnology' };

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const technology = {
  create(name: string): Result<Technology, InvalidTechnology> {
    const validName = nonEmptyString.create(name);
    if (!validName.ok) {
      return { ok: false, error: INVALID };
    }
    const parsedSlug = slug.create(toSlug(validName.value));
    return parsedSlug.ok
      ? ok({ name: validName.value, slug: parsedSlug.value })
      : { ok: false, error: INVALID };
  },
};
