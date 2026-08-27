import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { translateSignal, TranslocoService } from '@jsverse/transloco';

import { RefreshCodingStatsHandler } from '../../application/commands/refresh-coding-stats/refresh-coding-stats';
import type { PlatformStatsView } from '../../application/queries/get-coding-stats/get-coding-stats';

import { LocaleService } from '../../../../shared/i18n/locale.service';

/**
 * The card frame shared by all platforms: header with handle and profile
 * link, then one of three states — loading note, unavailable with retry, or
 * the projected ready body with a cache footer.
 */
@Component({
  selector: 'app-platform-card',
  templateUrl: './platform-card.html',
  styleUrl: './platform-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformCard {
  readonly label = input.required<string>();
  readonly view = input.required<PlatformStatsView>();

  private readonly refreshStats = inject(RefreshCodingStatsHandler);
  private readonly localeService = inject(LocaleService);
  private readonly transloco = inject(TranslocoService);

  protected readonly loadingText = translateSignal('stats.loading');
  protected readonly unavailableTitle = translateSignal('stats.unavailableTitle');
  protected readonly unavailableNote = translateSignal('stats.unavailableNote');
  protected readonly retryLabel = translateSignal('stats.retry');
  protected readonly refreshLabel = translateSignal('stats.refresh');
  protected readonly refreshingLabel = translateSignal('stats.refreshing');
  protected readonly cachedLabel = translateSignal('stats.cached');
  protected readonly viewProfileLabel = translateSignal('stats.viewProfile');

  /** Ready-state footer; undefined in other states so the template narrows. */
  protected readonly footer = computed(() => {
    const state = this.view().state;
    if (state.status !== 'ready') {
      return undefined;
    }
    return {
      updated: this.transloco.translate('stats.updatedAt', {
        time: this.formatTime(state.cachedAt),
      }),
      stale: state.stale,
      refreshing: state.refreshing,
    };
  });

  protected retry(): void {
    void this.refreshStats.handle({
      kind: 'refreshCodingStats',
      platform: this.view().target.platform,
    });
  }

  private formatTime(iso: string): string {
    const tag = this.localeService.locale() === 'ru' ? 'ru-RU' : 'en-US';
    return new Intl.DateTimeFormat(tag, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  }
}
