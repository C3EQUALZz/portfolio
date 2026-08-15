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
  experience: {
    title: '{years, plural, one {# year} other {# years}} of taking the slow path out',
    subtitle:
      'Each role has been a rewrite of something that had stopped scaling — a monolith, a hand-rolled WebSocket server, a SaaS monitoring bill.',
    present: 'now',
    duration:
      '{years, plural, =0 {} one {# year} other {# years}} {months, plural, =0 {} one {# month} other {# months}}',
    engagement: {
      'on-site': 'on-site',
      remote: 'remote',
      hybrid: 'hybrid',
      outstaff: 'outstaff',
    },
  },
  stack: {
    title: 'What I reach for',
  },
  work: {
    title: 'Open source: dishka integrations',
    subtitlePre:
      'Dependency injection is the part of a Python service that decides how testable the rest of it will be. I use ',
    subtitlePost:
      ' in production, and where a framework had no container integration I wrote and published one — each library carries the same scope model, its own tests and packaging.',
    kind: {
      library: 'library',
      application: 'application',
      tool: 'tool',
    },
  },
  footer: {
    note: 'Danil Kovalev · Backend engineer · Rostov-on-Don',
  },
};
