import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

type ChangeListener = (event: { matches: boolean }) => void;

/** Minimal matchMedia stub: records the change listener, matches nothing. */
function stubMatchMedia(): { fire: (matches: boolean) => void } {
  let listener: ChangeListener | undefined;
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: (_: string, cb: ChangeListener) => {
      listener = cb;
    },
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
  return {
    fire: (matches: boolean) => listener?.({ matches }),
  };
}

/** In-memory Storage stub — the test DOM has no localStorage at all. */
function stubLocalStorage(): Storage {
  const store = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => {
      store.clear();
    },
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => [...store.keys()][index] ?? null,
    removeItem: (key: string) => store.delete(key),
    setItem: (key: string, value: string) => store.set(key, value),
  };
  Object.defineProperty(window, 'localStorage', { configurable: true, value: storage });
  return storage;
}

describe('ThemeService', () => {
  const originalMatchMedia = window.matchMedia;
  let storage: Storage;

  beforeEach(() => {
    storage = stubLocalStorage();
    delete document.documentElement.dataset['theme'];
  });

  afterEach(() => {
    delete document.documentElement.dataset['theme'];
    window.matchMedia = originalMatchMedia;
    Reflect.deleteProperty(window, 'localStorage');
  });

  it('defaults to dark when nothing is stored and the DOM carries no theme', () => {
    expect(TestBed.inject(ThemeService).theme()).toBe('dark');
  });

  it('starts from the theme the bootstrap script put on <html>', () => {
    document.documentElement.dataset['theme'] = 'light';

    expect(TestBed.inject(ThemeService).theme()).toBe('light');
  });

  it('toggle flips the theme, updates <html> and persists the choice', () => {
    const service = TestBed.inject(ThemeService);

    service.toggle();
    expect(service.theme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
    expect(storage.getItem('theme')).toBe('light');

    service.toggle();
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('follows the OS theme while the user has not chosen', () => {
    const system = stubMatchMedia();
    const service = TestBed.inject(ThemeService);

    system.fire(true);

    expect(service.theme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
    expect(storage.getItem('theme')).toBeNull();
  });

  it('ignores the OS theme once the user has chosen explicitly', () => {
    const system = stubMatchMedia();
    const service = TestBed.inject(ThemeService);

    service.toggle();
    system.fire(false);

    expect(service.theme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
  });
});
