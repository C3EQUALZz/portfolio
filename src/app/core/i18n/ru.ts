import type { EN_TRANSLATIONS } from './en';

/** UI chrome strings, Russian. Same shape as EN — enforced by the type. */
export const RU_TRANSLATIONS: typeof EN_TRANSLATIONS = {
  nav: {
    about: 'Обо мне',
    experience: 'Опыт',
    work: 'Проекты',
    stack: 'Стек',
    contact: 'Контакты',
  },
  header: {
    brand: 'Портфолио',
  },
  hero: {
    ctaWork: 'Выбранные проекты',
    ctaContact: 'Связаться',
    openTo: 'готов к переезду: {cities}',
    experience:
      '{years, plural, =0 {} one {# год} few {# года} many {# лет} other {# года}} {months, plural, =0 {} one {# месяц} few {# месяца} many {# месяцев} other {# месяца}} производственного опыта',
  },
  footer: {
    note: 'Данил Ковалёв · Backend-инженер · Ростов-на-Дону',
  },
};
