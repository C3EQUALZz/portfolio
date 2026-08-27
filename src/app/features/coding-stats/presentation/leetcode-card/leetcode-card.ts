import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { translateSignal } from '@jsverse/transloco';

import type { CodingProfile, LeetCodeFacts } from '../../domain/coding-profile/coding-profile';

import { SubmissionHeatmap } from '../submission-heatmap/submission-heatmap';

interface DonutSegment {
  readonly label: string;
  readonly className: string;
  readonly dash: string;
  readonly offset: number;
}

interface DifficultyBar {
  readonly label: string;
  readonly className: string;
  readonly solved: number;
  readonly available: number | undefined;
  readonly percent: number;
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function difficultyBar(
  label: string,
  className: string,
  solved: number,
  available: number | undefined,
): DifficultyBar {
  return {
    label,
    className,
    solved,
    available,
    percent:
      available === undefined || available === 0 ? 0 : Math.min(100, (solved / available) * 100),
  };
}

/** LeetCode card: solved donut, difficulty bars, contest rating, languages, recent accepted, heatmap. */
@Component({
  selector: 'app-leetcode-card',
  imports: [SubmissionHeatmap],
  templateUrl: './leetcode-card.html',
  styleUrl: './leetcode-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeetcodeCard {
  readonly profile = input.required<CodingProfile>();

  protected readonly solvedLabel = translateSignal('stats.solved');
  protected readonly easyLabel = translateSignal('stats.easy');
  protected readonly mediumLabel = translateSignal('stats.medium');
  protected readonly hardLabel = translateSignal('stats.hard');
  protected readonly rankLabel = translateSignal('stats.globalRank');
  protected readonly contestLabel = translateSignal('stats.contestRating');
  protected readonly languagesLabel = translateSignal('stats.languages');
  protected readonly recentLabel = translateSignal('stats.recentAccepted');
  protected readonly activityLabel = translateSignal('stats.activity');

  protected readonly facts = computed<LeetCodeFacts>(() => {
    const facts = this.profile().facts;
    if (facts.kind !== 'leetcode') {
      throw new Error('LeetcodeCard expects leetcode facts');
    }
    return facts;
  });

  /** Donut segments: each difficulty as a fraction of the solved total. */
  protected readonly segments = computed<readonly DonutSegment[]>(() => {
    const { solvedByDifficulty: solved } = this.facts();
    const total = this.profile().totalSolved;
    const parts = [
      { label: 'easy', className: 'seg-easy', value: solved.easy },
      { label: 'medium', className: 'seg-medium', value: solved.medium },
      { label: 'hard', className: 'seg-hard', value: solved.hard },
    ];
    let covered = 0;
    return parts
      .filter((part) => part.value > 0 && total > 0)
      .map((part) => {
        const length = (part.value / total) * CIRCUMFERENCE;
        const segment = {
          label: part.label,
          className: part.className,
          dash: `${length.toString()} ${(CIRCUMFERENCE - length).toString()}`,
          offset: -covered,
        };
        covered += length;
        return segment;
      });
  });

  protected readonly bars = computed<readonly DifficultyBar[]>(() => {
    const { solvedByDifficulty: solved, availableByDifficulty: available } = this.facts();
    return [
      difficultyBar(this.easyLabel(), 'bar-easy', solved.easy, available?.easy),
      difficultyBar(this.mediumLabel(), 'bar-medium', solved.medium, available?.medium),
      difficultyBar(this.hardLabel(), 'bar-hard', solved.hard, available?.hard),
    ];
  });

  /** Languages as bars, like the difficulty rows — width relative to the top one. */
  protected readonly topLanguages = computed(() => {
    const languages = this.facts().languages.slice(0, 5);
    const max = Math.max(0, ...languages.map((language) => language.solved));
    return languages.map((language) => ({
      ...language,
      percent: max === 0 ? 0 : (language.solved / max) * 100,
    }));
  });

  protected readonly recentAccepted = computed(() => this.facts().recentAccepted.slice(0, 5));

  protected problemUrl(slug: string): string {
    return `https://leetcode.com/problems/${slug}/`;
  }
}
