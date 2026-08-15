import { describe, expect, it } from 'vitest';

import { contactBook } from '../../domain/contact-book/contact-book';
import { contactChannel } from '../../domain/contact-channel/contact-channel';

import { contactContent } from './contact-content';
import { toContactBook } from './to-contact-book';

describe('contactContent', () => {
  it('parses without errors', () => {
    expect(toContactBook(contactContent)).toMatchObject({ ok: true });
  });

  it('has all four channels with Telegram as the preferred one', () => {
    const parsed = toContactBook(contactContent);
    if (!parsed.ok) {
      throw new Error('content must parse');
    }

    expect(parsed.value.entries.map((entry) => entry.channel.kind)).toEqual([
      'email',
      'telegram',
      'phone',
      'github',
    ]);
    expect(contactBook.preferred(parsed.value).kind).toBe('telegram');
  });

  it('derives working hrefs for every channel', () => {
    const parsed = toContactBook(contactContent);
    if (!parsed.ok) {
      throw new Error('content must parse');
    }

    const hrefs = parsed.value.entries.map((entry) => contactChannel.toHref(entry.channel));
    expect(hrefs).toEqual([
      'mailto:dan.kovalev2013@gmail.com',
      'https://t.me/computerScienceEnjoyer',
      'tel:+79897064596',
      'https://github.com/C3EQUALZz',
    ]);
  });

  it('reports the breaking channel index when content is invalid', () => {
    const broken = [contactContent[0]!, { kind: 'github', login: '-bad-' } as const];

    expect(toContactBook(broken)).toEqual({
      ok: false,
      error: { kind: 'InvalidContactContent', path: 'channels[1]' },
    });
  });

  it('reports the broken invariant when no channel is preferred', () => {
    const noPreferred = contactContent.map((item) => ({ ...item, preferred: false }));

    expect(toContactBook(noPreferred)).toEqual({
      ok: false,
      error: { kind: 'InvalidContactContent', path: 'contactBook.PreferredCount' },
    });
  });
});
