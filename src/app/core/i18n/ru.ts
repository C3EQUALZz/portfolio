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
  footer: {
    note: 'Данил Ковалёв · Backend-инженер · Ростов-на-Дону',
  },
};
