import { TestBed } from '@angular/core/testing';

import { provideContactFeature } from '../..';
import { ContactBookStore } from './contact-book-store';

describe('ContactBookStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideContactFeature()] });
  });

  it('exposes the validated channels with Telegram preferred', () => {
    const store = TestBed.inject(ContactBookStore);

    expect(store.channels().map((entry) => entry.channel.kind)).toEqual([
      'email',
      'telegram',
      'phone',
      'github',
    ]);
    expect(store.preferred().kind).toBe('telegram');
  });
});
