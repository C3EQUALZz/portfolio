/**
 * UI chrome strings, English. The shape of this object is the contract:
 * the Russian dictionary is typed as typeof EN_TRANSLATIONS, so a missing
 * key fails at compile time.
 */
export const EN_TRANSLATIONS = {
  nav: {
    about: 'About',
    experience: 'Experience',
    work: 'Work',
    stack: 'Stack',
    contact: 'Contact',
  },
  header: {
    brand: 'Portfolio',
  },
  hero: {
    ctaWork: 'Selected work',
    ctaContact: 'Get in touch',
    openTo: 'open to {cities}',
    experience:
      '{years, plural, =0 {} one {# year} other {# years}} {months, plural, =0 {} one {# month} other {# months}} of production experience',
  },
  footer: {
    note: 'Danil Kovalev · Backend engineer · Rostov-on-Don',
  },
};
