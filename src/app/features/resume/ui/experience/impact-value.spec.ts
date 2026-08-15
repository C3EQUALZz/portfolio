import { TestBed } from '@angular/core/testing';

import { impact } from '../../domain/impact/impact';

import { LocaleService } from '../../../../core/i18n/locale.service';
import { provideI18n } from '../../../../core/i18n/provide-i18n';
import { must } from '../../../../shared/testing/must';
import { ImpactValue } from './impact-value';

const NUMERIC = must(
  impact.numeric({
    label: { en: 'Throughput', ru: 'Пропускная способность' },
    amount: 4,
    unit: 'times',
    direction: 'increase',
  }),
);

const LITERAL = must(
  impact.literal({
    label: { en: 'Where races fail', ru: 'Где ломаются гонки' },
    text: { en: 'compile-time', ru: 'на этапе компиляции' },
  }),
);

describe('ImpactValue', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpactValue],
      providers: [provideI18n()],
    }).compileComponents();
  });

  it('shows the final value of a numeric impact (no IntersectionObserver in tests)', async () => {
    const fixture = TestBed.createComponent(ImpactValue);
    fixture.componentRef.setInput('item', NUMERIC);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('×4');
  });

  it('renders a literal impact as text', async () => {
    const fixture = TestBed.createComponent(ImpactValue);
    fixture.componentRef.setInput('item', LITERAL);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('compile-time');
  });

  it('localizes the literal text', async () => {
    const fixture = TestBed.createComponent(ImpactValue);
    fixture.componentRef.setInput('item', LITERAL);
    await fixture.whenStable();

    TestBed.inject(LocaleService).setLocale('ru');
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('на этапе компиляции');
  });
});
