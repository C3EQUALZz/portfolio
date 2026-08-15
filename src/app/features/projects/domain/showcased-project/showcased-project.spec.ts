import { describe, expect, it } from 'vitest';

import { slug } from '../../../../shared/kernel/slug/slug';
import { technology } from '../../../../shared/kernel/technology/technology';
import { httpsUrl } from '../../../../shared/kernel/url/https-url';
import { must } from '../../../../shared/testing/must';
import { project } from '../project/project';
import { repositorySnapshot } from '../repository-snapshot/repository-snapshot';
import { topic } from '../topic/topic';
import { showcasedProject } from './showcased-project';

const PYTHON = must(technology.create('Python'));

const DISHKA_AG2 = must(
  project.create({
    id: must(slug.create('dishka-ag2')),
    name: 'dishka-ag2',
    tagline: { en: 'Dependency injection for AG2', ru: 'DI для AG2' },
    description: {
      en: 'Container integration for AG2 multi-agent applications.',
      ru: 'Интеграция контейнера с мультиагентными приложениями AG2.',
    },
    repository: must(httpsUrl.create('https://github.com/C3EQUALZz/dishka-ag2')),
    language: PYTHON,
    kind: 'library',
    topics: [must(topic.create({ en: 'DI', ru: 'DI' }))],
  }),
);

describe('showcasedProject', () => {
  it('showcases a project without a snapshot — absence is normal, not an error', () => {
    const showcased = showcasedProject.of(DISHKA_AG2);

    expect(showcased.project).toBe(DISHKA_AG2);
    expect(showcased.snapshot).toBeUndefined();
  });

  it('showcases a project with its repository snapshot', () => {
    const snapshot = must(
      repositorySnapshot.create({
        stars: 42,
        language: PYTHON,
        lastCommitAt: new Date('2026-08-01T00:00:00Z'),
      }),
    );

    const showcased = showcasedProject.of(DISHKA_AG2, snapshot);

    expect(showcased.snapshot).toBe(snapshot);
  });
});
