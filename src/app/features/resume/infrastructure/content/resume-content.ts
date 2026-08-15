import type { ResumeContentDto } from './to-resume';

/**
 * The resume content as a typed literal. Validated by the compiler and by the
 * "content parses" spec — no network, no JSON, no broken prerender.
 */
export const resumeContent: ResumeContentDto = {
  person: {
    name: 'Danil Kovalev',
    headline: { en: 'Backend engineer building', ru: 'Backend-инженер, создающий' },
    roleHeadlines: [
      { en: 'high-load Rust services', ru: 'высоконагруженные сервисы на Rust' },
      {
        en: 'distributed systems that hold',
        ru: 'распределённые системы, которые держат нагрузку',
      },
      { en: 'AppSec analysis platforms', ru: 'платформы AppSec-анализа' },
      { en: 'AI assistants people use', ru: 'AI-ассистенты, которыми пользуются' },
    ],
    summary: {
      en: 'Across security tooling, AI assistants and microservice platforms — mostly the unglamorous parts that decide whether a system holds: async architecture, message transport, observability and the quality gates around them. Rust and Python, self-hosted infrastructure, and a habit of deleting the legacy path rather than working around it.',
      ru: 'Инструменты безопасности, AI-ассистенты и микросервисные платформы — в основном та незаметная часть, которая решает, выдержит ли система: асинхронная архитектура, транспорт сообщений, наблюдаемость и гейты качества вокруг них. Rust и Python, self-hosted инфраструктура и привычка удалять legacy-путь вместо того, чтобы обходить его.',
    },
  },
  availability: {
    status: 'open',
    base: { en: 'Rostov-on-Don', ru: 'Ростов-на-Дону' },
    relocatesTo: [
      { en: 'Moscow', ru: 'Москва' },
      { en: 'St. Petersburg', ru: 'Санкт-Петербург' },
    ],
    employment: { en: 'Full-time, on-site', ru: 'Полная занятость, офис' },
  },
  experiences: [
    {
      id: 'spetsvuz',
      start: [2025, 12],
      end: 'present',
      position: { en: 'Middle Developer', ru: 'Middle-разработчик' },
      company: { name: 'SRI Spetsvuzavtomatika' },
      product: {
        en: 'Automated SAST/DAST analysis platform for Android applications — backend, infrastructure and AppSec integrations.',
        ru: 'Платформа автоматизированного SAST/DAST-анализа Android-приложений — бэкенд, инфраструктура и AppSec-интеграции.',
      },
      engagement: 'on-site',
      impacts: [
        {
          label: {
            en: 'Analysis throughput after the Rust rewrite',
            ru: 'Пропускная способность анализа после переписывания на Rust',
          },
          kind: 'numeric',
          amount: 4,
          unit: 'times',
          direction: 'increase',
        },
        {
          label: {
            en: 'To locate an incident across the DAST log volume',
            ru: 'На поиск инцидента по всему объёму логов DAST',
          },
          kind: 'literal',
          text: { en: 'seconds', ru: 'секунды' },
        },
        {
          label: {
            en: 'Realtime scaling, connections in their own layer',
            ru: 'Масштабирование realtime, соединения в отдельном слое',
          },
          kind: 'literal',
          text: { en: 'horizontal', ru: 'горизонтальное' },
        },
        {
          label: {
            en: 'Where UB and races now fail, not in production',
            ru: 'Где теперь ловятся UB и гонки — не в проде',
          },
          kind: 'literal',
          text: { en: 'compile-time', ru: 'на компиляции' },
        },
      ],
      achievements: [
        {
          lead: { en: 'Rebuilt the DAST architecture', ru: 'Перестроил архитектуру DAST' },
          detail: {
            en: 'moved the analysis pipeline off a Django + Celery monolith onto async Rust (Axum, Tokio, independent workers), multiplying throughput at a fraction of the runtime overhead and retiring the technical debt with it.',
            ru: 'перенёс конвейер анализа с монолита на Django + Celery на асинхронный Rust (Axum, Tokio, независимые воркеры), увеличив пропускную способность в разы при меньших накладных расходах и закрыв техдолг.',
          },
        },
        {
          lead: { en: 'Decomposed the realtime bottleneck', ru: 'Разложил узкое место realtime' },
          detail: {
            en: 'replaced the hand-written WebSocket servers with Centrifugo, isolating connection management so realtime scales horizontally without touching backend services.',
            ru: 'заменил самописные WebSocket-серверы на Centrifugo, изолировав управление соединениями: realtime масштабируется горизонтально, не трогая бэкенд-сервисы.',
          },
        },
        {
          lead: { en: 'Built observability from zero', ru: 'Построил наблюдаемость с нуля' },
          detail: {
            en: 'Prometheus, Grafana, Vector and Tempo across the analysis pipelines, with ElasticSearch for full-text search over the DAST log volume: incidents are found in seconds and anomalies surface on their own.',
            ru: 'Prometheus, Grafana, Vector и Tempo по всем конвейерам анализа, ElasticSearch для полнотекстового поиска по логам DAST: инциденты находятся за секунды, аномалии всплывают сами.',
          },
        },
        {
          lead: {
            en: 'Found a cheaper way to read an APK',
            ru: 'Нашёл более дешёвый способ читать APK',
          },
          detail: {
            en: 'researched extraction that skips full reverse-engineering through apktool, cutting a whole fragile stage out of the product and weeks out of the schedule.',
            ru: 'исследовал извлечение данных без полного реверс-инжиниринга через apktool, убрав из продукта целый хрупкий этап и недели из графика.',
          },
        },
        {
          lead: { en: 'Set the quality floor', ru: 'Задал уровень качества' },
          detail: {
            en: 'Keycloak + oauth2-proxy for central auth instead of home-grown user logic; Clippy, rustfmt, cargo-deny and pre-commit in CI; sccache/mold for fast local builds; AGENTS.md so AI agents work the codebase safely. Whole classes of bug — UB, races — now fail at compile time.',
            ru: 'Keycloak + oauth2-proxy для центральной аутентификации вместо самописной логики пользователей; Clippy, rustfmt, cargo-deny и pre-commit в CI; sccache/mold для быстрых локальных сборок; AGENTS.md, чтобы AI-агенты работали с кодовой базой безопасно. Целые классы багов — UB, гонки — теперь падают на компиляции.',
          },
        },
      ],
      technologies: [
        { technologies: ['Rust'], emphasis: 'lead' },
        { technologies: ['Axum', 'Tokio', 'SQLx'], emphasis: 'lead' },
        { technologies: ['PostgreSQL', 'Redis', 'RabbitMQ'], emphasis: 'supporting' },
        { technologies: ['MinIO', 'Centrifugo', 'Kong'], emphasis: 'supporting' },
        { technologies: ['Frida', 'Androguard', 'YARA'], emphasis: 'supporting' },
        { technologies: ['Vector', 'Tempo', 'Grafana'], emphasis: 'supporting' },
      ],
    },
    {
      id: 'iktin',
      start: [2025, 6],
      end: [2025, 12],
      position: { en: 'Backend Developer', ru: 'Backend-разработчик' },
      company: { name: 'Iktin Group' },
      product: {
        en: '«Elya» — an AI assistant for CDEK franchisees, shipped as an official CDEK integration module.',
        ru: '«Эля» — AI-ассистент для франчайзи СДЭК, выпущенный как официальный модуль интеграции СДЭК.',
      },
      engagement: 'remote',
      impacts: [
        {
          label: {
            en: 'Manager load, once RAG answered the routine requests',
            ru: 'Нагрузка на менеджеров после того, как RAG закрыл рутинные запросы',
          },
          kind: 'numeric',
          amount: 40,
          unit: 'percent',
          direction: 'decrease',
        },
        {
          label: {
            en: 'Key operation time — rewritten SQL plus Redis caching',
            ru: 'Время ключевой операции — переписанный SQL плюс кэширование в Redis',
          },
          kind: 'numeric',
          amount: 30,
          unit: 'percent',
          direction: 'decrease',
        },
        {
          label: {
            en: "Waybill creation — the product's headline feature",
            ru: 'Создание накладных — визитная функция продукта',
          },
          kind: 'literal',
          text: { en: 'voice', ru: 'голосом' },
        },
        {
          label: {
            en: 'CDEK integration module, published in their catalogue',
            ru: 'Модуль интеграции СДЭК, опубликованный в их каталоге',
          },
          kind: 'literal',
          text: { en: 'official', ru: 'официальный' },
        },
      ],
      achievements: [
        {
          lead: {
            en: 'Designed the RAG answering system',
            ru: 'Спроектировал RAG-систему ответов',
          },
          detail: {
            en: '(LangChain, ChromaDB, GigaChat) that closes routine requests without a human — manager load fell 40%.',
            ru: '(LangChain, ChromaDB, GigaChat), закрывающую рутинные запросы без человека — нагрузка на менеджеров упала на 40%.',
          },
        },
        {
          lead: {
            en: 'Built the speech-recognition library',
            ru: 'Построил библиотеку распознавания речи',
          },
          detail: {
            en: "(SaluteSpeech) behind voice-created waybills — the product's headline feature — and set up Label Studio so managers annotate their own data.",
            ru: '(SaluteSpeech) для голосового создания накладных — визитной функции продукта — и настроил Label Studio, чтобы менеджеры размечали данные сами.',
          },
        },
        {
          lead: {
            en: 'Moved a legacy codebase to Clean Architecture',
            ru: 'Перенёс legacy-кодовую базу на Clean Architecture',
          },
          detail: {
            en: 'event-driven messaging and DI (dishka), and started the Celery → FastStream migration so inter-service communication is typed rather than hopeful.',
            ru: 'событийный обмен сообщениями и DI (dishka), начал миграцию Celery → FastStream, чтобы межсервисное взаимодействие было типизированным, а не «надеждой».',
          },
        },
        {
          lead: {
            en: 'Cut key operation time ~30%',
            ru: 'Сократил время ключевой операции на ~30%',
          },
          detail: {
            en: 'by rewriting the critical SQL and adding Redis caching; refactored the user service under unit tests; added ruff, mypy and semgrep, moved the project to uv, and hardened infrastructure with automatic backups and TLS for PostgreSQL.',
            ru: 'переписав критичный SQL и добавив кэширование в Redis; отрефакторил пользовательский сервис под юнит-тестами; добавил ruff, mypy и semgrep, перевёл проект на uv, укрепил инфраструктуру автоматическими бэкапами и TLS для PostgreSQL.',
          },
        },
      ],
      technologies: [
        { technologies: ['Python 3.12'], emphasis: 'lead' },
        { technologies: ['FastAPI', 'FastStream'], emphasis: 'lead' },
        { technologies: ['LangChain', 'ChromaDB', 'GigaChat'], emphasis: 'supporting' },
        { technologies: ['dishka', 'Pydantic', 'SQLAlchemy'], emphasis: 'supporting' },
        { technologies: ['PostgreSQL', 'MongoDB', 'Redis'], emphasis: 'supporting' },
        { technologies: ['Traefik', 'Loki', 'Sentry'], emphasis: 'supporting' },
      ],
    },
    {
      id: 'ecom-tech',
      start: [2022, 9],
      end: [2024, 12],
      position: { en: 'Python Backend Developer', ru: 'Python backend-разработчик' },
      company: { name: 'Ecom.tech' },
      product: {
        en: 'A corporate messenger built from scratch for pickup-point staff — an open-source alternative to Mattermost, on microservices. Full cycle: API design through production and observability.',
        ru: 'Корпоративный мессенджер с нуля для сотрудников пунктов выдачи — open-source альтернатива Mattermost на микросервисах. Полный цикл: от проектирования API до прода и наблюдаемости.',
      },
      engagement: 'outstaff',
      impacts: [
        {
          label: {
            en: 'Fan-out throughput after the Centrifugo layer',
            ru: 'Пропускная способность fan-out после слоя Centrifugo',
          },
          kind: 'numeric',
          amount: 50,
          unit: 'percent',
          direction: 'increase',
        },
        {
          label: {
            en: 'Dropped connections — the reason Mattermost was dropped',
            ru: 'Обрывы соединений — причина, по которой отказались от Mattermost',
          },
          kind: 'numeric',
          amount: 40,
          unit: 'percent',
          direction: 'decrease',
        },
        {
          label: {
            en: 'Incident MTTR on the self-hosted monitoring stack',
            ru: 'MTTR инцидентов на self-hosted стеке мониторинга',
          },
          kind: 'numeric',
          amount: 50,
          unit: 'percent',
          direction: 'decrease',
        },
        {
          label: {
            en: 'Microservices covered by metrics and traces',
            ru: 'Микросервисов покрыто метриками и трейсами',
          },
          kind: 'numeric',
          amount: 100,
          unit: 'percent',
          direction: 'absolute',
        },
      ],
      achievements: [
        {
          lead: {
            en: 'Laid out the microservice landscape',
            ru: 'Развернул микросервисный ландшафт',
          },
          detail: {
            en: 'REST, GraphQL and gRPC contracts, Kong as the gateway for routing, rate-limiting and central auth, RabbitMQ/Kafka for async work, so auth, chat and notification evolve and scale independently.',
            ru: 'REST, GraphQL и gRPC контракты, Kong как шлюз для роутинга, rate-limiting и центральной аутентификации, RabbitMQ/Kafka для асинхронной работы — auth, чат и уведомления развиваются и масштабируются независимо.',
          },
        },
        {
          lead: {
            en: 'Moved WebSocket connections into a dedicated Centrifugo layer',
            ru: 'Вынес WebSocket-соединения в отдельный слой Centrifugo',
          },
          detail: {
            en: '(pub/sub): fan-out throughput up ~50%, dropped connections down ~40%, and the delivery instability that made the team abandon Mattermost in the first place was gone.',
            ru: '(pub/sub): пропускная способность fan-out выросла на ~50%, обрывы соединений упали на ~40%, а нестабильность доставки, из-за которой команда когда-то отказалась от Mattermost, исчезла.',
          },
        },
        {
          lead: { en: 'Migrated monitoring off SaaS', ru: 'Перенёс мониторинг с SaaS' },
          detail: {
            en: 'onto Prometheus, Loki and Grafana with OpenTelemetry tracing and Sentry — coverage to 100%, MTTR down ~50%, the subscription bill to zero.',
            ru: 'на Prometheus, Loki и Grafana с трейсингом OpenTelemetry и Sentry — покрытие до 100%, MTTR ниже на ~50%, счёт за подписку — до нуля.',
          },
        },
        {
          lead: { en: 'Made the logs machine-readable', ru: 'Сделал логи машиночитаемыми' },
          detail: {
            en: 'structlog JSON with trace_id and request_id threaded through every service, so Loki can aggregate and alert; root-cause search ~30% faster. Also shipped the LLM services (OpenAI API) that put assistants inside the messenger.',
            ru: 'structlog JSON с trace_id и request_id, прошитыми через каждый сервис, чтобы Loki мог агрегировать и алертить; поиск первопричины быстрее на ~30%. Плюс запустил LLM-сервисы (OpenAI API), встроившие ассистентов в мессенджер.',
          },
        },
      ],
      technologies: [
        { technologies: ['Python 3', 'FastAPI'], emphasis: 'lead' },
        { technologies: ['Strawberry GraphQL', 'gRPC'], emphasis: 'lead' },
        { technologies: ['Kafka', 'RabbitMQ', 'Celery'], emphasis: 'supporting' },
        { technologies: ['Kong', 'Nginx', 'Docker'], emphasis: 'supporting' },
        { technologies: ['OpenTelemetry', 'Loki', 'Sentry'], emphasis: 'supporting' },
        { technologies: ['pytest', 'testcontainers'], emphasis: 'supporting' },
      ],
    },
  ],
  skillGroups: [
    {
      title: { en: 'Languages & runtime', ru: 'Языки и рантайм' },
      entries: [
        { technology: 'Rust', emphasis: 'lead' },
        { technology: 'Python', emphasis: 'lead' },
        { technology: 'Tokio', emphasis: 'lead' },
        { technology: 'Serde', emphasis: 'lead' },
        { technology: 'asyncio', emphasis: 'supporting' },
        { technology: 'Java', emphasis: 'lead' },
      ],
    },
    {
      title: { en: 'Data & transport', ru: 'Данные и транспорт' },
      entries: [
        { technology: 'PostgreSQL', emphasis: 'lead' },
        { technology: 'Redis', emphasis: 'lead' },
        { technology: 'Kafka', emphasis: 'lead' },
        { technology: 'RabbitMQ', emphasis: 'lead' },
        { technology: 'NATS', emphasis: 'lead' },
        { technology: 'MongoDB', emphasis: 'lead' },
        { technology: 'gRPC', emphasis: 'supporting' },
        { technology: 'ELK stack', emphasis: 'supporting' },
        { technology: 'S3 / MinIO', emphasis: 'supporting' },
      ],
    },
    {
      title: { en: 'Platform & observability', ru: 'Платформа и наблюдаемость' },
      entries: [
        { technology: 'Docker', emphasis: 'lead' },
        { technology: 'Kubernetes', emphasis: 'lead' },
        { technology: 'Linux', emphasis: 'supporting' },
        { technology: 'Grafana stack', emphasis: 'supporting' },
        { technology: 'Sentry', emphasis: 'supporting' },
        { technology: 'OpenTelemetry', emphasis: 'supporting' },
        { technology: 'GitLab CI', emphasis: 'supporting' },
        { technology: 'GitHub Actions', emphasis: 'supporting' },
        { technology: 'Docker Compose', emphasis: 'supporting' },
        { technology: 'Vector', emphasis: 'supporting' },
        { technology: 'SonarQube', emphasis: 'supporting' },
        { technology: 'CodeRabbit', emphasis: 'supporting' },
        { technology: 'zizmor', emphasis: 'supporting' },
        { technology: 'just', emphasis: 'supporting' },
      ],
    },
    {
      title: { en: 'Frameworks & libraries', ru: 'Фреймворки и библиотеки' },
      entries: [
        { technology: 'Axum', emphasis: 'supporting' },
        { technology: 'FastAPI', emphasis: 'lead' },
        { technology: 'FastStream', emphasis: 'supporting' },
        { technology: 'Spring', emphasis: 'lead' },
        { technology: 'Hibernate', emphasis: 'supporting' },
        { technology: 'MapStruct', emphasis: 'supporting' },
        { technology: 'SQLAlchemy', emphasis: 'lead' },
        { technology: 'Pydantic', emphasis: 'supporting' },
        { technology: 'dishka', emphasis: 'lead' },
        { technology: 'LangChain', emphasis: 'supporting' },
        { technology: 'AG2', emphasis: 'lead' },
        { technology: 'pytest', emphasis: 'supporting' },
        { technology: 'testcontainers', emphasis: 'supporting' },
        { technology: 'aiogram', emphasis: 'supporting' },
        { technology: 'httpx', emphasis: 'supporting' },
        { technology: 'Flet', emphasis: 'supporting' },
        { technology: 'taskiq', emphasis: 'supporting' },
        { technology: 'Celery', emphasis: 'supporting' },
        { technology: 'SQLx', emphasis: 'supporting' },
        { technology: 'adaptix', emphasis: 'supporting' },
        { technology: 'dature', emphasis: 'supporting' },
      ],
    },
    {
      title: { en: 'Practice', ru: 'Практики' },
      entries: [
        { technology: 'Distributed systems', emphasis: 'supporting' },
        { technology: 'Microservices', emphasis: 'supporting' },
        { technology: 'Telegram bots & integrations', emphasis: 'supporting' },
        { technology: 'AppSec tooling', emphasis: 'supporting' },
        { technology: 'RAG / LLM integration', emphasis: 'supporting' },
        { technology: 'LLM agents', emphasis: 'supporting' },
        { technology: 'Desktop applications', emphasis: 'supporting' },
      ],
    },
  ],
  highlights: [
    {
      topic: 'architecture',
      text: {
        en: 'I work from DDD, Clean Architecture and event-driven design, go deep on observability — OpenTelemetry and the Grafana stack — and spend real time optimising legacy rather than routing around it.',
        ru: 'Работаю от DDD, Clean Architecture и событийного дизайна, глубоко в observability — OpenTelemetry и стек Grafana — и трачу реальное время на оптимизацию legacy, а не на обходные пути.',
      },
    },
    {
      topic: 'open-source',
      text: {
        en: 'I contribute to the Python open-source ecosystem: I build and maintain integrations between the dishka DI container and popular frameworks.',
        ru: 'Вношу вклад в open-source экосистему Python: создаю и поддерживаю интеграции DI-контейнера dishka с популярными фреймворками.',
      },
    },
    {
      topic: 'collaboration',
      text: {
        en: 'I take part in code review and architecture discussions, and use AI tooling — Cursor, Claude Code — as part of daily development to shorten the delivery cycle.',
        ru: 'Участвую в код-ревью и архитектурных обсуждениях, использую AI-инструменты — Cursor, Claude Code — в ежедневной разработке, чтобы сокращать цикл поставки.',
      },
    },
  ],
  education: [
    {
      institution: {
        en: 'Don State Technical University',
        ru: 'Донской государственный технический университет',
      },
      program: {
        en: 'Computer Security, Institute of Informatics & Computing',
        ru: 'Компьютерная безопасность, Институт информатики и вычислительной техники',
      },
      city: { en: 'Rostov-on-Don', ru: 'Ростов-на-Дону' },
      graduationYear: 2028,
    },
  ],
  languages: [
    { language: { en: 'Russian', ru: 'Русский' }, level: 'native' },
    { language: { en: 'English', ru: 'Английский' }, level: 'b2' },
  ],
  credentials: [
    {
      title: { en: 'Astra Linux AL-1702', ru: 'Astra Linux AL-1702' },
      issuer: { en: 'Astra Linux', ru: 'Astra Linux' },
    },
    {
      title: { en: 'Astra Linux AL-1703', ru: 'Astra Linux AL-1703' },
      issuer: { en: 'Astra Linux', ru: 'Astra Linux' },
    },
    { title: { en: 'Hack 2025 (CTF)', ru: 'Hack 2025 (CTF)' }, year: 2025 },
    {
      title: { en: 'Seven Stepik programmes', ru: 'Семь программ Stepik' },
      issuer: { en: 'Stepik', ru: 'Stepik' },
    },
  ],
};
