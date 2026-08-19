/**
 * Presentation mapping from a technology slug to its visual mark: a logo
 * asset from public/icons/tech (simple-icons) or a phosphor fallback for
 * tools without a brand logo. Returns undefined for unknown technologies —
 * the chip falls back to the name text.
 */
export type TechIcon =
  | { readonly kind: 'asset'; readonly path: string }
  | { readonly kind: 'ph'; readonly icon: string };

const TECH_ICONS: Readonly<Record<string, TechIcon>> = {
  sqlalchemy: { kind: 'asset', path: 'icons/tech/sqlalchemy.svg' },
  nats: { kind: 'asset', path: 'icons/tech/nats.svg' },
  spring: { kind: 'asset', path: 'icons/tech/spring.svg' },
  postgresql: { kind: 'asset', path: 'icons/tech/postgresql.svg' },
  rabbitmq: { kind: 'asset', path: 'icons/tech/rabbitmq.svg' },
  tokio: { kind: 'asset', path: 'icons/tech/tokio.svg' },
  java: { kind: 'asset', path: 'icons/tech/java.svg' },
  python: { kind: 'asset', path: 'icons/tech/python.svg' },
  rust: { kind: 'asset', path: 'icons/tech/rust.svg' },
  fastapi: { kind: 'asset', path: 'icons/tech/fastapi.svg' },
  kafka: { kind: 'asset', path: 'icons/tech/kafka.svg' },
  redis: { kind: 'asset', path: 'icons/tech/redis.svg' },
  mongodb: { kind: 'asset', path: 'icons/tech/mongodb.svg' },
  kubernetes: { kind: 'asset', path: 'icons/tech/kubernetes.svg' },
  docker: { kind: 'asset', path: 'icons/tech/docker.svg' },
  dishka: { kind: 'asset', path: 'icons/tech/dishka.png' },
  serde: { kind: 'ph', icon: 'ph-arrows-left-right' },
  ag2: { kind: 'ph', icon: 'ph-robot' },
};

export function techIcon(slug: string): TechIcon | undefined {
  return TECH_ICONS[slug];
}
