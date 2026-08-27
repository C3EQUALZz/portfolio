import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { translateSignal, TranslocoService } from '@jsverse/transloco';

import type { CodingPlatform } from '../../domain/coding-platform/coding-platform';

import { GetCodingStatsHandler } from '../../application/queries/get-coding-stats/get-coding-stats';

import { CodeforcesCard } from '../codeforces-card/codeforces-card';
import { CodewarsCard } from '../codewars-card/codewars-card';
import { LeetcodeCard } from '../leetcode-card/leetcode-card';
import { PlatformCard } from '../platform-card/platform-card';

/** Display names are brand names — proper nouns, not translated. */
const PLATFORM_LABEL: Record<CodingPlatform, string> = {
  leetcode: 'LeetCode',
  codeforces: 'Codeforces',
  codewars: 'Codewars',
};

/** Stats page: the solved-total headline and one card per platform. */
@Component({
  selector: 'app-coding-stats-page',
  imports: [PlatformCard, LeetcodeCard, CodeforcesCard, CodewarsCard],
  templateUrl: './coding-stats-page.html',
  styleUrl: './coding-stats-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodingStatsPage {
  private readonly getCodingStats = inject(GetCodingStatsHandler);
  private readonly transloco = inject(TranslocoService);

  protected readonly title = translateSignal('stats.title');
  protected readonly subtitle = translateSignal('stats.subtitle');

  protected readonly view = this.getCodingStats.handle({ kind: 'getCodingStats' });

  protected readonly headline = computed(() =>
    this.transloco.translate('stats.headline', { count: this.view().totalSolved }),
  );

  protected readonly platformLabel = PLATFORM_LABEL;
}
