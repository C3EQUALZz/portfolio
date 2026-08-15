import { describe, expect, it } from 'vitest';

import { showcasedProject } from '../../domain/showcased-project/showcased-project';

import { projectsContent } from './projects-content';
import { toProjects } from './to-project';

describe('projectsContent', () => {
  it('parses without errors', () => {
    expect(toProjects(projectsContent)).toMatchObject({ ok: true });
  });

  it('contains the four dishka integrations, all Python libraries', () => {
    const parsed = toProjects(projectsContent);
    if (!parsed.ok) {
      throw new Error('content must parse');
    }

    expect(parsed.value.map((item) => item.id)).toEqual([
      'dishka-ag2',
      'dishka-airflow',
      'dishka-jobify',
      'dishka-flet',
    ]);
    for (const item of parsed.value) {
      expect(item.kind).toBe('library');
      expect(item.language.slug).toBe('python');
    }
  });

  it('reports the breaking path when content is invalid', () => {
    const broken = [{ ...projectsContent[0]!, topics: [] }];

    expect(toProjects(broken)).toEqual({
      ok: false,
      error: { kind: 'InvalidProjectsContent', path: 'projects[0].TopicsCount' },
    });
  });

  it('every project showcases without a repository snapshot — a normal state', () => {
    const parsed = toProjects(projectsContent);
    if (!parsed.ok) {
      throw new Error('content must parse');
    }

    for (const item of parsed.value) {
      expect(showcasedProject.of(item).snapshot).toBeUndefined();
    }
  });
});
