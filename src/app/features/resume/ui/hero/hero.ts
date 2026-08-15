import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  type Signal,
} from '@angular/core';

import { translateSignal } from '@jsverse/transloco';

import { ResumeStore } from '../../application/resume-store/resume-store';

import { LocaleService } from '../../../../core/i18n/locale.service';
import {
  localizedText,
  type LocalizedText,
} from '../../../../shared/kernel/localization/localized-text';
import type { Technology } from '../../../../shared/kernel/technology/technology';

interface RingChip {
  readonly name: string;
  readonly left: number;
  readonly top: number;
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

const ROLE_ROTATION_MS = 3000;

function buildRing(
  technologies: readonly Technology[],
  layout: (typeof RING_LAYOUT)[number],
): Ring {
  const chips = technologies.map((technology, index) => {
    const angle = (index / technologies.length) * 2 * Math.PI;
    return {
      name: technology.name,
      left: 50 + layout.radiusPct * Math.cos(angle),
      top: 50 + layout.radiusPct * Math.sin(angle),
    };
  });
  return { chips, ...layout };
}

/**
 * Hero section: name, rotating role headline, derived total experience and
 * the technology ring — everything read from the Resume through the store.
 */
@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly store = inject(ResumeStore);
  private readonly localeService = inject(LocaleService);

  private readonly roleIndex = signal(0);

  protected readonly person = computed(() => this.store.data()?.person);

  protected readonly headline = computed(() => this.pick(this.person()?.headline));

  protected readonly roleHeadline = computed(() => {
    const roles = this.person()?.roleHeadlines;
    if (roles === undefined || roles.length === 0) {
      return '';
    }
    return this.pick(roles[this.roleIndex() % roles.length]);
  });

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

  constructor() {
    const timer = setInterval(() => {
      this.roleIndex.update((index) => index + 1);
    }, ROLE_ROTATION_MS);
    inject(DestroyRef).onDestroy(() => {
      clearInterval(timer);
    });
  }

  private pick(text: LocalizedText | undefined): string {
    return text === undefined ? '' : localizedText.pick(text, this.localeService.locale());
  }
}
