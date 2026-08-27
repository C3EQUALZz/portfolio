import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { DailyActivity } from '../../domain/coding-profile/coding-profile';

interface HeatCell {
  readonly date: string;
  readonly submissions: number;
  readonly level: 0 | 1 | 2 | 3 | 4;
  readonly future: boolean;
}

const WEEKS = 52;

function levelOf(submissions: number): HeatCell['level'] {
  if (submissions <= 0) {
    return 0;
  }
  if (submissions <= 2) {
    return 1;
  }
  if (submissions <= 5) {
    return 2;
  }
  if (submissions <= 9) {
    return 3;
  }
  return 4;
}

/** GitHub-style contributions grid: 52 weeks ending this Saturday. */
@Component({
  selector: 'app-submission-heatmap',
  templateUrl: './submission-heatmap.html',
  styleUrl: './submission-heatmap.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionHeatmap {
  readonly calendar = input.required<readonly DailyActivity[]>();

  protected readonly weeks = computed<readonly (readonly HeatCell[])[]>(() => {
    const byDate = new Map(this.calendar().map((day) => [day.date, day.submissions]));
    const now = new Date();
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    // The grid's last column is the current week, ending on Saturday.
    const end = new Date(today);
    end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));
    const endMs = end.getTime();

    const weeks: HeatCell[][] = [];
    for (let week = WEEKS - 1; week >= 0; week--) {
      const days: HeatCell[] = [];
      // Sunday first, top row.
      for (let day = 6; day >= 0; day--) {
        const at = new Date(endMs - (week * 7 + day) * 86_400_000);
        const date = at.toISOString().slice(0, 10);
        const submissions = byDate.get(date) ?? 0;
        days.push({
          date,
          submissions,
          level: levelOf(submissions),
          future: at.getTime() > today,
        });
      }
      weeks.push(days);
    }
    return weeks;
  });
}
