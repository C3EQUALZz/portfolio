import { inject, Injectable, type Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { map } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import type { Locale } from '../../shared/kernel/localization/localized-text';

/**
 * The current UI locale as a signal, over Transloco. The single place that
 * knows how the locale is stored; the rest of the app reads `locale()` and
 * picks LocalizedText values with `localizedText.pick`.
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly transloco = inject(TranslocoService);

  readonly locale: Signal<Locale> = toSignal(
    this.transloco.langChanges$.pipe(map((lang) => lang as Locale)),
    { initialValue: this.transloco.getActiveLang() as Locale },
  );

  setLocale(locale: Locale): void {
    this.transloco.setActiveLang(locale);
  }
}
