import { TestBed } from '@angular/core/testing';

import { provideProjectsFeature } from '../..';
import { LocaleService } from '../../../../shared/i18n/locale.service';
import { provideI18n } from '../../../../shared/i18n/provide-i18n';
import { ProjectsSection } from './projects-section';

describe('ProjectsSection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsSection],
      providers: [provideI18n(), provideProjectsFeature()],
    }).compileComponents();
  });

  it('renders the maintained libraries as cards linking to their repositories', async () => {
    const fixture = TestBed.createComponent(ProjectsSection);
    await fixture.whenStable();
    const cards = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('.card'),
    ];

    expect(cards).toHaveLength(6);
    expect(cards[0]?.href).toBe('https://github.com/C3EQUALZz/faststream-celery');
    expect(cards[0]?.textContent).toContain('faststream-celery');
  });

  it('renders cards without a repository snapshot — no stars, no error', async () => {
    const fixture = TestBed.createComponent(ProjectsSection);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('.card')).toHaveLength(6);
    expect(element.querySelector('.ph-star')).toBeNull();
  });

  it('switches the card texts to Russian', async () => {
    const fixture = TestBed.createComponent(ProjectsSection);
    await fixture.whenStable();

    TestBed.inject(LocaleService).setLocale('ru');
    // The locale signal flips after the translations have loaded.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.card-tagline')?.textContent).toContain('Celery');
    expect(element.textContent).toContain('библиотека');
  });
});
