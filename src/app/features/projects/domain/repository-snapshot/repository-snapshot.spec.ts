import { describe, expect, it } from 'vitest';

import { technology } from '../../../../shared/kernel/technology/technology';
import { must } from '../../../../shared/testing/must';
import { repositorySnapshot } from './repository-snapshot';

const PYTHON = must(technology.create('Python'));
const LAST_COMMIT = new Date('2026-08-01T00:00:00Z');

describe('repositorySnapshot', () => {
  it('creates a snapshot of the repository state at build time', () => {
    expect(
      repositorySnapshot.create({ stars: 42, language: PYTHON, lastCommitAt: LAST_COMMIT }),
    ).toEqual({ ok: true, value: { stars: 42, language: PYTHON, lastCommitAt: LAST_COMMIT } });
  });

  it('allows zero stars', () => {
    const created = repositorySnapshot.create({
      stars: 0,
      language: PYTHON,
      lastCommitAt: LAST_COMMIT,
    });

    expect(created.ok).toBe(true);
  });

  it.each([-1, 1.5, Number.NaN])('rejects %s stars', (stars) => {
    expect(
      repositorySnapshot.create({ stars, language: PYTHON, lastCommitAt: LAST_COMMIT }),
    ).toEqual({ ok: false, error: { kind: 'InvalidRepositorySnapshot' } });
  });
});
