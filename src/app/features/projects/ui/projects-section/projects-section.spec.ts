import { TestBed } from '@angular/core/testing';

import { provideProjectsFeature } from '../..';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { provideI18n } from '../../../../core/i18n/provide-i18n';
import { ProjectsSection } from './projects-section';

describe('ProjectsSection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsSection],
      providers: [provideI18n(), provideProjectsFeature()],
    }).compileComponents();
  });

  it('renders the four dishka integrations as cards linking to their repositories', async () => {
    const fixture = TestBed.createComponent(ProjectsSection);
    await fixture.whenStable();
    const cards = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('.card'),
    ];

    expect(cards).toHaveLength(4);
    expect(cards[0]?.href).toBe('https://github.com/C3EQUALZz/dishka-ag2');
    expect(cards[0]?.textContent).toContain('dishka-ag2');
  });

  it('renders cards without a repository snapshot — no stars, no error', async () => {
    const fixture = TestBed.createComponent(ProjectsSection);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('.card')).toHaveLength(4);
    expect(element.querySelector('.ph-star')).toBeNull();
  });

  it('switches the card texts to Russian', async () => {
    const fixture = TestBed.createComponent(ProjectsSection);
    await fixture.whenStable();

    TestBed.inject(LocaleService).setLocale('ru');
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.card-tagline')?.textContent).toContain('AG2');
    expect(element.textContent).toContain('библиотека');
  });
});
