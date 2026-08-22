import { ChangeDetectionStrategy, Component, computed, inject, type Signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { translateSignal } from '@jsverse/transloco';

import { LocaleService } from '../shared/i18n/locale.service';
import { LOCALES } from '../shared/kernel/localization/localized-text';
import { ThemeService } from './theme.service';

interface NavItem {
  readonly fragment: string;
  readonly label: Signal<string>;
}

/** Fixed header: brand, navigation, locale switch, theme toggle. */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly locale = inject(LocaleService);
  protected readonly locales = LOCALES;
  protected readonly theme = inject(ThemeService);

  protected readonly brand = translateSignal('header.brand');
  protected readonly certificatesLabel = translateSignal('nav.certificates');

  private readonly themeToLight = translateSignal('header.themeToLight');
  private readonly themeToDark = translateSignal('header.themeToDark');

  /** The button names the action, so the label is the target theme. */
  protected readonly themeToggleLabel = computed(() =>
    this.theme.theme() === 'dark' ? this.themeToLight() : this.themeToDark(),
  );

  /** Landing sections; the fragment scrolls once the landing is rendered. */
  protected readonly navItems: readonly NavItem[] = [
    { fragment: 'about', label: translateSignal('nav.about') },
    { fragment: 'experience', label: translateSignal('nav.experience') },
    { fragment: 'work', label: translateSignal('nav.work') },
    { fragment: 'stack', label: translateSignal('nav.stack') },
    { fragment: 'contact', label: translateSignal('nav.contact') },
  ];
}
