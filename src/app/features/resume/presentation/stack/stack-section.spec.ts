import { TestBed } from '@angular/core/testing';

import { resumeContent } from '../../infrastructure/content/resume-content';
import { toResume } from '../../infrastructure/content/to-resume';

import { provideResumeFeature } from '../..';
import { LocaleService } from '../../../../shared/i18n/locale.service';
import { provideI18n } from '../../../../shared/i18n/provide-i18n';
import { must } from '../../../../shared/testing/must';
import { StackSection } from './stack-section';

describe('StackSection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackSection],
      providers: [provideI18n(), provideResumeFeature()],
    }).compileComponents();
  });

  it('renders every skill group from the content', async () => {
    const fixture = TestBed.createComponent(StackSection);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    const expected = must(toResume(resumeContent)).skillGroups;
    expect(element.querySelectorAll('.group')).toHaveLength(expected.length);
    expect(element.querySelector('.block-title')?.textContent).toContain('Languages & runtime');
  });

  it('accents lead entries and keeps supporting ones neutral', async () => {
    const fixture = TestBed.createComponent(StackSection);
    await fixture.whenStable();
    const chips = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll('.chip'),
    ] as HTMLElement[];
    const byName = new Map(chips.map((chip) => [chip.textContent.trim(), chip]));

    expect(byName.get('Rust')?.classList.contains('chip-lead')).toBe(true);
    expect(byName.get('asyncio')?.classList.contains('chip-lead')).toBe(false);
  });

  it('switches the group titles to Russian', async () => {
    const fixture = TestBed.createComponent(StackSection);
    await fixture.whenStable();

    TestBed.inject(LocaleService).setLocale('ru');
    // The locale signal flips after the translations have loaded.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.block-title')?.textContent).toContain('Языки и рантайм');
  });
});
