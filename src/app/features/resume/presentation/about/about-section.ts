import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { translateSignal } from '@jsverse/transloco';

import type { HighlightTopic } from '../../domain/highlight/highlight';

import { ResumeStore } from '../../application/resume-store/resume-store';

import { LocaleService } from '../../../../shared/i18n/locale.service';
import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';

/** The Phosphor icon per highlight topic — the domain says what, UI picks how it looks. */
const TOPIC_ICON: Record<HighlightTopic, string> = {
  architecture: 'ph-blueprint',
  'open-source': 'ph-git-pull-request',
  collaboration: 'ph-users-three',
};

interface HighlightItem {
  readonly topic: HighlightTopic;
  readonly icon: string;
  readonly text: string;
}

/** About section: the candidate's highlights with an icon per topic. */
@Component({
  selector: 'app-about-section',
  templateUrl: './about-section.html',
  styleUrl: './about-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutSection {
  protected readonly store = inject(ResumeStore);
  private readonly localeService = inject(LocaleService);

  protected readonly kicker = translateSignal('nav.about');

  protected readonly highlights = computed<readonly HighlightItem[]>(
    () =>
      this.store.data()?.highlights.map((highlight) => ({
        topic: highlight.topic,
        icon: TOPIC_ICON[highlight.topic],
        text: this.pick(highlight.text),
      })) ?? [],
  );

  private pick(text: LocalizedText): string {
    return localizedText.pick(text, this.localeService.locale());
  }
}
