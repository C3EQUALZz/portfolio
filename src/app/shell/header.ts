import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

import { LocaleService } from '../core/i18n/locale.service';
import { LOCALES } from '../shared/kernel/localization/localized-text';

interface NavItem {
  readonly href: string;
  readonly key: string;
}

/** Fixed header: brand, anchor navigation, locale switch. */
@Component({
  selector: 'app-header',
  imports: [TranslocoPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly locale = inject(LocaleService);
  protected readonly locales = LOCALES;

  protected readonly navItems: readonly NavItem[] = [
    { href: '#about', key: 'nav.about' },
    { href: '#experience', key: 'nav.experience' },
    { href: '#work', key: 'nav.work' },
    { href: '#stack', key: 'nav.stack' },
    { href: '#contact', key: 'nav.contact' },
  ];
}
