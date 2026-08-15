import { achievement } from '../../domain/achievement/achievement';
import { availability } from '../../domain/availability/availability';
import { company } from '../../domain/company/company';
import { credential, type Credential } from '../../domain/credential/credential';
import { education, type Education } from '../../domain/education/education';
import { type Engagement, experience, type Experience } from '../../domain/experience/experience';
import { highlight, type Highlight, type HighlightTopic } from '../../domain/highlight/highlight';
import {
  impact,
  type Impact,
  type ImpactDirection,
  type ImpactUnit,
} from '../../domain/impact/impact';
import {
  type LanguageLevel,
  languageSkill,
  type LanguageSkill,
} from '../../domain/language-skill/language-skill';
import { person } from '../../domain/person/person';
import { resume, type Resume } from '../../domain/resume/resume';
import { skillGroup, type SkillGroup } from '../../domain/skill-group/skill-group';
import { technologyCluster } from '../../domain/technology-cluster/technology-cluster';

import { collect, err, ok, type Result } from '../../../../shared/kernel/result/result';
import { slug } from '../../../../shared/kernel/slug/slug';
import { period, type Period } from '../../../../shared/kernel/time/period';
import { yearMonth } from '../../../../shared/kernel/time/year-month';

/** Raw content shape: plain strings and locale pairs, validated at the boundary. */
interface Lt {
  readonly en: string;
  readonly ru: string;
}

type YearMonthDto = readonly [number, number];

type ImpactDto =
  | {
      readonly label: Lt;
      readonly kind: 'numeric';
      readonly amount: number;
      readonly unit: ImpactUnit;
      readonly direction: ImpactDirection;
    }
  | { readonly label: Lt; readonly kind: 'literal'; readonly text: Lt };

interface ExperienceDto {
  readonly id: string;
  readonly start: YearMonthDto;
  readonly end: YearMonthDto | 'present';
  readonly position: Lt;
  readonly company: { readonly name: string; readonly site?: string };
  readonly product: Lt;
  readonly engagement: Engagement;
  readonly impacts: readonly ImpactDto[];
  readonly achievements: readonly { readonly lead: Lt; readonly detail: Lt }[];
  readonly technologies: readonly {
    readonly technologies: readonly string[];
    readonly emphasis: 'lead' | 'supporting';
  }[];
}

export interface ResumeContentDto {
  readonly person: {
    readonly name: string;
    readonly headline: Lt;
    readonly roleHeadlines: readonly Lt[];
    readonly summary: Lt;
  };
  readonly availability: {
    readonly status: 'open' | 'closed';
    readonly base: Lt;
    readonly relocatesTo: readonly Lt[];
    readonly employment: Lt;
  };
  readonly experiences: readonly ExperienceDto[];
  readonly skillGroups: readonly {
    readonly title: Lt;
    readonly entries: readonly {
      readonly technology: string;
      readonly emphasis: 'lead' | 'supporting';
    }[];
  }[];
  readonly highlights: readonly { readonly topic: HighlightTopic; readonly text: Lt }[];
  readonly education: readonly {
    readonly institution: Lt;
    readonly program: Lt;
    readonly city: Lt;
    readonly graduationYear: number;
  }[];
  readonly languages: readonly { readonly language: Lt; readonly level: LanguageLevel }[];
  readonly credentials: readonly {
    readonly title: Lt;
    readonly issuer?: Lt;
    readonly year?: number;
  }[];
}

interface InvalidResumeContent {
  readonly kind: 'InvalidResumeContent';
  /** Where the content broke, e.g. "experiences[2].period". */
  readonly path: string;
}

function invalid(path: string): Result<never, InvalidResumeContent> {
  return err({ kind: 'InvalidResumeContent', path });
}

type Parsed<T> = Result<T, InvalidResumeContent>;

/** Parses a list of raw entries, failing fast with an indexed path. */
function parseList<T, I>(
  items: readonly I[],
  path: string,
  parse: (item: I) => Result<T, unknown>,
): Parsed<readonly T[]> {
  return collect(
    items.map((item, index) => {
      const parsed = parse(item);
      return parsed.ok ? ok(parsed.value) : invalid(`${path}[${index.toString()}]`);
    }),
  );
}

function parseImpact(dto: ImpactDto): Result<Impact, unknown> {
  return dto.kind === 'numeric'
    ? impact.numeric({
        label: dto.label,
        amount: dto.amount,
        unit: dto.unit,
        direction: dto.direction,
      })
    : impact.literal({ label: dto.label, text: dto.text });
}

function parsePeriod(dto: ExperienceDto, path: string): Parsed<Period> {
  const start = yearMonth.create(dto.start[0], dto.start[1]);
  if (!start.ok) {
    return invalid(`${path}.period`);
  }
  if (dto.end === 'present') {
    const created = period.create(start.value, 'present');
    return created.ok ? created : invalid(`${path}.period`);
  }
  const end = yearMonth.create(dto.end[0], dto.end[1]);
  if (!end.ok) {
    return invalid(`${path}.period`);
  }
  const created = period.create(start.value, end.value);
  return created.ok ? created : invalid(`${path}.period`);
}

function parseExperience(dto: ExperienceDto, index: number): Parsed<Experience> {
  const path = `experiences[${index.toString()}]`;
  const id = slug.create(dto.id);
  if (!id.ok) {
    return invalid(path);
  }
  const parsedPeriod = parsePeriod(dto, path);
  if (!parsedPeriod.ok) {
    return parsedPeriod;
  }
  const parsedCompany = company.create(dto.company.name, dto.company.site);
  if (!parsedCompany.ok) {
    return invalid(path);
  }
  const impacts = parseList(dto.impacts, `${path}.impacts`, parseImpact);
  if (!impacts.ok) {
    return impacts;
  }
  const achievements = parseList(dto.achievements, `${path}.achievements`, (item) =>
    achievement.create(item),
  );
  if (!achievements.ok) {
    return achievements;
  }
  const technologies = parseList(dto.technologies, `${path}.technologies`, (cluster) =>
    technologyCluster.create(cluster),
  );
  if (!technologies.ok) {
    return technologies;
  }
  const created = experience.create({
    id: id.value,
    period: parsedPeriod.value,
    position: dto.position,
    company: parsedCompany.value,
    product: dto.product,
    engagement: dto.engagement,
    impacts: impacts.value,
    achievements: achievements.value,
    technologies: technologies.value,
  });
  return created.ok ? ok(created.value) : invalid(path);
}

interface ParsedCollections {
  readonly experiences: readonly Experience[];
  readonly skillGroups: readonly SkillGroup[];
  readonly highlights: readonly Highlight[];
  readonly education: readonly Education[];
  readonly languages: readonly LanguageSkill[];
  readonly credentials: readonly Credential[];
}

function parseCollections(dto: ResumeContentDto): Parsed<ParsedCollections> {
  const experiences = collect(dto.experiences.map((item, i) => parseExperience(item, i)));
  if (!experiences.ok) {
    return experiences;
  }
  const skillGroups = parseList(dto.skillGroups, 'skillGroups', (group) =>
    skillGroup.create(group),
  );
  if (!skillGroups.ok) {
    return skillGroups;
  }
  const highlights = parseList(dto.highlights, 'highlights', (item) => highlight.create(item));
  if (!highlights.ok) {
    return highlights;
  }
  const educationList = parseList(dto.education, 'education', (item) => education.create(item));
  if (!educationList.ok) {
    return educationList;
  }
  const languages = parseList(dto.languages, 'languages', (item) => languageSkill.create(item));
  if (!languages.ok) {
    return languages;
  }
  const credentials = parseList(dto.credentials, 'credentials', (item) => credential.create(item));
  if (!credentials.ok) {
    return credentials;
  }
  return ok({
    experiences: experiences.value,
    skillGroups: skillGroups.value,
    highlights: highlights.value,
    education: educationList.value,
    languages: languages.value,
    credentials: credentials.value,
  });
}

/** Maps the raw content literal to a validated Resume aggregate. */
export function toResume(dto: ResumeContentDto): Parsed<Resume> {
  const parsedPerson = person.create(dto.person);
  if (!parsedPerson.ok) {
    return invalid('person');
  }
  const parsedAvailability = availability.create(dto.availability);
  if (!parsedAvailability.ok) {
    return invalid('availability');
  }
  const collections = parseCollections(dto);
  if (!collections.ok) {
    return collections;
  }
  const created = resume.create({
    person: parsedPerson.value,
    availability: parsedAvailability.value,
    ...collections.value,
  });
  return created.ok ? created : invalid(`resume.${created.error.kind}`);
}
