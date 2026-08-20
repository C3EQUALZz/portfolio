import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { translateSignal } from '@jsverse/transloco';

import { ResumeStore } from '../../application/resume-store/resume-store';

import { LocaleService } from '../../../../shared/i18n/locale.service';
import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';

interface StackEntry {
  readonly name: string;
  readonly lead: boolean;
}

interface StackGroupCard {
  readonly title: string;
  readonly entries: readonly StackEntry[];
}

/** Stack section: skill groups, lead picks visually accented. */
@Component({
  selector: 'app-stack-section',
  templateUrl: './stack-section.html',
  styleUrl: './stack-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackSection {
  protected readonly store = inject(ResumeStore);
  private readonly localeService = inject(LocaleService);

  protected readonly kicker = translateSignal('nav.stack');
  protected readonly title = translateSignal('stack.title');

  protected readonly groups = computed<readonly StackGroupCard[]>(
    () =>
      this.store.data()?.skillGroups.map((group) => ({
        title: this.pick(group.title),
        entries: group.entries.map((entry) => ({
          name: entry.technology.name,
          lead: entry.emphasis === 'lead',
        })),
      })) ?? [],
  );

  private pick(text: LocalizedText): string {
    return localizedText.pick(text, this.localeService.locale());
  }
}
