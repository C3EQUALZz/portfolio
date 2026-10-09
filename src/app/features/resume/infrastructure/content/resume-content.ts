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
        en: 'distributed systems',
        ru: 'распределённые системы',
      },
      { en: 'AppSec analysis platforms', ru: 'платформы AppSec-анализа' },
      { en: 'AI assistants', ru: 'AI-ассистенты' },
    ],
    summary: {
      en: 'I build backend services in Rust and Python for security tooling, AI assistants and messaging platforms. My work includes async architecture, message transport, monitoring and CI. I also maintain Python libraries for FastStream, Jobify and dishka.',
      ru: 'Разрабатываю backend на Rust и Python для AppSec-платформ, AI-ассистентов и мессенджеров. Занимаюсь асинхронной архитектурой, обменом сообщениями, мониторингом и CI. Поддерживаю Python-библиотеки для FastStream, Jobify и dishka.',
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
      end: [2026, 8],
      position: { en: 'Middle Developer', ru: 'Middle-разработчик' },
      company: { name: 'ФГАНУ НИИ Спецвузавтоматика' },
      product: {
        en: 'Automated SAST/DAST analysis of Android applications. Backend development, infrastructure and AppSec integrations.',
        ru: 'Автоматизированный SAST/DAST-анализ Android-приложений. Разработка backend, инфраструктура и AppSec-интеграции.',
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
            en: 'Realtime scaling with Centrifugo',
            ru: 'Масштабирование realtime с Centrifugo',
          },
          kind: 'literal',
          text: { en: 'horizontal', ru: 'по горизонтали' },
        },
        {
          label: {
            en: 'Memory safety checks in Rust',
            ru: 'Проверки безопасности памяти в Rust',
          },
          kind: 'literal',
          text: { en: 'compile-time', ru: 'на компиляции' },
        },
      ],
      achievements: [
        {
          lead: { en: 'Rebuilt the DAST architecture', ru: 'Перестроил архитектуру DAST' },
          detail: {
            en: 'migrated the analysis pipeline from Django and Celery to async Rust with Axum, Tokio and independent workers. Throughput increased fourfold, with lower runtime overhead.',
            ru: 'перенёс конвейер анализа с Django и Celery на асинхронный Rust: Axum, Tokio и независимые воркеры. Пропускная способность выросла в четыре раза, накладные расходы снизились.',
          },
        },
        {
          lead: { en: 'Replaced the WebSocket servers', ru: 'Заменил WebSocket-серверы' },
          detail: {
            en: 'moved connection management from custom WebSocket servers to Centrifugo. The connection layer now scales horizontally, independently of backend services.',
            ru: 'перенёс управление соединениями из самописных WebSocket-серверов в Centrifugo. Слой соединений масштабируется горизонтально, независимо от backend-сервисов.',
          },
        },
        {
          lead: { en: 'Built observability from zero', ru: 'Построил наблюдаемость с нуля' },
          detail: {
            en: 'set up Prometheus, Grafana, Vector and Tempo for the analysis pipelines, and Elasticsearch for DAST logs. Full-text search locates incidents in seconds; monitoring detects anomalies automatically.',
            ru: 'настроил Prometheus, Grafana, Vector и Tempo для конвейеров анализа, Elasticsearch для логов DAST. Полнотекстовый поиск находит инциденты за секунды, мониторинг автоматически выявляет аномалии.',
          },
        },
        {
          lead: {
            en: 'Simplified APK data extraction',
            ru: 'Упростил извлечение данных из APK',
          },
          detail: {
            en: 'researched data extraction without full reverse-engineering through apktool. Removed an unreliable processing stage and saved weeks of development.',
            ru: 'исследовал извлечение данных без полного реверс-инжиниринга через apktool. Убрал ненадёжный этап обработки и сократил разработку на несколько недель.',
          },
        },
        {
          lead: {
            en: 'Set up authentication and code checks',
            ru: 'Настроил аутентификацию и проверки кода',
          },
          detail: {
            en: 'centralized authentication with Keycloak and oauth2-proxy. Added Clippy, rustfmt, cargo-deny and pre-commit to CI, accelerated local builds with sccache and mold, and documented agent workflows in AGENTS.md. Rust checks memory ownership and data races at compile time.',
            ru: 'централизовал аутентификацию через Keycloak и oauth2-proxy. Добавил Clippy, rustfmt, cargo-deny и pre-commit в CI, ускорил локальные сборки с sccache и mold, описал работу AI-агентов в AGENTS.md. Rust проверяет владение памятью и гонки данных при компиляции.',
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
        en: 'Elya, an AI assistant for CDEK franchisees. Published as an official CDEK integration module.',
        ru: '«Эля», AI-ассистент для франчайзи СДЭК. Опубликован как официальный модуль интеграции СДЭК.',
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
            en: 'Key operation time after SQL optimisation and Redis caching',
            ru: 'Время ключевой операции после оптимизации SQL и кэширования в Redis',
          },
          kind: 'numeric',
          amount: 30,
          unit: 'percent',
          direction: 'decrease',
        },
        {
          label: {
            en: 'Waybill creation',
            ru: 'Создание накладных',
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
            en: 'using LangChain, ChromaDB and GigaChat. It answers routine requests automatically, reducing manager workload by 40%.',
            ru: 'на LangChain, ChromaDB и GigaChat. Она автоматически отвечает на рутинные запросы, снизив нагрузку на менеджеров на 40%.',
          },
        },
        {
          lead: {
            en: 'Built the speech-recognition library',
            ru: 'Построил библиотеку распознавания речи',
          },
          detail: {
            en: 'using SaluteSpeech for voice-created waybills. Set up Label Studio so managers can annotate data themselves.',
            ru: 'на SaluteSpeech для голосового создания накладных. Настроил Label Studio, чтобы менеджеры могли сами размечать данные.',
          },
        },
        {
          lead: {
            en: 'Moved a legacy codebase to Clean Architecture',
            ru: 'Перенёс legacy-кодовую базу на Clean Architecture',
          },
          detail: {
            en: 'introduced event-driven messaging and dependency injection with dishka. Started migrating from Celery to FastStream for typed inter-service messaging.',
            ru: 'внедрил событийный обмен сообщениями и DI с dishka. Начал переход с Celery на FastStream для типизированного межсервисного взаимодействия.',
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
        en: 'An open-source corporate messenger for pickup-point staff, built as a microservice alternative to Mattermost. Developed from API design through production deployment and monitoring.',
        ru: 'Корпоративный open-source мессенджер для сотрудников пунктов выдачи, микросервисная альтернатива Mattermost. Разработка от проектирования API до запуска в продакшене и настройки мониторинга.',
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
            en: 'Dropped connections after the switch from Mattermost',
            ru: 'Обрывы соединений после перехода с Mattermost',
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
            en: 'Designed the microservice architecture',
            ru: 'Спроектировал микросервисную архитектуру',
          },
          detail: {
            en: 'defined REST, GraphQL and gRPC contracts. Set up Kong for routing, rate limiting and authentication, and RabbitMQ and Kafka for async work. Authentication, chat and notifications scale independently.',
            ru: 'описал REST, GraphQL и gRPC-контракты. Настроил Kong для маршрутизации, ограничения запросов и аутентификации, RabbitMQ и Kafka для асинхронной работы. Сервисы аутентификации, чата и уведомлений масштабируются независимо.',
          },
        },
        {
          lead: {
            en: 'Moved WebSocket connections into a dedicated Centrifugo layer',
            ru: 'Вынес WebSocket-соединения в отдельный слой Centrifugo',
          },
          detail: {
            en: 'used pub/sub for message delivery. Fan-out throughput increased by about 50% and dropped connections decreased by about 40%, resolving the delivery instability that prompted the switch from Mattermost.',
            ru: 'использовал pub/sub для доставки сообщений. Пропускная способность fan-out выросла примерно на 50%, число обрывов соединений снизилось на 40%. Устранил нестабильность доставки, из-за которой команда отказалась от Mattermost.',
          },
        },
        {
          lead: { en: 'Migrated monitoring off SaaS', ru: 'Перенёс мониторинг с SaaS' },
          detail: {
            en: 'deployed Prometheus, Loki and Grafana with OpenTelemetry tracing and Sentry on our own infrastructure. Metrics and traces cover every microservice, MTTR fell by about 50%, and subscription costs were eliminated.',
            ru: 'развернул Prometheus, Loki и Grafana с трейсингом OpenTelemetry и Sentry на собственной инфраструктуре. Все микросервисы покрыты метриками и трейсами, MTTR снизился примерно на 50%, расходы на подписку исчезли.',
          },
        },
        {
          lead: { en: 'Made the logs machine-readable', ru: 'Сделал логи машиночитаемыми' },
          detail: {
            en: 'configured JSON logs with structlog, trace_id and request_id across services, plus aggregation and alerts in Loki. Root-cause analysis became about 30% faster. Built LLM services using the OpenAI API for assistants in the messenger.',
            ru: 'настроил JSON-логи через structlog с trace_id и request_id во всех сервисах, агрегацию и алерты в Loki. Поиск первопричины стал примерно на 30% быстрее. Разработал LLM-сервисы на OpenAI API для ассистентов в мессенджере.',
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
        en: 'I use DDD, Clean Architecture and event-driven design. I set up metrics and tracing with OpenTelemetry and Grafana, and refactor and optimise legacy services.',
        ru: 'Использую DDD, Clean Architecture и событийную архитектуру. Настраиваю метрики и трейсинг с OpenTelemetry и Grafana, рефакторю и оптимизирую legacy-сервисы.',
      },
    },
    {
      topic: 'open-source',
      text: {
        en: 'I develop and maintain Python libraries: faststream-celery, jobify-db and dishka integrations.',
        ru: 'Разрабатываю и поддерживаю Python-библиотеки: faststream-celery, jobify-db и интеграции dishka.',
      },
    },
    {
      topic: 'collaboration',
      text: {
        en: 'I review code and discuss architecture with the team. I use Cursor and Claude Code in daily development.',
        ru: 'Участвую в код-ревью и обсуждаю архитектуру с командой. В ежедневной разработке использую Cursor и Claude Code.',
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
