import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { translateSignal } from '@jsverse/transloco';

import type { CodeforcesFacts, CodingProfile } from '../../domain/coding-profile/coding-profile';

/**
 * Codeforces rank color bands (the platform's own scale), mapped to local
 * custom properties in the card's CSS.
 */
type RatingBand = 'gray' | 'green' | 'cyan' | 'blue' | 'violet' | 'orange' | 'red' | 'unrated';

function bandOf(rating: number | undefined): RatingBand {
  if (rating === undefined) {
    return 'unrated';
  }
  if (rating < 1200) {
    return 'gray';
  }
  if (rating < 1400) {
    return 'green';
  }
  if (rating < 1600) {
    return 'cyan';
  }
  if (rating < 1900) {
    return 'blue';
  }
  if (rating < 2100) {
    return 'violet';
  }
  if (rating < 2400) {
    return 'orange';
  }
  return 'red';
}

/** Codeforces card: current/best rating with rank color, solved count, rating sparkline. */
@Component({
  selector: 'app-codeforces-card',
  templateUrl: './codeforces-card.html',
  styleUrl: './codeforces-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeforcesCard {
  readonly profile = input.required<CodingProfile>();

  protected readonly solvedLabel = translateSignal('stats.solved');
  protected readonly ratingLabel = translateSignal('stats.rating');
  protected readonly bestLabel = translateSignal('stats.bestRating');
  protected readonly unratedLabel = translateSignal('stats.unrated');
  protected readonly historyLabel = translateSignal('stats.ratingHistory');

  protected readonly facts = computed<CodeforcesFacts>(() => {
    const facts = this.profile().facts;
    if (facts.kind !== 'codeforces') {
      throw new Error('CodeforcesCard expects codeforces facts');
    }
    return facts;
  });

  protected readonly band = computed(() => bandOf(this.facts().rating));

  /** Polyline points of the rating history, normalized into a 300×60 box. */
  protected readonly sparkline = computed(() => {
    const history = this.facts().ratingHistory;
    if (history.length < 2) {
      return undefined;
    }
    const ratings = history.map((point) => point.rating);
    const min = Math.min(...ratings);
    const max = Math.max(...ratings);
    const spread = max - min || 1;
    return history
      .map((point, index) => {
        const x = (index / (history.length - 1)) * 300;
        const y = 56 - ((point.rating - min) / spread) * 52;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });
}
