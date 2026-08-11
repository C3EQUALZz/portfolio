/**
 * Conventional Commits: commit history as project documentation.
 * Example: feat(projects): add project card component
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 120],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'perf',
        'style',
        'test',
        'docs',
        'build',
        'ci',
        'chore',
        'revert',
        'arch',
      ],
    ],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-case': [2, 'always', ['sentence-case', 'lower-case']],
  },
};
