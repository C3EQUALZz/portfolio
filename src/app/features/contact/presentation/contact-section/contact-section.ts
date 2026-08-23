import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { translateSignal } from '@jsverse/transloco';

import type { ContactChannel } from '../../domain/contact-channel/contact-channel';

import { GetContactChannelsHandler } from '../../application/queries/get-contact-channels/get-contact-channels';

/** The Phosphor icon per channel kind — presentational. */
const CHANNEL_ICON: Record<ContactChannel['kind'], string> = {
  email: 'ph-envelope-simple',
  telegram: 'ph-telegram-logo',
  phone: 'ph-phone',
  github: 'ph-github-logo',
};

/** Human-readable Russian phone format; other numbers shown as-is (E.164). */
function formatPhone(number: string): string {
  const match = /^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(number);
  return match === null ? number : `+7 ${match.slice(1).join(' ')}`;
}

function channelLabel(channel: ContactChannel): string {
  switch (channel.kind) {
    case 'email':
      return channel.address;
    case 'telegram':
      return `@${channel.handle}`;
    case 'phone':
      return formatPhone(channel.number);
    case 'github':
      return channel.login;
  }
}

interface ChannelCard {
  readonly kind: ContactChannel['kind'];
  readonly href: string;
  readonly icon: string;
  readonly label: string;
  readonly external: boolean;
  readonly preferred: boolean;
}

/** Contact section: every channel as a button, items from the query handler. */
@Component({
  selector: 'app-contact-section',
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSection {
  private readonly channels = inject(GetContactChannelsHandler).handle({
    kind: 'getContactChannels',
  });

  protected readonly kicker = translateSignal('nav.contact');
  protected readonly title = translateSignal('contact.title');
  protected readonly subtitle = translateSignal('contact.subtitle');

  protected readonly cards = computed<readonly ChannelCard[]>(() =>
    this.channels().map((item) => ({
      kind: item.channel.kind,
      href: item.href,
      icon: CHANNEL_ICON[item.channel.kind],
      label: channelLabel(item.channel),
      external: item.channel.kind === 'telegram' || item.channel.kind === 'github',
      preferred: item.preferred,
    })),
  );
}
