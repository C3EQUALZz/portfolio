/**
 * Presentation mapping from a technology slug to its visual mark and source
 * repository: a logo asset from public/icons/tech (simple-icons or the
 * project's own avatar) or a phosphor fallback. Returns undefined for
 * unknown technologies — the chip falls back to the name text.
 */
export type TechIcon = {
  readonly url: string;
} & (
  | { readonly kind: 'asset'; readonly path: string; readonly invert?: boolean }
  | { readonly kind: 'ph'; readonly icon: string }
);

const TECH_ICONS: Readonly<Record<string, TechIcon>> = {
  sqlalchemy: {
    kind: 'asset',
    path: 'icons/tech/sqlalchemy.svg',
    url: 'https://github.com/sqlalchemy/sqlalchemy',
  },
  nats: {
    kind: 'asset',
    path: 'icons/tech/nats.svg',
    url: 'https://github.com/nats-io/nats-server',
  },
  spring: {
    kind: 'asset',
    path: 'icons/tech/spring.svg',
    url: 'https://github.com/spring-projects/spring-framework',
  },
  postgresql: {
    kind: 'asset',
    path: 'icons/tech/postgresql.svg',
    url: 'https://github.com/postgres/postgres',
  },
  rabbitmq: {
    kind: 'asset',
    path: 'icons/tech/rabbitmq.svg',
    url: 'https://github.com/rabbitmq/rabbitmq-server',
  },
  tokio: {
    kind: 'asset',
    path: 'icons/tech/tokio.svg',
    url: 'https://github.com/tokio-rs/tokio',
  },
  java: {
    kind: 'asset',
    path: 'icons/tech/java.svg',
    url: 'https://github.com/openjdk/jdk',
  },
  python: {
    kind: 'asset',
    path: 'icons/tech/python.svg',
    url: 'https://github.com/python/cpython',
  },
  rust: {
    kind: 'asset',
    path: 'icons/tech/rust.svg',
    url: 'https://github.com/rust-lang/rust',
  },
  fastapi: {
    kind: 'asset',
    path: 'icons/tech/fastapi.svg',
    url: 'https://github.com/fastapi/fastapi',
  },
  kafka: {
    kind: 'asset',
    path: 'icons/tech/kafka.svg',
    url: 'https://github.com/apache/kafka',
  },
  redis: {
    kind: 'asset',
    path: 'icons/tech/redis.svg',
    url: 'https://github.com/redis/redis',
  },
  mongodb: {
    kind: 'asset',
    path: 'icons/tech/mongodb.svg',
    url: 'https://github.com/mongodb/mongo',
  },
  kubernetes: {
    kind: 'asset',
    path: 'icons/tech/kubernetes.svg',
    url: 'https://github.com/kubernetes/kubernetes',
  },
  docker: {
    kind: 'asset',
    path: 'icons/tech/docker.svg',
    url: 'https://github.com/moby/moby',
  },
  dishka: {
    kind: 'asset',
    path: 'icons/tech/dishka.png',
    url: 'https://github.com/reagento/dishka',
  },
  serde: {
    kind: 'asset',
    path: 'icons/tech/serde.png',
    invert: true,
    url: 'https://github.com/serde-rs/serde',
  },
  ag2: {
    kind: 'asset',
    path: 'icons/tech/ag2.png',
    url: 'https://github.com/ag2ai/ag2',
  },
};

export function techIcon(slug: string): TechIcon | undefined {
  return TECH_ICONS[slug];
}
