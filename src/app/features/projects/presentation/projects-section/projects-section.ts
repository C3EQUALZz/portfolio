import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { translateSignal, TranslocoService } from '@jsverse/transloco';

import { ListProjectsHandler } from '../../application/queries/list-projects/list-projects';

import { LocaleService } from '../../../../shared/i18n/locale.service';

/** The Phosphor icon per project — presentational, keyed by slug. */
const PROJECT_ICON: Record<string, string> = {
  'dishka-ag2': 'ph-robot',
  'dishka-airflow': 'ph-git-fork',
  'dishka-jobify': 'ph-queue',
  'dishka-flet': 'ph-app-window',
};

const FALLBACK_ICON = 'ph-package';

interface ProjectCard {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly repository: string;
  readonly language: string;
  readonly kindText: string;
  readonly topics: string;
  readonly icon: string;
  readonly stars: number | undefined;
}

/** Selected work: the open-source projects as a card grid. */
@Component({
  selector: 'app-projects-section',
  templateUrl: './projects-section.html',
  styleUrl: './projects-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsSection {
  private readonly listProjects = inject(ListProjectsHandler);
  private readonly localeService = inject(LocaleService);
  private readonly transloco = inject(TranslocoService);

  protected readonly kicker = translateSignal('nav.work');
  protected readonly title = translateSignal('work.title');
  protected readonly subtitlePre = translateSignal('work.subtitlePre');
  protected readonly subtitlePost = translateSignal('work.subtitlePost');

  private readonly items = this.listProjects.handle({ kind: 'listProjects' });

  protected readonly cards = computed<readonly ProjectCard[]>(
    () =>
      this.items()?.map(({ project, snapshot }) => {
        return {
          id: project.id,
          name: project.name,
          tagline: this.localeService.pick(project.tagline),
          description: this.localeService.pick(project.description),
          repository: project.repository,
          language: project.language.name,
          kindText: this.transloco.translate(`work.kind.${project.kind}`),
          topics: project.topics.map((topic) => this.localeService.pick(topic.label)).join(' · '),
          icon: PROJECT_ICON[project.id] ?? FALLBACK_ICON,
          stars: snapshot?.stars,
        };
      }) ?? [],
  );
}
