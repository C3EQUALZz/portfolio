import { TestBed } from '@angular/core/testing';

import { provideResumeFeature } from '../..';
import { LocaleService } from '../../../../shared/i18n/locale.service';
import { provideI18n } from '../../../../shared/i18n/provide-i18n';
import { EducationSection } from './education-section';

describe('EducationSection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationSection],
      providers: [provideI18n(), provideResumeFeature()],
    }).compileComponents();
  });

  it('renders the education entry and the languages from the content', async () => {
    const fixture = TestBed.createComponent(EducationSection);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Don State Technical University');
    expect(element.textContent).toContain('2028');
    expect(element.textContent).toContain('Russian');
    expect(element.textContent).toContain('Native');
    expect(element.textContent).toContain('English');
    expect(element.textContent).toContain('B2');
  });

  it('switches to Russian, localizing the native level', async () => {
    const fixture = TestBed.createComponent(EducationSection);
    await fixture.whenStable();

    TestBed.inject(LocaleService).setLocale('ru');
    // The locale signal flips after the translations have loaded.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Донской государственный технический университет');
    expect(element.textContent).toContain('Родной');
  });
});
