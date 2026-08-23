import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { translateSignal, TranslocoService } from '@jsverse/transloco';

import type { Achievement } from '../../domain/achievement/achievement';
import type { Experience } from '../../domain/experience/experience';
import type { Impact } from '../../domain/impact/impact';

import {
  type ExperienceTimelineItem,
  GetExperienceTimelineHandler,
} from '../../application/queries/get-experience-timeline/get-experience-timeline';
import { GetTotalExperienceHandler } from '../../application/queries/get-total-experience/get-total-experience';

import { LocaleService } from '../../../../shared/i18n/locale.service';
import type { Period } from '../../../../shared/kernel/time/period';
import type { YearMonth } from '../../../../shared/kernel/time/year-month';
import { ImpactValue } from './impact-value';

interface ImpactItem {
  readonly impact: Impact;
  readonly label: string;
}

interface AchievementItem {
  readonly lead: string;
  readonly detail: string;
}

interface ClusterItem {
  readonly names: string;
  readonly lead: boolean;
}

interface RoleCard {
  readonly experience: Experience;
  readonly periodLabel: string;
  readonly durationText: string;
  readonly engagementText: string;
  readonly title: string;
  readonly product: string;
  readonly impacts: readonly ImpactItem[];
  readonly achievements: readonly AchievementItem[];
  readonly clusters: readonly ClusterItem[];
}

/** Experience timeline: every role with its metrics, achievements and stack. */
@Component({
  selector: 'app-experience-section',
  imports: [ImpactValue],
  templateUrl: './experience-section.html',
  styleUrl: './experience-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceSection {
  private readonly getExperienceTimeline = inject(GetExperienceTimelineHandler);
  private readonly getTotalExperience = inject(GetTotalExperienceHandler);
  private readonly localeService = inject(LocaleService);
  private readonly transloco = inject(TranslocoService);

  private readonly timeline = this.getExperienceTimeline.handle({
    kind: 'getExperienceTimeline',
  });
  private readonly totalExperience = this.getTotalExperience.handle({
    kind: 'getTotalExperience',
  });

  protected readonly years = computed(() => this.totalExperience()?.years ?? 0);

  protected readonly kicker = translateSignal('nav.experience');
  protected readonly title = translateSignal(
    'experience.title',
    computed(() => ({ years: this.years() })),
  );
  protected readonly subtitle = translateSignal('experience.subtitle');

  protected readonly cards = computed<readonly RoleCard[]>(() =>
    this.timeline().map((item) => this.toCard(item)),
  );

  private toCard(item: ExperienceTimelineItem): RoleCard {
    const experience = item.experience;
    // The domain returns bare months; the { years, months } split is a locale concern.
    const duration = {
      years: Math.floor(item.durationInMonths / 12),
      months: item.durationInMonths % 12,
    };
    return {
      experience,
      periodLabel: this.formatPeriod(experience.period),
      durationText: this.transloco.translate('experience.duration', duration),
      engagementText: this.transloco.translate(`experience.engagement.${experience.engagement}`),
      title: `${this.localeService.pick(experience.position)} — ${experience.company.name}`,
      product: this.localeService.pick(experience.product),
      impacts: experience.impacts.map((value) => ({
        impact: value,
        label: this.localeService.pick(value.label),
      })),
      achievements: experience.achievements.map((achievement) =>
        this.toAchievementItem(achievement),
      ),
      clusters: experience.technologies.map((cluster) => ({
        names: cluster.technologies.map((technology) => technology.name).join(' · '),
        lead: cluster.emphasis === 'lead',
      })),
    };
  }

  private toAchievementItem(achievement: Achievement): AchievementItem {
    return {
      lead: this.localeService.pick(achievement.lead),
      detail: this.localeService.pick(achievement.detail),
    };
  }

  private formatPeriod(value: Period): string {
    const locale = this.localeService.locale();
    const end =
      value.end === 'present'
        ? this.transloco.translate('experience.present')
        : this.formatMonth(value.end, locale);
    return `${this.formatMonth(value.start, locale)} — ${end}`;
  }

  private formatMonth(value: YearMonth, locale: string): string {
    const date = new Date(Number(value.slice(0, 4)), Number(value.slice(5, 7)) - 1);
    return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(date);
  }
}
