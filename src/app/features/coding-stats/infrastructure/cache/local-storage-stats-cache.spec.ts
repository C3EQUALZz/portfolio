import { codingProfile, type CodingProfile } from '../../domain/coding-profile/coding-profile';

import { must } from '../../../../shared/testing/must';
import { LocalStorageStatsCache } from './local-storage-stats-cache';

function profile(): CodingProfile {
  return must(
    codingProfile.create({
      platform: 'codewars',
      handle: 'C3EQUALZz',
      profileUrl: 'https://www.codewars.com/users/C3EQUALZz',
      fetchedAt: '2026-08-22T18:00:00.000Z',
      totalSolved: 7,
      facts: {
        kind: 'codewars',
        honor: 16,
        kyu: 8,
        kyuName: '8 kyu',
        completedKata: 7,
        leaderboardPosition: undefined,
      },
    }),
  );
}

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
    removeItem: (key: string) => void map.delete(key),
    clear: () => {
      map.clear();
    },
    key: () => null,
    get length() {
      return map.size;
    },
  };
}

describe('LocalStorageStatsCache', () => {
  it('round-trips a written profile', () => {
    const cache = new LocalStorageStatsCache(memoryStorage());
    cache.write(profile(), '2026-08-22T18:00:00.000Z');

    const cached = cache.read('codewars');

    expect(cached?.profile.totalSolved).toBe(7);
    expect(cached?.cachedAt).toBe('2026-08-22T18:00:00.000Z');
  });

  it('reads a corrupted entry as a miss', () => {
    const storage = memoryStorage();
    storage.setItem('coding-stats:v1:codewars', '{broken');
    const cache = new LocalStorageStatsCache(storage);

    expect(cache.read('codewars')).toBeUndefined();
  });

  it('reads a schema-foreign entry as a miss', () => {
    const storage = memoryStorage();
    storage.setItem('coding-stats:v1:codewars', JSON.stringify({ profile: {}, cachedAt: 'x' }));
    const cache = new LocalStorageStatsCache(storage);

    expect(cache.read('codewars')).toBeUndefined();
  });

  it('is a permanent miss without storage (prerender)', () => {
    const cache = new LocalStorageStatsCache(undefined);

    cache.write(profile(), '2026-08-22T18:00:00.000Z');
    expect(cache.read('codewars')).toBeUndefined();
  });

  it('clear drops only the named platform', () => {
    const cache = new LocalStorageStatsCache(memoryStorage());
    cache.write(profile(), '2026-08-22T18:00:00.000Z');

    cache.clear('leetcode');
    expect(cache.read('codewars')).toBeDefined();
    cache.clear('codewars');
    expect(cache.read('codewars')).toBeUndefined();
  });
});
