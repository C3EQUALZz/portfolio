import type { CodingPlatform } from '../../domain/coding-platform/coding-platform';
import { codingProfile } from '../../domain/coding-profile/coding-profile';
import type { CachedProfile, StatsCache } from '../../domain/stats-cache/stats-cache';

const KEY_PREFIX = 'coding-stats:v1:';

function parseEntry(raw: string): CachedProfile | undefined {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || !('profile' in parsed)) {
      return undefined;
    }
    const { profile, cachedAt } = parsed as { profile: unknown; cachedAt: unknown };
    if (typeof cachedAt !== 'string' || Number.isNaN(Date.parse(cachedAt))) {
      return undefined;
    }
    // The profile went through create() before caching; re-running the
    // structural checks on read guards against hand-edited storage.
    const candidate = profile as Parameters<typeof codingProfile.create>[0];
    const validated = codingProfile.create(candidate);
    return validated.ok ? { profile: validated.value, cachedAt } : undefined;
  } catch {
    return undefined;
  }
}

/**
 * localStorage adapter for the stats cache. A cache must never break the
 * page: missing storage (prerender), disabled storage and corrupted entries
 * all read as a cache miss. Values are re-validated through the domain
 * factory on read, so a payload from an older schema version is dropped
 * rather than rendered.
 */
export class LocalStorageStatsCache implements StatsCache {
  private readonly storage: Storage | undefined;

  constructor(storage: Storage | undefined) {
    this.storage = storage;
  }

  read(platform: CodingPlatform): CachedProfile | undefined {
    if (this.storage === undefined) {
      return undefined;
    }
    try {
      const raw = this.storage.getItem(KEY_PREFIX + platform);
      return raw === null ? undefined : parseEntry(raw);
    } catch {
      return undefined;
    }
  }

  write(profile: CachedProfile['profile'], cachedAt: string): void {
    if (this.storage === undefined) {
      return;
    }
    try {
      this.storage.setItem(KEY_PREFIX + profile.platform, JSON.stringify({ profile, cachedAt }));
    } catch {
      // Quota exceeded or storage blocked — the cache is best-effort.
    }
  }

  clear(platform: CodingPlatform): void {
    try {
      this.storage?.removeItem(KEY_PREFIX + platform);
    } catch {
      // Best-effort, same as write.
    }
  }
}
