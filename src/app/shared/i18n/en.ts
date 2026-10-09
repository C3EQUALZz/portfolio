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
    stats: 'Stats',
  },
  header: {
    menu: 'Menu',
    sections: 'Sections',
    language: 'Language',
    brand: 'Portfolio',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
  },
  hero: {
    ctaWork: 'Selected work',
    ctaContact: 'Get in touch',
    openTo: 'open to {cities}',
    experience:
      '{years, plural, =0 {} one {# year} other {# years}} {months, plural, =0 {} one {# month} other {# months}} of production experience',
  },
  experience: {
    title: 'Backend development',
    subtitle: 'An AppSec platform, an AI assistant for CDEK and a corporate messenger.',
    companies: { nissva: 'nissva' },
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
    title: 'Python libraries',
    subtitle: 'Task messaging, database storage and dependency injection integrations.',
    contributionsIntro: 'I also contribute pull requests to',
    contributionsAnd: 'and',
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
  stats: {
    title: 'Coding stats',
    subtitle:
      'Live numbers from the platforms I practise on — fetched from their public APIs right in your browser and cached for an hour.',
    headline:
      '{count, plural, one {# problem solved} other {# problems solved}} across all platforms',
    loading:
      'Fetching data from the external service — the first request can take up to a minute while the API instance wakes up. The page updates by itself when the data arrives.',
    unavailableTitle: 'Stats unavailable right now',
    unavailableNote:
      'Every data source for this platform failed to answer. Try again — the service usually recovers within a minute.',
    retry: 'Try again',
    refresh: 'Refresh stats',
    refreshing: 'Refreshing…',
    updatedAt: 'Updated {time}',
    cached: 'cached copy',
    viewProfile: 'Open profile',
    solved: 'solved',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    globalRank: 'Global rank',
    contestRating: 'Contest rating',
    languages: 'Top languages',
    recentAccepted: 'Recently accepted',
    activity: 'Submissions over the last year',
    rating: 'Rating',
    bestRating: 'Best rating',
    rank: 'Rank',
    unrated: 'No rated contests yet',
    ratingHistory: 'Rating history',
    honor: 'Honor',
    kyuRank: 'Rank',
    completedKata: 'Completed kata',
    leaderboard: 'Leaderboard',
    noData: 'Nothing here yet',
  },
};
