import { TestBed } from '@angular/core/testing';

import { provideI18n } from '../core/i18n/provide-i18n';
import { Header } from './header';

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideI18n()],
    }).compileComponents();
  });

  it('renders the section navigation in English by default', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const nav = (fixture.nativeElement as HTMLElement).querySelector('.links');

    expect(nav?.textContent).toContain('Experience');
    expect(nav?.textContent).toContain('Contact');
  });

  it('switches the navigation to Russian', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const buttons = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
        '.locale-button',
      ),
    ];
    const ruButton = buttons.find((button) => button.textContent.trim() === 'ru');

    ruButton?.click();
    // Translations load asynchronously; whenStable alone does not await them.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await fixture.whenStable();

    const nav = (fixture.nativeElement as HTMLElement).querySelector('.links');
    expect(nav?.textContent).toContain('Опыт');
    expect(ruButton?.getAttribute('aria-pressed')).toBe('true');
  });
});
