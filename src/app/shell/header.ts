import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';

import { translateSignal } from '@jsverse/transloco';

import { LocaleService } from '../core/i18n/locale.service';
import { LOCALES } from '../shared/kernel/localization/localized-text';

interface NavItem {
  readonly href: string;
  readonly label: Signal<string>;
}

/** Fixed header: brand, anchor navigation, locale switch. */
@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly locale = inject(LocaleService);
  protected readonly locales = LOCALES;

  protected readonly brand = translateSignal('header.brand');

  protected readonly navItems: readonly NavItem[] = [
    { href: '#about', label: translateSignal('nav.about') },
    { href: '#experience', label: translateSignal('nav.experience') },
    { href: '#work', label: translateSignal('nav.work') },
    { href: '#stack', label: translateSignal('nav.stack') },
    { href: '#contact', label: translateSignal('nav.contact') },
  ];
}
