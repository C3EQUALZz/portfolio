import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideProjectsFeature } from '../../..';
import { ListProjectsHandler, type ProjectListItem } from './list-projects';

async function loadItems(): Promise<readonly ProjectListItem[] | undefined> {
  const handler = TestBed.inject(ListProjectsHandler);
  const items = handler.handle({ kind: 'listProjects' });
  await TestBed.inject(ApplicationRef).whenStable();
  return items();
}

describe('ListProjectsHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideProjectsFeature()] });
  });

  it('lists the projects in the content order, no test doubles', async () => {
    const items = await loadItems();

    expect(items?.map((item) => item.project.id)).toEqual([
      'faststream-celery',
      'jobify-db',
      'dishka-ag2',
      'dishka-airflow',
      'dishka-jobify',
      'dishka-flet',
    ]);
  });

  it('carries the full project, not a projection', async () => {
    const items = await loadItems();

    expect(items?.[0]?.project.tagline.en).toContain('Celery');
    expect(items?.[0]?.project.repository).toBe('https://github.com/C3EQUALZz/faststream-celery');
  });

  it('pairs each project with its snapshot — none today, and that is a normal state', async () => {
    const items = await loadItems();

    expect(items?.every((item) => 'snapshot' in item)).toBe(true);
    expect(items?.every((item) => item.snapshot === undefined)).toBe(true);
  });
});
