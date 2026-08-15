import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideProjectsFeature } from '../..';
import { ProjectsStore } from './projects-store';

describe('ProjectsStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideProjectsFeature()] });
  });

  it('lists the projects through the wired adapter, no test doubles', async () => {
    const store = TestBed.inject(ProjectsStore);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(store.isLoading()).toBe(false);
    expect(store.data()?.map((project) => project.id)).toEqual([
      'dishka-ag2',
      'dishka-airflow',
      'dishka-jobify',
      'dishka-flet',
    ]);
  });
});
