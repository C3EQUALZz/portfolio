import { computed, inject, Injectable, InjectionToken, type Signal } from '@angular/core';

import type { ContactBook } from '../../../domain/contact-book/contact-book';
import {
  contactChannel,
  type ContactChannel,
} from '../../../domain/contact-channel/contact-channel';

import type { Query, QueryHandler } from '../../../../../shared/cqs/query/query';

/**
 * DI token for the validated ContactBook. No repository port: the source is
 * static content, and toContactBook already validates it at the boundary.
 */
export const CONTACT_BOOK = new InjectionToken<ContactBook>('CONTACT_BOOK');

/** The read request: every channel of the book, in content order. */
export interface GetContactChannelsQuery extends Query {
  readonly kind: 'getContactChannels';
}

/** A channel with its ready href — the UI binds it without calling the domain. */
export interface ContactChannelItem {
  readonly channel: ContactChannel;
  readonly href: string;
  readonly preferred: boolean;
}

/**
 * Reads the validated ContactBook. The content is static, so a plain computed
 * over the entries is enough — no resource, no loading state.
 */
@Injectable({ providedIn: 'root' })
export class GetContactChannelsHandler implements QueryHandler<
  GetContactChannelsQuery,
  readonly ContactChannelItem[]
> {
  private readonly book = inject(CONTACT_BOOK);

  handle(_query: GetContactChannelsQuery): Signal<readonly ContactChannelItem[]> {
    return computed(() =>
      this.book.entries.map((entry) => ({
        channel: entry.channel,
        href: contactChannel.toHref(entry.channel),
        preferred: entry.preferred,
      })),
    );
  }
}
