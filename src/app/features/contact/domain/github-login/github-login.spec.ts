import { describe, expect, it } from 'vitest';

import { githubLogin } from './github-login';

describe('githubLogin', () => {
  it('accepts a valid login', () => {
    expect(githubLogin.create('C3EQUALZz')).toEqual({ ok: true, value: 'C3EQUALZz' });
  });

  it('accepts a single-character login', () => {
    expect(githubLogin.create('a')).toEqual({ ok: true, value: 'a' });
  });

  it.each([
    '',
    'a'.repeat(40),
    '-starts-with-hyphen',
    'ends-with-hyphen-',
    'with_underscore',
    'with space',
  ])('rejects «%s»', (raw) => {
    expect(githubLogin.create(raw)).toEqual({
      ok: false,
      error: { kind: 'InvalidGitHubLogin' },
    });
  });
});
