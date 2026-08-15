import type { ContactChannelDto } from './to-contact-book';

/**
 * The candidate's channels from the Nocturne template. A typed literal, not
 * JSON over HTTP: the compiler checks it, no network, no prerender breakage.
 * Exactly one channel is preferred — Telegram, as in the template.
 */
export const contactContent: readonly ContactChannelDto[] = [
  { kind: 'email', address: 'dan.kovalev2013@gmail.com' },
  { kind: 'telegram', handle: 'computerScienceEnjoyer', preferred: true },
  { kind: 'phone', number: '+79897064596' },
  { kind: 'github', login: 'C3EQUALZz' },
];
