import { err, ok, type Result } from '../../../../shared/kernel/result/result';
import type { Technology } from '../../../../shared/kernel/technology/technology';

/**
 * The state of the repository at build time: stars, main language, last
 * commit date. It belongs to GitHub — the candidate neither edits it nor
 * can fix it. See CONTEXT.md.
 */
export interface RepositorySnapshot {
  readonly stars: number;
  readonly language: Technology;
  readonly lastCommitAt: Date;
}

export interface InvalidRepositorySnapshot {
  readonly kind: 'InvalidRepositorySnapshot';
}

const INVALID: InvalidRepositorySnapshot = { kind: 'InvalidRepositorySnapshot' };

export const repositorySnapshot = {
  create(input: {
    readonly stars: number;
    readonly language: Technology;
    readonly lastCommitAt: Date;
  }): Result<RepositorySnapshot, InvalidRepositorySnapshot> {
    if (!Number.isInteger(input.stars) || input.stars < 0) {
      return err(INVALID);
    }
    return ok({
      stars: input.stars,
      language: input.language,
      lastCommitAt: input.lastCommitAt,
    });
  },
};
