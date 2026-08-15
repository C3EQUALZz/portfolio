import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

import type { Impact, ImpactDirection, ImpactUnit } from '../../domain/impact/impact';

import { LocaleService } from '../../../../core/i18n/locale.service';
import { localizedText } from '../../../../shared/kernel/localization/localized-text';

const DIRECTION_SIGN: Record<ImpactDirection, string> = {
  increase: '+',
  decrease: '−',
  absolute: '',
};

const ANIMATION_MS = 900;

/** Formats a numeric impact: direction sign and unit affix are presentation. */
function formatNumericImpact(amount: number, unit: ImpactUnit, direction: ImpactDirection): string {
  const sign = DIRECTION_SIGN[direction];
  switch (unit) {
    case 'percent':
      return `${sign}${amount.toString()}%`;
    case 'times':
      return `×${amount.toString()}`;
    case 'milliseconds':
      return `${amount.toString()} ms`;
    case 'none':
      return `${sign}${amount.toString()}`;
  }
}

/**
 * One metric of a role. Numeric values count up from zero once scrolled
 * into view; literal values ("compile-time") render as-is — the domain
 * decides which is which (impact.isAnimatable), the UI only renders.
 */
@Component({
  selector: 'app-impact-value',
  templateUrl: './impact-value.html',
  styleUrl: './impact-value.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImpactValue {
  readonly item = input.required<Impact>();

  private readonly localeService = inject(LocaleService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly displayed = signal('');

  protected readonly isNumeric = computed(() => this.item().value.kind === 'numeric');

  protected readonly literalText = computed(() => {
    const value = this.item().value;
    return value.kind === 'literal'
      ? localizedText.pick(value.text, this.localeService.locale())
      : '';
  });

  constructor() {
    afterNextRender(() => {
      this.reveal();
    });
  }

  private reveal(): void {
    const value = this.item().value;
    if (value.kind !== 'numeric') {
      return;
    }
    const final = formatNumericImpact(value.amount, value.unit, value.direction);
    const reducedMotion =
      typeof globalThis.matchMedia === 'function' &&
      globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      this.displayed.set(final);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          this.animate(value.amount, value.unit, value.direction);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(this.host.nativeElement);
    this.destroyRef.onDestroy(() => {
      observer.disconnect();
    });
  }

  private animate(amount: number, unit: ImpactUnit, direction: ImpactDirection): void {
    const start = performance.now();
    const tick = (now: number): void => {
      const progress = Math.min((now - start) / ANIMATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.displayed.set(formatNumericImpact(Math.round(amount * eased), unit, direction));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  }
}
