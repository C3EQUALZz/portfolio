import { inject, Injectable, InjectionToken, type Signal, signal } from '@angular/core';

import type { ContactBook, ContactBookEntry } from '../../domain/contact-book/contact-book';
import { contactBook } from '../../domain/contact-book/contact-book';
import type { ContactChannel } from '../../domain/contact-channel/contact-channel';

/**
 * DI token for the validated ContactBook. No repository port: the source is
 * static content, and toContactBook already validates it at the boundary.
 */
export const CONTACT_BOOK = new InjectionToken<ContactBook>('CONTACT_BOOK');

/** Feature state: the candidate's channels and the preferred one. */
@Injectable({ providedIn: 'root' })
export class ContactBookStore {
  private readonly book = inject(CONTACT_BOOK);

  readonly channels: Signal<readonly ContactBookEntry[]> = signal(this.book.entries);
  readonly preferred: Signal<ContactChannel> = signal(contactBook.preferred(this.book));
}
