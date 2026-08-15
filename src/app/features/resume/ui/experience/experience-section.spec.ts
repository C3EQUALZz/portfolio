import { TestBed } from '@angular/core/testing';

import { provideResumeFeature } from '../..';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { provideI18n } from '../../../../core/i18n/provide-i18n';
import { ExperienceSection } from './experience-section';

describe('ExperienceSection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceSection],
      providers: [provideI18n(), provideResumeFeature()],
    }).compileComponents();
  });

  it('lists the roles newest first', async () => {
    const fixture = TestBed.createComponent(ExperienceSection);
    await fixture.whenStable();
    const titles = [...(fixture.nativeElement as HTMLElement).querySelectorAll('.role-title')].map(
      (node) => node.textContent,
    );

    expect(titles[0]).toContain('Spetsvuzavtomatika');
    expect(titles[titles.length - 1]).toContain('Ecom.tech');
  });

  it('marks the ongoing role as «now» and derives the duration from the period', async () => {
    const fixture = TestBed.createComponent(ExperienceSection);
    await fixture.whenStable();
    const first = (fixture.nativeElement as HTMLElement).querySelector('.role');

    expect(first?.querySelector('.role-period')?.textContent).toContain('now');
    expect(first?.querySelector('.role-meta')?.textContent).toContain('month');
    expect(first?.querySelector('.role-meta')?.textContent).toContain('on-site');
  });

  it('animates only numeric impacts; literals render as text', async () => {
    const fixture = TestBed.createComponent(ExperienceSection);
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent;

    expect(text).toContain('×4');
    expect(text).toContain('compile-time');
  });

  it('switches the section to Russian', async () => {
    const fixture = TestBed.createComponent(ExperienceSection);
    await fixture.whenStable();

    TestBed.inject(LocaleService).setLocale('ru');
    // Translations load asynchronously; whenStable alone does not await them.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.subtitle')?.textContent).toContain('переписывание');
    expect(element.querySelector('.role-period')?.textContent).toContain('сейчас');
  });
});
