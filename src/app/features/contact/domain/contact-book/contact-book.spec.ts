import { describe, expect, it } from 'vitest';

import { emailAddress } from '../../../../shared/kernel/email/email-address';
import { must } from '../../../../shared/testing/must';
import { contactChannel } from '../contact-channel/contact-channel';
import { githubLogin } from '../github-login/github-login';
import { telegramHandle } from '../telegram-handle/telegram-handle';
import { contactBook, type ContactBookEntry } from './contact-book';

const EMAIL: ContactBookEntry = {
  channel: contactChannel.email(must(emailAddress.create('dan.kovalev2013@gmail.com'))),
  preferred: false,
};
const TELEGRAM: ContactBookEntry = {
  channel: contactChannel.telegram(must(telegramHandle.create('computerScienceEnjoyer'))),
  preferred: true,
};
const GITHUB: ContactBookEntry = {
  channel: contactChannel.github(must(githubLogin.create('C3EQUALZz'))),
  preferred: false,
};

describe('contactBook.create invariants', () => {
  it('creates a book with exactly one preferred channel', () => {
    expect(contactBook.create([EMAIL, TELEGRAM, GITHUB])).toMatchObject({ ok: true });
  });

  it('rejects an empty book', () => {
    expect(contactBook.create([])).toEqual({
      ok: false,
      error: { kind: 'EmptyChannels' },
    });
  });

  it('rejects a book without a preferred channel', () => {
    expect(contactBook.create([EMAIL, GITHUB])).toEqual({
      ok: false,
      error: { kind: 'PreferredCount' },
    });
  });

  it('rejects a book with two preferred channels', () => {
    const alsoPreferred: ContactBookEntry = { ...EMAIL, preferred: true };

    expect(contactBook.create([alsoPreferred, TELEGRAM])).toEqual({
      ok: false,
      error: { kind: 'PreferredCount' },
    });
  });
});

describe('contactBook queries', () => {
  it('preferred returns the channel marked as preferred', () => {
    const book = must(contactBook.create([EMAIL, TELEGRAM, GITHUB]));

    expect(contactBook.preferred(book)).toBe(TELEGRAM.channel);
  });
});
