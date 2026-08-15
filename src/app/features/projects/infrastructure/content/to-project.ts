import { project, type Project, type ProjectKind } from '../../domain/project/project';
import { topic } from '../../domain/topic/topic';

import { collect, err, type Result } from '../../../../shared/kernel/result/result';
import { slug } from '../../../../shared/kernel/slug/slug';
import { technology } from '../../../../shared/kernel/technology/technology';
import { httpsUrl } from '../../../../shared/kernel/url/https-url';

/** Raw content shape: plain strings and locale pairs, validated at the boundary. */
interface Lt {
  readonly en: string;
  readonly ru: string;
}

export interface ProjectDto {
  readonly id: string;
  readonly name: string;
  readonly tagline: Lt;
  readonly description: Lt;
  readonly repository: string;
  readonly language: string;
  readonly kind: ProjectKind;
  readonly topics: readonly Lt[];
}

interface InvalidProjectsContent {
  readonly kind: 'InvalidProjectsContent';
  /** Where the content broke, e.g. "projects[2].topics". */
  readonly path: string;
}

function invalid(path: string): Result<never, InvalidProjectsContent> {
  return err({ kind: 'InvalidProjectsContent', path });
}

type Parsed<T> = Result<T, InvalidProjectsContent>;

function parseProject(dto: ProjectDto, index: number): Parsed<Project> {
  const path = `projects[${index.toString()}]`;
  const id = slug.create(dto.id);
  const repository = httpsUrl.create(dto.repository);
  const language = technology.create(dto.language);
  if (!id.ok || !repository.ok || !language.ok) {
    return invalid(path);
  }
  const topics = collect(dto.topics.map((item) => topic.create(item)));
  if (!topics.ok) {
    return invalid(`${path}.topics`);
  }
  const created = project.create({
    id: id.value,
    name: dto.name,
    tagline: dto.tagline,
    description: dto.description,
    repository: repository.value,
    language: language.value,
    kind: dto.kind,
    topics: topics.value,
  });
  return created.ok ? created : invalid(`${path}.${created.error.kind}`);
}

/** Maps the raw content literal to validated Project aggregates. */
export function toProjects(dto: readonly ProjectDto[]): Parsed<readonly Project[]> {
  return collect(dto.map((item, index) => parseProject(item, index)));
}
