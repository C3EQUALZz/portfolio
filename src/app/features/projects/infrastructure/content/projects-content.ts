import type { ProjectDto } from './to-project';

/**
 * The four dishka integrations from the Nocturne template. A typed literal,
 * not JSON over HTTP: the compiler checks it, no network, no prerender
 * breakage. Moving to the GitHub API means replacing one adapter.
 */
export const projectsContent: readonly ProjectDto[] = [
  {
    id: 'dishka-ag2',
    name: 'dishka-ag2',
    tagline: {
      en: 'Dependency injection for AG2 multi-agent apps',
      ru: 'Внедрение зависимостей для мультиагентных приложений AG2',
    },
    description: {
      en: 'Container integration for AG2 multi-agent applications: agents and tools receive their dependencies from dishka instead of holding module-level globals, so an agent graph stays unit-testable.',
      ru: 'Интеграция контейнера с мультиагентными приложениями AG2: агенты и инструменты получают зависимости из dishka вместо глобальных переменных уровня модуля, поэтому граф агентов остаётся тестируемым юнит-тестами.',
    },
    repository: 'https://github.com/C3EQUALZz/dishka-ag2',
    language: 'Python',
    kind: 'library',
    topics: [
      { en: 'DI', ru: 'DI' },
      { en: 'Agents', ru: 'Агенты' },
    ],
  },
  {
    id: 'dishka-airflow',
    name: 'dishka-airflow',
    tagline: {
      en: 'Dependency injection for Airflow',
      ru: 'Внедрение зависимостей для Airflow',
    },
    description: {
      en: 'DI for Airflow DAGs and operators — a request scope per task run, so pipeline code declares what it needs and the container resolves connections, clients and sessions around it.',
      ru: 'DI для DAG’ов и операторов Airflow — request-скоуп на каждый запуск задачи: код пайплайна объявляет, что ему нужно, а контейнер разрешает соединения, клиенты и сессии вокруг него.',
    },
    repository: 'https://github.com/C3EQUALZz/dishka-airflow',
    language: 'Python',
    kind: 'library',
    topics: [
      { en: 'DI', ru: 'DI' },
      { en: 'Data pipelines', ru: 'Пайплайны данных' },
    ],
  },
  {
    id: 'dishka-jobify',
    name: 'dishka-jobify',
    tagline: {
      en: 'Scoped DI for background jobs',
      ru: 'Скоупированный DI для фоновых задач',
    },
    description: {
      en: 'Background jobs with a proper lifetime: each job runs inside its own container scope, so sessions and clients are opened and closed with the job rather than leaked across the worker.',
      ru: 'Фоновые задачи с правильным временем жизни: каждая задача выполняется в собственном скоупе контейнера, поэтому сессии и клиенты открываются и закрываются вместе с задачей, а не утекают по воркеру.',
    },
    repository: 'https://github.com/C3EQUALZz/dishka-jobify',
    language: 'Python',
    kind: 'library',
    topics: [
      { en: 'DI', ru: 'DI' },
      { en: 'Workers', ru: 'Воркеры' },
    ],
  },
  {
    id: 'dishka-flet',
    name: 'dishka-flet',
    tagline: {
      en: 'Dependency injection for Flet apps',
      ru: 'Внедрение зависимостей для приложений Flet',
    },
    description: {
      en: 'The same container model on the client side of Flet: a scope per user session, so UI views resolve services the way a backend handler does — one architecture across the stack.',
      ru: 'Та же модель контейнера на клиентской стороне Flet: скоуп на пользовательскую сессию, поэтому UI-представления разрешают сервисы так же, как backend-обработчик, — одна архитектура на весь стек.',
    },
    repository: 'https://github.com/C3EQUALZz/dishka-flet',
    language: 'Python',
    kind: 'library',
    topics: [
      { en: 'DI', ru: 'DI' },
      { en: 'UI', ru: 'UI' },
    ],
  },
];
