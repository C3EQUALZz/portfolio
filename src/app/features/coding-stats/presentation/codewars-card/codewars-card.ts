import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { translateSignal } from '@jsverse/transloco';

import type { CodewarsFacts, CodingProfile } from '../../domain/coding-profile/coding-profile';

/** Codewars card: kyu badge, honor, completed kata, leaderboard position. */
@Component({
  selector: 'app-codewars-card',
  templateUrl: './codewars-card.html',
  styleUrl: './codewars-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodewarsCard {
  readonly profile = input.required<CodingProfile>();

  protected readonly kyuLabel = translateSignal('stats.kyuRank');
  protected readonly honorLabel = translateSignal('stats.honor');
  protected readonly completedLabel = translateSignal('stats.completedKata');
  protected readonly leaderboardLabel = translateSignal('stats.leaderboard');

  protected readonly facts = computed<CodewarsFacts>(() => {
    const facts = this.profile().facts;
    if (facts.kind !== 'codewars') {
      throw new Error('CodewarsCard expects codewars facts');
    }
    return facts;
  });
}
