import { TestBed } from '@angular/core/testing';

import { provideContactFeature } from '../..';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { provideI18n } from '../../../../core/i18n/provide-i18n';
import { ContactSection } from './contact-section';

describe('ContactSection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSection],
      providers: [provideI18n(), provideContactFeature()],
    }).compileComponents();
  });

  it('derives every href through the domain toHref', async () => {
    const fixture = TestBed.createComponent(ContactSection);
    await fixture.whenStable();
    const hrefs = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('.channel'),
    ].map((link) => link.getAttribute('href'));

    expect(hrefs).toEqual([
      'mailto:dan.kovalev2013@gmail.com',
      'https://t.me/computerScienceEnjoyer',
      'tel:+79897064596',
      'https://github.com/C3EQUALZz',
    ]);
  });

  it('marks the preferred channel by the model, not by position', async () => {
    const fixture = TestBed.createComponent(ContactSection);
    await fixture.whenStable();
    const preferred = (fixture.nativeElement as HTMLElement).querySelector('.channel-preferred');

    expect(preferred?.textContent).toContain('@computerScienceEnjoyer');
  });

  it('switches the section chrome to Russian', async () => {
    const fixture = TestBed.createComponent(ContactSection);
    await fixture.whenStable();

    TestBed.inject(LocaleService).setLocale('ru');
    // Translations load asynchronously; whenStable alone does not await them.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.title')?.textContent).toContain('backend-ролям');
  });
});
