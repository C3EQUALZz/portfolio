import { TestBed } from '@angular/core/testing';

import { provideResumeFeature } from '../..';
import { LocaleService } from '../../../../shared/i18n/locale.service';
import { provideI18n } from '../../../../shared/i18n/provide-i18n';
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

    expect(titles[0]).toBe('nissva');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.role-position')?.textContent,
    ).toBe('Middle Developer');
    expect(titles[titles.length - 1]).toContain('Ecom.tech');
  });

  it('shows the completed role through August 2026 and derives its duration', async () => {
    const fixture = TestBed.createComponent(ExperienceSection);
    await fixture.whenStable();
    const first = (fixture.nativeElement as HTMLElement).querySelector('.role');
    const periodText = first?.querySelector('.role-period')?.textContent;
    const metadata = first?.querySelector('.role-meta')?.textContent;

    expect(periodText).toContain('Aug 2026');
    expect(periodText).not.toContain('now');
    expect(metadata).toContain('9 months');
    expect(metadata).toContain('on-site');
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
    expect(element.querySelector('.subtitle')?.textContent).toContain('AppSec');
    expect(element.querySelector('.role-title')?.textContent).toBe('ФГАНУ НИИ Спецвузавтоматика');
    expect(element.querySelector('.role-position')?.textContent).toBe('Middle-разработчик');
    expect(element.querySelector('.role-period')?.textContent).toContain('авг.');
    expect(element.querySelector('.role-period')?.textContent).not.toContain('сейчас');
  });
});
