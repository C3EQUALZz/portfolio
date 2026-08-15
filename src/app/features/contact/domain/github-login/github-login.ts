import type { Brand } from '../../../../shared/kernel/brand/brand';
import { err, ok, type Result } from '../../../../shared/kernel/result/result';

/**
 * GitHub username: up to 39 chars of alphanumerics and single hyphens,
 * never starting or ending with a hyphen. Feature-local primitive — unlike
 * Technology, nothing outside contact needs it.
 */
export type GitHubLogin = Brand<string, 'GitHubLogin'>;

export interface InvalidGitHubLogin {
  readonly kind: 'InvalidGitHubLogin';
}

const INVALID: InvalidGitHubLogin = { kind: 'InvalidGitHubLogin' };

const LOGIN_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export const githubLogin = {
  create(raw: string): Result<GitHubLogin, InvalidGitHubLogin> {
    return LOGIN_PATTERN.test(raw) ? ok(raw as GitHubLogin) : err(INVALID);
  },
};
