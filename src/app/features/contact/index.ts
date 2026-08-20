import type { EnvironmentProviders, Provider } from '@angular/core';

import { CONTACT_BOOK } from './application/contact-book-store/contact-book-store';

import { contactContent } from './infrastructure/content/contact-content';
import { toContactBook } from './infrastructure/content/to-contact-book';

export { ContactSection } from './presentation/contact-section/contact-section';

/**
 * Provides the validated ContactBook. The content is static and covered by
 * the "content parses" spec; if it ever breaks, the app fails fast at
 * bootstrap with the breaking path instead of rendering broken links.
 */
export function provideContactFeature(): (Provider | EnvironmentProviders)[] {
  const parsed = toContactBook(contactContent);
  if (!parsed.ok) {
    throw new Error(`Invalid contact content at ${parsed.error.path}`);
  }
  return [{ provide: CONTACT_BOOK, useValue: parsed.value }];
}
