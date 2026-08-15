import type { Brand } from '../../../../shared/kernel/brand/brand';
import type { EmailAddress } from '../../../../shared/kernel/email/email-address';
import type { PhoneNumber } from '../../../../shared/kernel/phone/phone-number';
import type { GitHubLogin } from '../github-login/github-login';
import type { TelegramHandle } from '../telegram-handle/telegram-handle';

/**
 * One typed way to reach the candidate: email, Telegram, phone, GitHub.
 * See CONTEXT.md.
 */
export type ContactChannel =
  | { readonly kind: 'email'; readonly address: EmailAddress }
  | { readonly kind: 'telegram'; readonly handle: TelegramHandle }
  | { readonly kind: 'phone'; readonly number: PhoneNumber }
  | { readonly kind: 'github'; readonly login: GitHubLogin };

/**
 * A ready link target. The channel payloads are validated at creation, so
 * no escaping is needed at this point — the href is derived, never stored.
 */
export type Href = Brand<string, 'Href'>;

export const contactChannel = {
  email(address: EmailAddress): ContactChannel {
    return { kind: 'email', address };
  },

  telegram(handle: TelegramHandle): ContactChannel {
    return { kind: 'telegram', handle };
  },

  phone(number: PhoneNumber): ContactChannel {
    return { kind: 'phone', number };
  },

  github(login: GitHubLogin): ContactChannel {
    return { kind: 'github', login };
  },

  /**
   * Total function: exactly one right answer per channel. Kept in the
   * domain under tests — a mistake here breaks the line to the employer.
   */
  toHref(channel: ContactChannel): Href {
    switch (channel.kind) {
      case 'email':
        return `mailto:${channel.address}` as Href;
      case 'telegram':
        return `https://t.me/${channel.handle}` as Href;
      case 'phone':
        return `tel:${channel.number}` as Href;
      case 'github':
        return `https://github.com/${channel.login}` as Href;
    }
  },
};
