import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

import { showcasedProject } from '../../domain/showcased-project/showcased-project';

import { ProjectsStore } from '../../application/projects-store/projects-store';

import { LocaleService } from '../../../../core/i18n/locale.service';
import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';

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
  readonly kindKey: string;
  readonly topics: string;
  readonly icon: string;
  readonly stars: number | undefined;
}

/** Selected work: the open-source projects as a card grid. */
@Component({
  selector: 'app-projects-section',
  imports: [TranslocoPipe],
  templateUrl: './projects-section.html',
  styleUrl: './projects-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsSection {
  protected readonly store = inject(ProjectsStore);
  private readonly localeService = inject(LocaleService);

  protected readonly cards = computed<readonly ProjectCard[]>(
    () =>
      this.store.data()?.map((project) => {
        const showcased = showcasedProject.of(project);
        return {
          id: project.id,
          name: project.name,
          tagline: this.pick(project.tagline),
          description: this.pick(project.description),
          repository: project.repository,
          language: project.language.name,
          kindKey: `work.kind.${project.kind}`,
          topics: project.topics.map((topic) => this.pick(topic.label)).join(' · '),
          icon: PROJECT_ICON[project.id] ?? FALLBACK_ICON,
          stars: showcased.snapshot?.stars,
        };
      }) ?? [],
  );

  private pick(text: LocalizedText): string {
    return localizedText.pick(text, this.localeService.locale());
  }
}
