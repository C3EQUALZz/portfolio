import { computed, inject, Injectable, type Signal } from '@angular/core';

import type { Project } from '../../../domain/project/project';
import type { RepositorySnapshot } from '../../../domain/repository-snapshot/repository-snapshot';
import { showcasedProject } from '../../../domain/showcased-project/showcased-project';

import type { Query, QueryHandler } from '../../../../../shared/cqs/query/query';
import { ProjectsStore } from '../../projects-store/projects-store';

/** The query: list all projects for the work section. */
export interface ListProjectsQuery extends Query {
  readonly kind: 'listProjects';
}

/**
 * One row of the work section: the project itself, plus its repository
 * snapshot when there is one. No locale, no formatting — the UI picks and
 * formats; this DTO carries domain semantics only.
 */
export interface ProjectListItem {
  readonly project: Project;
  readonly snapshot: RepositorySnapshot | undefined;
}

/**
 * Lists the projects with their repository snapshots. Reads the feature
 * state; the pairing rule itself is the domain query showcasedProject.of.
 */
@Injectable({ providedIn: 'root' })
export class ListProjectsHandler implements QueryHandler<
  ListProjectsQuery,
  readonly ProjectListItem[] | undefined
> {
  private readonly store = inject(ProjectsStore);

  handle(_query: ListProjectsQuery): Signal<readonly ProjectListItem[] | undefined> {
    return computed(() =>
      this.store.data()?.map((project) => {
        const showcased = showcasedProject.of(project);
        return { project: showcased.project, snapshot: showcased.snapshot };
      }),
    );
  }
}
