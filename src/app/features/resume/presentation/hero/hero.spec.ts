import { TestBed } from '@angular/core/testing';

import { resume } from '../../domain/resume/resume';

import { resumeContent } from '../../infrastructure/content/resume-content';
import { toResume } from '../../infrastructure/content/to-resume';

import { provideResumeFeature } from '../..';
import { LocaleService } from '../../../../shared/i18n/locale.service';
import { provideI18n } from '../../../../shared/i18n/provide-i18n';
import { yearMonth } from '../../../../shared/kernel/time/year-month';
import { must } from '../../../../shared/testing/must';
import { Hero } from './hero';

describe('Hero', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hero],
      providers: [provideI18n(), provideResumeFeature()],
    }).compileComponents();
  });

  it('renders the name and summary from the content', async () => {
    const fixture = TestBed.createComponent(Hero);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.name')?.textContent).toContain('Danil Kovalev');
    expect(element.querySelector('.summary')?.textContent).toContain('security tooling');
  });

  it('scrolls every role headline in the marquee, duplicated for a seamless loop', async () => {
    const fixture = TestBed.createComponent(Hero);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    const roles = must(toResume(resumeContent)).person.roleHeadlines.map((role) => role.en);
    const items = [...element.querySelectorAll('.role-item')].map((item) =>
      item.textContent.trim(),
    );

    expect(items).toHaveLength(roles.length * 2);
    for (const role of roles) {
      expect(items).toContain(role);
    }
  });

  it('shows the experience derived from the content dates, not a written number', async () => {
    const fixture = TestBed.createComponent(Hero);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    const total = resume.totalExperience(
      must(toResume(resumeContent)),
      yearMonth.fromDate(new Date()),
    );
    const text = element.querySelector('.experience')?.textContent;
    expect(text).toContain(`${total.years.toString()} year`);
    expect(text).toContain(`${total.months.toString()} month`);
  });

  it('fills the ring with the lead technologies only', async () => {
    const fixture = TestBed.createComponent(Hero);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    const leadNames = must(toResume(resumeContent))
      .skillGroups.flatMap((group) => group.entries)
      .filter((entry) => entry.emphasis === 'lead')
      .map((entry) => entry.technology.name);
    const chips = [...element.querySelectorAll('app-tech-chip')];

    expect(chips).toHaveLength(leadNames.length);
    for (const chip of chips) {
      const rendered = chip.querySelector('.ring-chip');
      expect(leadNames).toContain(rendered?.getAttribute('title'));
      expect(chip.querySelector('img.ring-chip-icon, i.ph')).toBeTruthy();
    }
  });

  it('links every ring chip to the technology source repository', async () => {
    const fixture = TestBed.createComponent(Hero);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    const links = [...element.querySelectorAll<HTMLAnchorElement>('app-tech-chip a.ring-chip')];

    expect(links).toHaveLength(18);
    for (const link of links) {
      expect(link.href).toContain('https://github.com/');
      expect(link.target).toBe('_blank');
    }
  });

  it('switches the content texts to Russian', async () => {
    const fixture = TestBed.createComponent(Hero);
    await fixture.whenStable();

    TestBed.inject(LocaleService).setLocale('ru');
    // Translations load asynchronously; whenStable alone does not await them.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.summary')?.textContent).toContain('Инструменты безопасности');
    expect(element.querySelector('.experience')?.textContent).toContain('года');
  });
});
