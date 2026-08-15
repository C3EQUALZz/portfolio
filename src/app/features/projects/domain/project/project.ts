import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import {
  nonEmptyString,
  type NonEmptyString,
} from '../../../../shared/kernel/non-empty-string/non-empty-string';
import { err, ok, type Result } from '../../../../shared/kernel/result/result';
import { slug, type Slug } from '../../../../shared/kernel/slug/slug';
import type { Technology } from '../../../../shared/kernel/technology/technology';
import type { HttpsUrl } from '../../../../shared/kernel/url/https-url';
import type { Topic } from '../topic/topic';

/** What kind of artifact the project is. See CONTEXT.md. */
export type ProjectKind = 'library' | 'application' | 'tool';

/**
 * A published open-source library — the part the candidate writes: name,
 * tagline, description, kind, topics. Always created whole: one to four
 * topics, and the id is derived from the name, never set separately.
 * See CONTEXT.md.
 */
export interface Project {
  readonly id: Slug;
  readonly name: NonEmptyString;
  readonly tagline: LocalizedText;
  readonly description: LocalizedText;
  readonly repository: HttpsUrl;
  readonly language: Technology;
  readonly kind: ProjectKind;
  readonly topics: readonly Topic[];
}

export interface ProjectInput {
  readonly id: Slug;
  readonly name: string;
  readonly tagline: { readonly en: string; readonly ru: string };
  readonly description: { readonly en: string; readonly ru: string };
  readonly repository: HttpsUrl;
  readonly language: Technology;
  readonly kind: ProjectKind;
  readonly topics: readonly Topic[];
}

export interface ProjectError {
  readonly kind: 'IdNameMismatch' | 'TopicsCount' | 'InvalidText';
}

function failure(kind: ProjectError['kind']): Result<never, ProjectError> {
  return err({ kind });
}

const MIN_TOPICS = 1;
const MAX_TOPICS = 4;

function parseTexts(
  input: ProjectInput,
): Result<
  { name: NonEmptyString; tagline: LocalizedText; description: LocalizedText },
  ProjectError
> {
  const name = nonEmptyString.create(input.name);
  const tagline = localizedText.create(input.tagline);
  const description = localizedText.create(input.description);
  if (!name.ok || !tagline.ok || !description.ok) {
    return failure('InvalidText');
  }
  return ok({ name: name.value, tagline: tagline.value, description: description.value });
}

function idMismatch(id: Slug, name: NonEmptyString): ProjectError | undefined {
  const expectedId = slug.derive(name);
  return !expectedId.ok || expectedId.value !== id ? { kind: 'IdNameMismatch' } : undefined;
}

function topicsOutOfRange(topics: readonly Topic[]): ProjectError | undefined {
  return topics.length < MIN_TOPICS || topics.length > MAX_TOPICS
    ? { kind: 'TopicsCount' }
    : undefined;
}

export const project = {
  create(input: ProjectInput): Result<Project, ProjectError> {
    const texts = parseTexts(input);
    if (!texts.ok) {
      return texts;
    }
    const violation = idMismatch(input.id, texts.value.name) ?? topicsOutOfRange(input.topics);
    if (violation !== undefined) {
      return err(violation);
    }
    return ok({
      id: input.id,
      name: texts.value.name,
      tagline: texts.value.tagline,
      description: texts.value.description,
      repository: input.repository,
      language: input.language,
      kind: input.kind,
      topics: input.topics,
    });
  },
};
