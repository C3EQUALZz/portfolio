import { Injectable, isDevMode } from '@angular/core';

import { provideTransloco, type Translation, type TranslocoLoader } from '@jsverse/transloco';

import { LOCALES } from '../../shared/kernel/localization/localized-text';
import { EN_TRANSLATIONS } from './en';
import { RU_TRANSLATIONS } from './ru';

/**
 * Dictionaries are static TS modules, not JSON over HTTP: checked by the
 * compiler, no network, no prerender breakage — same reasoning as the
 * feature content literals.
 */
@Injectable({ providedIn: 'root' })
class InlineTranslocoLoader implements TranslocoLoader {
  getTranslation(lang: string): Promise<Translation> {
    return Promise.resolve(lang === 'ru' ? RU_TRANSLATIONS : EN_TRANSLATIONS);
  }
}

export function provideI18n(): ReturnType<typeof provideTransloco> {
  return provideTransloco({
    config: {
      availableLangs: [...LOCALES],
      defaultLang: 'en',
      fallbackLang: 'en',
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
    },
    loader: InlineTranslocoLoader,
  });
}
