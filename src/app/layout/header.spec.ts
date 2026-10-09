import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideI18n } from '../shared/i18n/provide-i18n';
import { Header } from './header';

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([]), provideI18n()],
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

  it('toggles the mobile disclosure and closes it on an outside click', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const toggle = element.querySelector<HTMLButtonElement>('.menu-toggle')!;

    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(element.querySelector('.links')?.classList.contains('links-open')).toBe(true);

    document.dispatchEvent(new MouseEvent('click'));
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('returns focus to the menu button on Escape only when the menu is open', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const toggle = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '.menu-toggle',
    )!;
    const focus = vi.spyOn(toggle, 'focus');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(focus).not.toHaveBeenCalled();
    toggle.click();
    await fixture.whenStable();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(focus).toHaveBeenCalledOnce();
  });
});
