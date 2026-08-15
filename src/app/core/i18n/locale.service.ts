import { inject, Injectable, type Signal, signal } from '@angular/core';

import { take } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import type { Locale } from '../../shared/kernel/localization/localized-text';

/**
 * The current UI locale as a signal, over Transloco. The single place that
 * knows how the locale is stored; the rest of the app reads `locale()` and
 * picks LocalizedText values with `localizedText.pick`.
 *
 * The signal flips only after the locale's translations have loaded, so a
 * computed reading `locale()` never translates against a not-yet-loaded
 * dictionary.
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly transloco = inject(TranslocoService);
  private readonly current = signal<Locale>(this.transloco.getActiveLang() as Locale);

  readonly locale: Signal<Locale> = this.current.asReadonly();

  setLocale(locale: Locale): void {
    const subscription = this.transloco
      .load(locale)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.transloco.setActiveLang(locale);
          this.current.set(locale);
          subscription.unsubscribe();
        },
        error: () => {
          // Inline dictionaries cannot fail to load; nothing to recover.
        },
      });
  }
}
