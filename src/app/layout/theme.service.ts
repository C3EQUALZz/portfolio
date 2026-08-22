import { DOCUMENT } from '@angular/common';
import { inject, Injectable, type Signal, signal } from '@angular/core';

/** Color scheme of the UI; the dark theme is the default. */
export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';

function isTheme(value: string | null | undefined): value is Theme {
  return value === 'dark' || value === 'light';
}

/**
 * The current color theme as a signal. Starts from what the bootstrap script
 * in index.html put into `<html data-theme>`: the stored explicit choice wins,
 * otherwise the OS preference is followed — live, until the user toggles once.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly media =
    typeof this.document.defaultView?.matchMedia === 'function'
      ? this.document.defaultView.matchMedia('(prefers-color-scheme: light)')
      : undefined;
  private readonly current = signal<Theme>(this.initialTheme());

  readonly theme: Signal<Theme> = this.current.asReadonly();

  constructor() {
    this.media?.addEventListener('change', this.onSystemChange);
  }

  /** Explicit user choice: persisted and applied until the next toggle. */
  toggle(): void {
    const theme: Theme = this.current() === 'dark' ? 'light' : 'dark';
    this.storage?.setItem(STORAGE_KEY, theme);
    this.apply(theme);
  }

  /** localStorage may be unavailable (privacy mode, test DOM) — then the choice just is not persisted. */
  private get storage(): Storage | undefined {
    try {
      return this.document.defaultView?.localStorage ?? undefined;
    } catch {
      return undefined;
    }
  }

  private initialTheme(): Theme {
    const fromDom = this.document.documentElement.dataset['theme'];
    return isTheme(fromDom) ? fromDom : 'dark';
  }

  private readonly onSystemChange = (event: MediaQueryListEvent): void => {
    const stored = this.storage?.getItem(STORAGE_KEY);
    if (!isTheme(stored)) {
      this.apply(event.matches ? 'light' : 'dark');
    }
  };

  private apply(theme: Theme): void {
    this.document.documentElement.dataset['theme'] = theme;
    this.current.set(theme);
  }
}
