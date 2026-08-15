import { contactBook, type ContactBook } from '../../domain/contact-book/contact-book';
import { contactChannel, type ContactChannel } from '../../domain/contact-channel/contact-channel';
import { githubLogin } from '../../domain/github-login/github-login';
import { telegramHandle } from '../../domain/telegram-handle/telegram-handle';

import { emailAddress } from '../../../../shared/kernel/email/email-address';
import { phoneNumber } from '../../../../shared/kernel/phone/phone-number';
import { collect, err, map, ok, type Result } from '../../../../shared/kernel/result/result';

/** Raw content shape: plain strings, validated at the boundary. */
export type ContactChannelDto =
  | { readonly kind: 'email'; readonly address: string; readonly preferred?: boolean }
  | { readonly kind: 'telegram'; readonly handle: string; readonly preferred?: boolean }
  | { readonly kind: 'phone'; readonly number: string; readonly preferred?: boolean }
  | { readonly kind: 'github'; readonly login: string; readonly preferred?: boolean };

interface InvalidContactContent {
  readonly kind: 'InvalidContactContent';
  /** Where the content broke, e.g. "channels[1]". */
  readonly path: string;
}

function invalid(path: string): Result<never, InvalidContactContent> {
  return err({ kind: 'InvalidContactContent', path });
}

type Parsed<T> = Result<T, InvalidContactContent>;

function parseChannel(dto: ContactChannelDto): Result<ContactChannel, unknown> {
  switch (dto.kind) {
    case 'email':
      return map(emailAddress.create(dto.address), (address) => contactChannel.email(address));
    case 'telegram':
      return map(telegramHandle.create(dto.handle), (handle) => contactChannel.telegram(handle));
    case 'phone':
      return map(phoneNumber.create(dto.number), (number) => contactChannel.phone(number));
    case 'github':
      return map(githubLogin.create(dto.login), (login) => contactChannel.github(login));
  }
}

/** Maps the raw content literal to a validated ContactBook aggregate. */
export function toContactBook(dto: readonly ContactChannelDto[]): Parsed<ContactBook> {
  const entries = collect(
    dto.map((item, index) => {
      const parsed = parseChannel(item);
      return parsed.ok
        ? ok({ channel: parsed.value, preferred: item.preferred ?? false })
        : invalid(`channels[${index.toString()}]`);
    }),
  );
  if (!entries.ok) {
    return entries;
  }
  const created = contactBook.create(entries.value);
  return created.ok ? created : invalid(`contactBook.${created.error.kind}`);
}
