import { describe, expect, it } from 'vitest';

import { emailAddress } from '../../../../shared/kernel/email/email-address';
import { phoneNumber } from '../../../../shared/kernel/phone/phone-number';
import { must } from '../../../../shared/testing/must';
import { githubLogin } from '../github-login/github-login';
import { telegramHandle } from '../telegram-handle/telegram-handle';
import { contactChannel } from './contact-channel';

describe('contactChannel.toHref', () => {
  it('maps an email channel to a mailto: link', () => {
    const channel = contactChannel.email(must(emailAddress.create('dan.kovalev2013@gmail.com')));

    expect(contactChannel.toHref(channel)).toBe('mailto:dan.kovalev2013@gmail.com');
  });

  it('maps a telegram channel to a t.me link', () => {
    const channel = contactChannel.telegram(must(telegramHandle.create('computerScienceEnjoyer')));

    expect(contactChannel.toHref(channel)).toBe('https://t.me/computerScienceEnjoyer');
  });

  it('maps a phone channel to a tel: link', () => {
    const channel = contactChannel.phone(must(phoneNumber.create('+79897064596')));

    expect(contactChannel.toHref(channel)).toBe('tel:+79897064596');
  });

  it('maps a github channel to the profile URL', () => {
    const channel = contactChannel.github(must(githubLogin.create('C3EQUALZz')));

    expect(contactChannel.toHref(channel)).toBe('https://github.com/C3EQUALZz');
  });
});
