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
    stats: 'Статистика',
  },
  header: {
    menu: 'Меню',
    sections: 'Разделы',
    language: 'Язык',
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
  stats: {
    title: 'Статистика',
    subtitle:
      'Живые цифры с платформ, где я решаю задачи, — берутся из их публичных API прямо в браузере и кэшируются на час.',
    headline:
      '{count, plural, one {# решённая задача} few {# решённые задачи} many {# решённых задач} other {# решённых задач}} на всех платформах',
    loading:
      'Загружаем данные из внешнего сервиса — первый запрос может занять до минуты, пока API просыпается. Страница обновится сама, когда данные придут.',
    unavailableTitle: 'Статистика сейчас недоступна',
    unavailableNote:
      'Все источники данных этой платформы не ответили. Попробуйте ещё раз — обычно сервис оживает в течение минуты.',
    retry: 'Повторить',
    refresh: 'Обновить статистику',
    refreshing: 'Обновляем…',
    updatedAt: 'Обновлено {time}',
    cached: 'кэшированная копия',
    viewProfile: 'Открыть профиль',
    solved: 'решено',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    globalRank: 'Место в рейтинге',
    contestRating: 'Контестный рейтинг',
    languages: 'Языки',
    recentAccepted: 'Последние accepted',
    activity: 'Сабмиты за последний год',
    rating: 'Рейтинг',
    bestRating: 'Лучший рейтинг',
    rank: 'Звание',
    unrated: 'Пока без рейтинговых раундов',
    ratingHistory: 'История рейтинга',
    honor: 'Honor',
    kyuRank: 'Ранг',
    completedKata: 'Пройдено кат',
    leaderboard: 'Лидерборд',
    noData: 'Пока пусто',
  },
};
