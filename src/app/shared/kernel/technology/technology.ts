import { nonEmptyString, type NonEmptyString } from '../non-empty-string/non-empty-string';
import { ok, type Result } from '../result/result';
import { slug, type Slug } from '../slug/slug';

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

export const technology = {
  create(name: string): Result<Technology, InvalidTechnology> {
    const validName = nonEmptyString.create(name);
    if (!validName.ok) {
      return { ok: false, error: INVALID };
    }
    const parsedSlug = slug.derive(validName.value);
    return parsedSlug.ok
      ? ok({ name: validName.value, slug: parsedSlug.value })
      : { ok: false, error: INVALID };
  },
};
