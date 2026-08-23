import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { translateSignal, TranslocoService } from '@jsverse/transloco';

import { GetEducationHandler } from '../../application/queries/get-education/get-education';

import { LocaleService } from '../../../../shared/i18n/locale.service';

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
  private readonly getEducation = inject(GetEducationHandler);
  private readonly localeService = inject(LocaleService);
  private readonly transloco = inject(TranslocoService);

  protected readonly kicker = translateSignal('education.title');
  protected readonly languagesTitle = translateSignal('education.languagesTitle');

  private readonly overview = this.getEducation.handle({ kind: 'getEducation' });

  protected readonly education = computed<readonly EducationItem[]>(
    () =>
      this.overview()?.education.map((item) => ({
        institution: this.localeService.pick(item.institution),
        program: this.localeService.pick(item.program),
        city: this.localeService.pick(item.city),
        graduationYear: item.graduationYear,
      })) ?? [],
  );

  protected readonly languages = computed<readonly LanguageItem[]>(
    () =>
      this.overview()?.languages.map((item) => ({
        name: this.localeService.pick(item.language),
        levelText:
          item.level === 'native'
            ? this.transloco.translate('education.native')
            : item.level.toUpperCase(),
      })) ?? [],
  );
}
