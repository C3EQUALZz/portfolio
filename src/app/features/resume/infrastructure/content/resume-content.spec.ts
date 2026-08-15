import { describe, expect, it } from 'vitest';

import { resume } from '../../domain/resume/resume';

import { yearMonth } from '../../../../shared/kernel/time/year-month';
import { must, mustFail } from '../../../../shared/testing/must';
import { resumeContent } from './resume-content';
import { type ResumeContentDto, toResume } from './to-resume';

const HERO_RING_LIMIT = 18;

describe('resumeContent', () => {
  it('parses into a valid Resume without errors', () => {
    const parsed = toResume(resumeContent);

    expect(parsed.ok).toBe(true);
  });

  it('derives the total experience from the dates: 43 months at Aug 2026', () => {
    const parsed = must(toResume(resumeContent));

    expect(resume.totalExperience(parsed, must(yearMonth.create(2026, 8)))).toEqual({
      years: 3,
      months: 7,
    });
  });

  it('keeps lead technologies within the hero ring limit', () => {
    const parsed = must(toResume(resumeContent));
    const leadCount = parsed.skillGroups.reduce(
      (total, group) => total + group.entries.filter((entry) => entry.emphasis === 'lead').length,
      0,
    );

    expect(leadCount).toBeLessThanOrEqual(HERO_RING_LIMIT);
  });

  it('reports a readable path when the content is broken', () => {
    const broken: ResumeContentDto = {
      ...resumeContent,
      experiences: resumeContent.experiences.map((item, index) =>
        index === 0 ? { ...item, end: [2020, 1] as const } : item,
      ),
    };

    const error = mustFail(toResume(broken));

    expect(error.kind).toBe('InvalidResumeContent');
    expect(error.path).toContain('experiences[0]');
  });

  it.each([
    [
      'person',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        person: { ...dto.person, name: '' },
      }),
    ],
    [
      'availability',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        availability: { ...dto.availability, base: { en: '', ru: '' } },
      }),
    ],
    [
      'experiences[0] (bad id)',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        experiences: dto.experiences.map((item, i) => (i === 0 ? { ...item, id: 'Bad ID' } : item)),
      }),
    ],
    [
      'experiences[0].period (bad end month)',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        experiences: dto.experiences.map((item, i) =>
          i === 0 ? { ...item, end: [2025, 13] as const } : item,
        ),
      }),
    ],
    [
      'experiences[0] (bad company site)',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        experiences: dto.experiences.map((item, i) =>
          i === 0 ? { ...item, company: { name: 'X', site: 'http://insecure' } } : item,
        ),
      }),
    ],
    [
      'experiences[0].impacts[0]',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        experiences: dto.experiences.map((item, i) =>
          i === 0
            ? {
                ...item,
                impacts: item.impacts.map((impactDto, j) =>
                  j === 0 ? { ...impactDto, label: { en: '', ru: '' } } : impactDto,
                ),
              }
            : item,
        ),
      }),
    ],
    [
      'experiences[0].achievements[0]',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        experiences: dto.experiences.map((item, i) =>
          i === 0
            ? {
                ...item,
                achievements: item.achievements.map((a, j) =>
                  j === 0 ? { ...a, lead: { en: '', ru: '' } } : a,
                ),
              }
            : item,
        ),
      }),
    ],
    [
      'experiences[0].technologies[0]',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        experiences: dto.experiences.map((item, i) =>
          i === 0
            ? {
                ...item,
                technologies: item.technologies.map((cluster, j) =>
                  j === 0 ? { ...cluster, technologies: [''] } : cluster,
                ),
              }
            : item,
        ),
      }),
    ],
    [
      'experiences[0] (no achievements)',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        experiences: dto.experiences.map((item, i) =>
          i === 0 ? { ...item, achievements: [] } : item,
        ),
      }),
    ],
    [
      'experiences[0] (empty position)',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        experiences: dto.experiences.map((item, i) =>
          i === 0 ? { ...item, position: { en: '', ru: '' } } : item,
        ),
      }),
    ],
    [
      'skillGroups[0]',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        skillGroups: dto.skillGroups.map((group, i) =>
          i === 0 ? { ...group, entries: [{ technology: '', emphasis: 'lead' as const }] } : group,
        ),
      }),
    ],
    [
      'highlights[0]',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        highlights: dto.highlights.map((item, i) =>
          i === 0 ? { ...item, text: { en: '', ru: '' } } : item,
        ),
      }),
    ],
    [
      'education[0]',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        education: dto.education.map((item, i) =>
          i === 0 ? { ...item, institution: { en: '', ru: '' } } : item,
        ),
      }),
    ],
    [
      'languages[0]',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        languages: dto.languages.map((item, i) =>
          i === 0 ? { ...item, language: { en: '', ru: '' } } : item,
        ),
      }),
    ],
    [
      'credentials[0]',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        credentials: dto.credentials.map((item, i) =>
          i === 0 ? { ...item, title: { en: '', ru: '' } } : item,
        ),
      }),
    ],
    [
      'resume.NativeLanguageCount',
      (dto: ResumeContentDto): ResumeContentDto => ({
        ...dto,
        languages: dto.languages.map((item) => ({ ...item, level: 'c2' as const })),
      }),
    ],
  ])('fails with a path at %s', (expectedPath, tamper) => {
    const error = mustFail(toResume(tamper(resumeContent)));

    expect(error.path).toContain(expectedPath.split(' ')[0]);
  });
});
