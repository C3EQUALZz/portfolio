import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import type { Achievement } from '../../domain/achievement/achievement';
import type { Experience } from '../../domain/experience/experience';
import type { Impact } from '../../domain/impact/impact';

import { ResumeStore } from '../../application/resume-store/resume-store';

import { LocaleService } from '../../../../core/i18n/locale.service';
import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import { period, type Period } from '../../../../shared/kernel/time/period';
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
  readonly duration: { readonly years: number; readonly months: number };
  readonly engagementKey: string;
  readonly title: string;
  readonly product: string;
  readonly impacts: readonly ImpactItem[];
  readonly achievements: readonly AchievementItem[];
  readonly clusters: readonly ClusterItem[];
}

/** Experience timeline: every role with its metrics, achievements and stack. */
@Component({
  selector: 'app-experience-section',
  imports: [TranslocoPipe, ImpactValue],
  templateUrl: './experience-section.html',
  styleUrl: './experience-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceSection {
  protected readonly store = inject(ResumeStore);
  private readonly localeService = inject(LocaleService);
  private readonly transloco = inject(TranslocoService);

  protected readonly years = computed(() => this.store.totalExperience()?.years ?? 0);

  protected readonly cards = computed<readonly RoleCard[]>(() =>
    this.store.timeline().map((item) => this.toCard(item)),
  );

  private toCard(item: Experience): RoleCard {
    const months = period.durationInMonths(item.period, this.store.asOfDate);
    return {
      experience: item,
      periodLabel: this.formatPeriod(item.period),
      duration: { years: Math.floor(months / 12), months: months % 12 },
      engagementKey: `experience.engagement.${item.engagement}`,
      title: `${this.pick(item.position)} — ${item.company.name}`,
      product: this.pick(item.product),
      impacts: item.impacts.map((value) => ({ impact: value, label: this.pick(value.label) })),
      achievements: item.achievements.map((achievement) => this.toAchievementItem(achievement)),
      clusters: item.technologies.map((cluster) => ({
        names: cluster.technologies.map((technology) => technology.name).join(' · '),
        lead: cluster.emphasis === 'lead',
      })),
    };
  }

  private toAchievementItem(achievement: Achievement): AchievementItem {
    return { lead: this.pick(achievement.lead), detail: this.pick(achievement.detail) };
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

  private pick(text: LocalizedText): string {
    return localizedText.pick(text, this.localeService.locale());
  }
}
