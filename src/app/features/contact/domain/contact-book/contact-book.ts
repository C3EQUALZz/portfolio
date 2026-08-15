import { err, ok, type Result } from '../../../../shared/kernel/result/result';
import type { ContactChannel } from '../contact-channel/contact-channel';

/** A channel plus whether it is the preferred way to reach the candidate. */
export interface ContactBookEntry {
  readonly channel: ContactChannel;
  readonly preferred: boolean;
}

/**
 * Every way to reach the candidate. Always created whole: at least one
 * channel and exactly one preferred — the employer should never have to
 * guess which one to use. See CONTEXT.md.
 */
export interface ContactBook {
  readonly entries: readonly ContactBookEntry[];
}

export interface ContactBookError {
  readonly kind: 'EmptyChannels' | 'PreferredCount';
}

function failure(kind: ContactBookError['kind']): Result<never, ContactBookError> {
  return err({ kind });
}

export const contactBook = {
  create(entries: readonly ContactBookEntry[]): Result<ContactBook, ContactBookError> {
    if (entries.length === 0) {
      return failure('EmptyChannels');
    }
    if (entries.filter((entry) => entry.preferred).length !== 1) {
      return failure('PreferredCount');
    }
    return ok({ entries });
  },

  preferred(book: ContactBook): ContactChannel {
    const entry = book.entries.find((item) => item.preferred);
    if (entry === undefined) {
      throw new Error('ContactBook invariant broken: exactly one preferred channel');
    }
    return entry.channel;
  },
};
