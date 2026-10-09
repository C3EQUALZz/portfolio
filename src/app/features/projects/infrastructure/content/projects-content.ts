import type { ProjectDto } from './to-project';

/**
 * Maintained Python libraries. A typed literal,
 * not JSON over HTTP: the compiler checks it, no network, no prerender
 * breakage. Moving to the GitHub API means replacing one adapter.
 */
export const projectsContent: readonly ProjectDto[] = [
  {
    id: 'faststream-celery',
    name: 'faststream-celery',
    tagline: {
      en: 'A Celery-compatible broker for FastStream',
      ru: 'Брокер для FastStream с поддержкой протокола Celery',
    },
    description: {
      en: 'Async FastStream handlers consume tasks from Celery clients and publish tasks to Celery workers. Supports RabbitMQ, Redis and task results, so services can migrate from Celery one at a time.',
      ru: 'Асинхронные обработчики FastStream принимают задачи от клиентов Celery и отправляют задачи его воркерам. Поддерживает RabbitMQ, Redis и результаты задач, позволяя переносить сервисы с Celery по одному.',
    },
    repository: 'https://github.com/C3EQUALZz/faststream-celery',
    language: 'Python',
    kind: 'library',
    topics: [
      { en: 'FastStream', ru: 'FastStream' },
      { en: 'Celery', ru: 'Celery' },
      { en: 'Messaging', ru: 'Обмен сообщениями' },
    ],
  },
  {
    id: 'jobify-db',
    name: 'jobify-db',
    tagline: {
      en: 'Database storage backends for Jobify',
      ru: 'Хранилища в базах данных для Jobify',
    },
    description: {
      en: 'Stores Jobify tasks in PostgreSQL, MongoDB or MySQL. Accepts a connection string or an existing pool or client, and creates tables and collections on startup.',
      ru: 'Хранит задачи Jobify в PostgreSQL, MongoDB или MySQL. Принимает строку подключения либо готовый пул или клиент, создаёт таблицы и коллекции при запуске.',
    },
    repository: 'https://github.com/Jobify-Community/jobify-db',
    language: 'Python',
    kind: 'library',
    topics: [
      { en: 'Jobify', ru: 'Jobify' },
      { en: 'Databases', ru: 'Базы данных' },
    ],
  },
  {
    id: 'dishka-ag2',
    name: 'dishka-ag2',
    tagline: {
      en: 'Dependency injection for AG2 multi-agent apps',
      ru: 'Внедрение зависимостей для мультиагентных приложений AG2',
    },
    description: {
      en: 'Connects dishka to AG2: agents and tools receive dependencies from the container. Dependencies can be replaced in unit tests without changing the agent graph.',
      ru: 'Подключает dishka к AG2: агенты и инструменты получают зависимости из контейнера. В юнит-тестах зависимости можно подменить без изменений графа агентов.',
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
      en: 'Injects dependencies into Airflow DAGs and operators. Each task run has its own request scope for connections, clients and database sessions.',
      ru: 'Внедряет зависимости в DAG и операторы Airflow. У каждого запуска задачи свой request-скоуп для соединений, клиентов и сессий базы данных.',
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
      en: 'Dependency injection for Jobify tasks',
      ru: 'Внедрение зависимостей для задач Jobify',
    },
    description: {
      en: 'Runs each Jobify task in a separate dishka scope. Database sessions and clients are created for the task and closed when it finishes.',
      ru: 'Выполняет каждую задачу Jobify в отдельном скоупе dishka. Сессии базы данных и клиенты создаются для задачи и закрываются после её завершения.',
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
      en: 'Connects the dishka container to Flet applications. Views receive services through dependency injection, with a separate scope for each user session.',
      ru: 'Подключает контейнер dishka к приложениям Flet. Представления получают сервисы через внедрение зависимостей, у каждой пользовательской сессии свой скоуп.',
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
