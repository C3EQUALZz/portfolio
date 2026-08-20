import { TestBed } from '@angular/core/testing';

import { provideResumeFeature } from '../..';
import { LocaleService } from '../../../../shared/i18n/locale.service';
import { provideI18n } from '../../../../shared/i18n/provide-i18n';
import { AboutSection } from './about-section';

describe('AboutSection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutSection],
      providers: [provideI18n(), provideResumeFeature()],
    }).compileComponents();
  });

  it('renders the highlights from the content with topic icons', async () => {
    const fixture = TestBed.createComponent(AboutSection);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('.highlight')).toHaveLength(3);
    expect(element.querySelector('.ph-blueprint')).toBeTruthy();
    expect(element.textContent).toContain('DDD');
  });

  it('switches the highlight texts to Russian', async () => {
    const fixture = TestBed.createComponent(AboutSection);
    await fixture.whenStable();

    TestBed.inject(LocaleService).setLocale('ru');
    // The locale signal flips after the translations have loaded.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Работаю от DDD');
  });
});
