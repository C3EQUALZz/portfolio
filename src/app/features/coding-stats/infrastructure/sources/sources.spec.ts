import { codingProfile, type CodingProfile } from '../../domain/coding-profile/coding-profile';
import type { StatsSourceError } from '../../domain/coding-stats-source/coding-stats-source';

import { err, ok, type Result } from '../../../../shared/kernel/result/result';
import { must, mustFail } from '../../../../shared/testing/must';
import { alfaProfileFixture, codewarsUserFixture } from '../content/fixtures/api-fixtures';
import { AlfaLeetCodeSource } from './alfa-leetcode-source';
import { CodewarsSource } from './codewars-source';
import { FailoverCodingStatsSource } from './failover-source';
import type { FetchLike } from './fetch-json';

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

/** Records requested URLs, answers from the route table or 404. */
function stubFetch(routes: Record<string, unknown>): { fetchImpl: FetchLike; urls: string[] } {
  const urls: string[] = [];
  const fetchImpl: FetchLike = (url) => {
    urls.push(url);
    const body = Object.entries(routes).find(([prefix]) => url.startsWith(prefix))?.[1];
    return Promise.resolve(jsonResponse(body, body === undefined ? 404 : 200));
  };
  return { fetchImpl, urls };
}

describe('AlfaLeetCodeSource', () => {
  it('fetches the profile endpoint and maps the breakdown', async () => {
    const { fetchImpl } = stubFetch({ 'https://alfa.example/x/profile': alfaProfileFixture });
    const source = new AlfaLeetCodeSource(
      'https://alfa.example',
      'https://leetcode.com/u/x/',
      fetchImpl,
    );

    const profile = must(await source.fetch('x'));

    expect(profile.platform).toBe('leetcode');
    expect(profile.totalSolved).toBe(9);
  });

  it('treats a 404 on the profile as ProfileNotFound', async () => {
    const { fetchImpl } = stubFetch({});
    const source = new AlfaLeetCodeSource(
      'https://alfa.example',
      'https://leetcode.com/u/x/',
      fetchImpl,
    );

    expect(mustFail(await source.fetch('x'))).toEqual({ kind: 'ProfileNotFound' });
  });
});

describe('CodewarsSource', () => {
  it('requests the user endpoint and maps the payload', async () => {
    const { fetchImpl, urls } = stubFetch({
      'https://www.codewars.com/api/v1/users/C3EQUALZz': codewarsUserFixture,
    });
    const source = new CodewarsSource('https://www.codewars.com/users/C3EQUALZz', fetchImpl);

    const profile = must(await source.fetch('C3EQUALZz'));

    expect(profile.totalSolved).toBe(7);
    expect(urls).toEqual(['https://www.codewars.com/api/v1/users/C3EQUALZz']);
  });
});

function stubSource(result: Result<CodingProfile, StatsSourceError>): {
  fetch: () => Promise<Result<CodingProfile, StatsSourceError>>;
} {
  return { fetch: () => Promise.resolve(result) };
}

describe('FailoverCodingStatsSource', () => {
  const profile = must(
    codingProfile.create({
      platform: 'codewars',
      handle: 'x',
      profileUrl: 'https://www.codewars.com/users/x',
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

  it('returns the first success without walking further', async () => {
    const calls: string[] = [];
    const chain = new FailoverCodingStatsSource([
      {
        name: 'first',
        source: {
          fetch: () => {
            calls.push('first');
            return Promise.resolve(ok(profile));
          },
        },
      },
      {
        name: 'second',
        source: {
          fetch: () => {
            calls.push('second');
            return Promise.resolve(ok(profile));
          },
        },
      },
    ]);

    expect((await chain.fetch('x')).ok).toBe(true);
    expect(calls).toEqual(['first']);
  });

  it('falls through to the next member on failure', async () => {
    const chain = new FailoverCodingStatsSource([
      { name: 'first', source: stubSource(err({ kind: 'SourceTimeout' })) },
      { name: 'second', source: stubSource(ok(profile)) },
    ]);

    expect((await chain.fetch('x')).ok).toBe(true);
  });

  it('collects every attempt when all sources fail', async () => {
    const chain = new FailoverCodingStatsSource([
      { name: 'first', source: stubSource(err({ kind: 'SourceTimeout' })) },
      { name: 'second', source: stubSource(err({ kind: 'SourceUnavailable' })) },
    ]);

    expect(mustFail(await chain.fetch('x'))).toEqual({
      kind: 'AllSourcesUnavailable',
      attempts: [
        { source: 'first', error: { kind: 'SourceTimeout' } },
        { source: 'second', error: { kind: 'SourceUnavailable' } },
      ],
    });
  });
});
