import { ChangeDetectionStrategy, Component, computed, inject, type Signal } from '@angular/core';

import { translateSignal } from '@jsverse/transloco';

import { ResumeStore } from '../../application/resume-store/resume-store';

import { LocaleService } from '../../../../core/i18n/locale.service';
import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import type { Technology } from '../../../../shared/kernel/technology/technology';
import { TechChip } from './tech-chip';
import { techIcon } from './tech-icons';

interface RingChip {
  readonly name: string;
  readonly left: number;
  readonly top: number;
  readonly assetPath?: string;
  readonly invertIcon?: boolean;
  readonly phIcon?: string;
  readonly url?: string;
}

interface Ring {
  readonly chips: readonly RingChip[];
  readonly durationSeconds: number;
  readonly reverse: boolean;
  readonly chipSize: number;
}

/** Inner → outer, mirroring the template's three counter-rotating rings. */
const RING_LAYOUT = [
  { durationSeconds: 32, reverse: false, chipSize: 44, radiusPct: 17 },
  { durationSeconds: 44, reverse: true, chipSize: 48, radiusPct: 28 },
  { durationSeconds: 60, reverse: false, chipSize: 54, radiusPct: 45 },
] as const;

function buildRing(
  technologies: readonly Technology[],
  layout: (typeof RING_LAYOUT)[number],
): Ring {
  const chips = technologies.map((technology, index) => {
    const angle = (index / technologies.length) * 2 * Math.PI;
    const icon = techIcon(technology.slug);
    return {
      name: technology.name,
      left: 50 + layout.radiusPct * Math.cos(angle),
      top: 50 + layout.radiusPct * Math.sin(angle),
      ...(icon?.kind === 'asset' ? { assetPath: icon.path, invertIcon: icon.invert ?? false } : {}),
      ...(icon?.kind === 'ph' ? { phIcon: icon.icon } : {}),
      ...(icon !== undefined ? { url: icon.url } : {}),
    };
  });
  return { chips, ...layout };
}

/**
 * Hero section: name, marquee of role headlines, derived total experience
 * and the technology ring — everything read from the Resume through the store.
 */
@Component({
  selector: 'app-hero',
  imports: [TechChip],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly store = inject(ResumeStore);
  private readonly localeService = inject(LocaleService);

  protected readonly person = computed(() => this.store.data()?.person);

  protected readonly headline = computed(() => this.pick(this.person()?.headline));

  /** All role headlines in the current locale — the marquee scrolls them. */
  protected readonly roles = computed(
    () => this.person()?.roleHeadlines.map((role) => this.pick(role)) ?? [],
  );

  /**
   * The roles twice: the marquee track translates -50%, so the duplicate
   * half makes the loop seamless. aria-hidden marks the repeated items.
   */
  protected readonly marqueeItems = computed<readonly { text: string; copy: boolean }[]>(() => [
    ...this.roles().map((text) => ({ text, copy: false })),
    ...this.roles().map((text) => ({ text, copy: true })),
  ]);

  protected readonly summary = computed(() => this.pick(this.person()?.summary));

  protected readonly availabilityLine = computed(() => {
    const availability = this.store.data()?.availability;
    if (availability === undefined) {
      return '';
    }
    return this.pick(availability.base);
  });

  protected readonly relocatesTo = computed(() => {
    const availability = this.store.data()?.availability;
    if (availability === undefined || availability.relocatesTo.length === 0) {
      return '';
    }
    return availability.relocatesTo.map((city) => this.pick(city)).join(' / ');
  });

  protected readonly isOpen = computed(() => this.store.data()?.availability.status === 'open');

  protected readonly totalExperience = computed(() => this.store.totalExperience());

  protected readonly hasExperience = computed(() => this.store.totalExperience() !== undefined);

  protected readonly ctaWork = translateSignal('hero.ctaWork');
  protected readonly ctaContact = translateSignal('hero.ctaContact');
  protected readonly openToText = translateSignal(
    'hero.openTo',
    computed(() => ({ cities: this.relocatesTo() })),
  );
  protected readonly experienceText = translateSignal(
    'hero.experience',
    computed(() => {
      const total = this.store.totalExperience();
      return { years: total?.years ?? 0, months: total?.months ?? 0 };
    }),
  );

  /** The 18 lead technologies split over the three rings: 5 inner, 5 middle, the rest outer. */
  protected readonly rings: Signal<readonly Ring[]> = computed(() => {
    const technologies = this.store.leadTechnologies();
    const inner = technologies.slice(0, 5);
    const middle = technologies.slice(5, 10);
    const outer = technologies.slice(10);
    return [
      buildRing(inner, RING_LAYOUT[0]),
      buildRing(middle, RING_LAYOUT[1]),
      buildRing(outer, RING_LAYOUT[2]),
    ].filter((ring) => ring.chips.length > 0);
  });

  private pick(text: LocalizedText | undefined): string {
    return text === undefined ? '' : localizedText.pick(text, this.localeService.locale());
  }
}
