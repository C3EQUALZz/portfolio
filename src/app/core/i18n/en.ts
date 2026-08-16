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
    certificates: 'Certificates',
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
  education: {
    title: 'Education',
    languagesTitle: 'Languages',
    native: 'Native',
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
  contact: {
    title: 'Open to Rust and Python backend roles',
    subtitle:
      'Full-time, on-site, in Rostov-on-Don or after a move to Moscow or St. Petersburg. Telegram is the fastest way to reach me.',
  },
  footer: {
    note: 'Danil Kovalev · Backend engineer · Rostov-on-Don',
  },
  certificates: {
    title: 'Certificates',
    subtitle:
      'Professional certifications, completed courses and hackathons — each entry opens the original document or the issuer verification page.',
    categories: {
      professional: 'Professional certifications',
      course: 'Courses',
      hackathon: 'Hackathons',
    },
    viewPdf: 'View certificate',
    verify: 'Verify on the issuer site',
    closeViewer: 'Close viewer',
    openExternal: 'Open in a new tab',
  },
};
