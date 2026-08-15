import { TestBed } from '@angular/core/testing';

import { App } from './app';
import { provideI18n } from './core/i18n/provide-i18n';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideI18n()],
    }).compileComponents();
  });

  it('creates the shell with header and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-header')).toBeTruthy();
    expect(element.querySelector('app-footer')).toBeTruthy();
  });
});
