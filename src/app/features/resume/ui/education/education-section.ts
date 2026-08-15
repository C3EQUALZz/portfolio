import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { translateSignal, TranslocoService } from '@jsverse/transloco';

import { ResumeStore } from '../../application/resume-store/resume-store';

import { LocaleService } from '../../../../core/i18n/locale.service';
import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';

interface EducationItem {
  readonly institution: string;
  readonly program: string;
  readonly city: string;
  readonly graduationYear: number;
}

interface LanguageItem {
  readonly name: string;
  readonly levelText: string;
}

/** Education and languages — the part of the resume below the stack. */
@Component({
  selector: 'app-education-section',
  templateUrl: './education-section.html',
  styleUrl: './education-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationSection {
  protected readonly store = inject(ResumeStore);
  private readonly localeService = inject(LocaleService);
  private readonly transloco = inject(TranslocoService);

  protected readonly kicker = translateSignal('education.title');
  protected readonly languagesTitle = translateSignal('education.languagesTitle');

  protected readonly education = computed<readonly EducationItem[]>(
    () =>
      this.store.data()?.education.map((item) => ({
        institution: this.pick(item.institution),
        program: this.pick(item.program),
        city: this.pick(item.city),
        graduationYear: item.graduationYear,
      })) ?? [],
  );

  protected readonly languages = computed<readonly LanguageItem[]>(
    () =>
      this.store.data()?.languages.map((item) => ({
        name: this.pick(item.language),
        levelText:
          item.level === 'native'
            ? this.transloco.translate('education.native')
            : item.level.toUpperCase(),
      })) ?? [],
  );

  private pick(text: LocalizedText): string {
    return localizedText.pick(text, this.localeService.locale());
  }
}
