import { TestBed } from '@angular/core/testing';

import { contactChannel } from '../../../domain/contact-channel/contact-channel';

import { provideContactFeature } from '../../..';
import { GetContactChannelsHandler, type GetContactChannelsQuery } from './get-contact-channels';

describe('GetContactChannelsHandler', () => {
  const query: GetContactChannelsQuery = { kind: 'getContactChannels' };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideContactFeature()] });
  });

  it('lists every channel in content order', () => {
    const handler = TestBed.inject(GetContactChannelsHandler);

    expect(
      handler
        .handle(query)()
        .map((item) => item.channel.kind),
    ).toEqual(['email', 'telegram', 'phone', 'github']);
  });

  it('derives each href through the domain toHref', () => {
    const handler = TestBed.inject(GetContactChannelsHandler);

    for (const item of handler.handle(query)()) {
      expect(item.href).toBe(contactChannel.toHref(item.channel));
    }
  });

  it('marks exactly one channel — Telegram — as preferred', () => {
    const handler = TestBed.inject(GetContactChannelsHandler);

    const preferred = handler
      .handle(query)()
      .filter((item) => item.preferred)
      .map((item) => item.channel.kind);

    expect(preferred).toEqual(['telegram']);
  });
});
