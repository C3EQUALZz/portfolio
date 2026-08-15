import { describe, expect, it } from 'vitest';

import { slug } from '../../../../shared/kernel/slug/slug';
import { technology } from '../../../../shared/kernel/technology/technology';
import { httpsUrl } from '../../../../shared/kernel/url/https-url';
import { must } from '../../../../shared/testing/must';
import { topic, type Topic } from '../topic/topic';
import { project, type ProjectInput } from './project';

const PYTHON = technology.create('Python');
const REPO = httpsUrl.create('https://github.com/C3EQUALZz/dishka-ag2');

function makeTopic(en: string, ru: string): Topic {
  return must(topic.create({ en, ru }));
}

function validInput(): ProjectInput {
  return {
    id: must(slug.create('dishka-ag2')),
    name: 'dishka-ag2',
    tagline: { en: 'Dependency injection for AG2', ru: 'DI для AG2' },
    description: {
      en: 'Container integration for AG2 multi-agent applications.',
      ru: 'Интеграция контейнера с мультиагентными приложениями AG2.',
    },
    repository: must(REPO),
    language: must(PYTHON),
    kind: 'library',
    topics: [makeTopic('DI', 'DI'), makeTopic('Agents', 'Агенты')],
  };
}

describe('project.create invariants', () => {
  it('creates a valid project', () => {
    expect(project.create(validInput())).toMatchObject({ ok: true });
  });

  it('derives the expected id from the name, case-insensitively', () => {
    expect(project.create({ ...validInput(), name: 'Dishka AG2' })).toMatchObject({ ok: true });
  });

  it('rejects an id that does not match the name', () => {
    expect(project.create({ ...validInput(), id: must(slug.create('dishka-airflow')) })).toEqual({
      ok: false,
      error: { kind: 'IdNameMismatch' },
    });
  });

  it('allows exactly one topic', () => {
    const input = validInput();

    expect(project.create({ ...input, topics: [input.topics[0]!] })).toMatchObject({ ok: true });
  });

  it('allows exactly four topics', () => {
    const topics = [
      makeTopic('DI', 'DI'),
      makeTopic('Agents', 'Агенты'),
      makeTopic('Pipelines', 'Пайплайны'),
      makeTopic('Workers', 'Воркеры'),
    ];

    expect(project.create({ ...validInput(), topics })).toMatchObject({ ok: true });
  });

  it('rejects a project without topics', () => {
    expect(project.create({ ...validInput(), topics: [] })).toEqual({
      ok: false,
      error: { kind: 'TopicsCount' },
    });
  });

  it('rejects more than four topics', () => {
    const topics = [
      makeTopic('DI', 'DI'),
      makeTopic('Agents', 'Агенты'),
      makeTopic('Pipelines', 'Пайплайны'),
      makeTopic('Workers', 'Воркеры'),
      makeTopic('UI', 'UI'),
    ];

    expect(project.create({ ...validInput(), topics })).toEqual({
      ok: false,
      error: { kind: 'TopicsCount' },
    });
  });

  it('rejects empty tagline or description', () => {
    expect(project.create({ ...validInput(), tagline: { en: '', ru: 'DI для AG2' } })).toEqual({
      ok: false,
      error: { kind: 'InvalidText' },
    });
    expect(project.create({ ...validInput(), description: { en: 'Text', ru: ' ' } })).toEqual({
      ok: false,
      error: { kind: 'InvalidText' },
    });
  });
});
