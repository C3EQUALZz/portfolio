import type { EN_TRANSLATIONS } from './en';

/** UI chrome strings, Russian. Same shape as EN — enforced by the type. */
export const RU_TRANSLATIONS: typeof EN_TRANSLATIONS = {
  nav: {
    about: 'Обо мне',
    experience: 'Опыт',
    work: 'Проекты',
    stack: 'Стек',
    contact: 'Контакты',
    certificates: 'Сертификаты',
  },
  header: {
    brand: 'Портфолио',
    themeToLight: 'Переключиться на светлую тему',
    themeToDark: 'Переключиться на тёмную тему',
  },
  hero: {
    ctaWork: 'Выбранные проекты',
    ctaContact: 'Связаться',
    openTo: 'готов к переезду: {cities}',
    experience:
      '{years, plural, =0 {} one {# год} few {# года} many {# лет} other {# года}} {months, plural, =0 {} one {# месяц} few {# месяца} many {# месяцев} other {# месяца}} производственного опыта',
  },
  experience: {
    title:
      '{years, plural, one {# год} few {# года} many {# лет} other {# года}} пути «медленно, но надёжно»',
    subtitle:
      'Каждая роль — переписывание того, что перестало масштабироваться: монолита, самописного WebSocket-сервера, счёта за SaaS-мониторинг.',
    present: 'сейчас',
    duration:
      '{years, plural, =0 {} one {# год} few {# года} many {# лет} other {# года}} {months, plural, =0 {} one {# месяц} few {# месяца} many {# месяцев} other {# месяца}}',
    engagement: {
      'on-site': 'офис',
      remote: 'удалённо',
      hybrid: 'гибрид',
      outstaff: 'аутстафф',
    },
  },
  stack: {
    title: 'Чем я пользуюсь',
  },
  education: {
    title: 'Образование',
    languagesTitle: 'Языки',
    native: 'Родной',
  },
  work: {
    title: 'Open source: интеграции dishka',
    subtitlePre:
      'Внедрение зависимостей — та часть Python-сервиса, которая решает, насколько тестируемым будет всё остальное. Я использую ',
    subtitlePost:
      ' в проде, а там, где у фреймворка не было интеграции с контейнером, я написал и опубликовал её — у каждой библиотеки та же модель скоупов, свои тесты и упаковка.',
    kind: {
      library: 'библиотека',
      application: 'приложение',
      tool: 'инструмент',
    },
  },
  contact: {
    title: 'Открыт к backend-ролям на Rust и Python',
    subtitle:
      'Полная занятость, офис в Ростове-на-Дону или после переезда в Москву или Санкт-Петербург. Быстрее всего написать в Telegram.',
  },
  footer: {
    note: 'Данил Ковалёв · Backend-инженер · Ростов-на-Дону',
  },
  certificates: {
    title: 'Сертификаты',
    subtitle:
      'Профессиональные сертификаты, пройденные курсы и хакатоны — каждая запись открывает оригинал документа или страницу проверки на сайте издателя.',
    categories: {
      professional: 'Профессиональные сертификаты',
      course: 'Курсы',
      hackathon: 'Хакатоны',
    },
    viewPdf: 'Смотреть сертификат',
    verify: 'Проверить на сайте издателя',
    closeViewer: 'Закрыть просмотр',
    openExternal: 'Открыть в новой вкладке',
  },
};
