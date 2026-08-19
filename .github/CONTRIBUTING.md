# Contributing

Thanks for taking the time. This document covers the mechanics; the
architecture, the layer rules and the vocabulary live in
[AGENTS.md](../AGENTS.md) and `docs/architecture.md` — read those before
writing code.

## Setup

Requires Node.js 22 and npm.

```sh
npm ci
npm run dev
```

## The loop

```sh
npm run verify:quick   # typecheck + dependency rules + dead code
npm run test:domain    # fast pure domain specs (vitest)
npm run verify         # everything: format, eslint, stylelint, typecheck,
                       # depcruise, knip, tests with coverage
```

`npm run verify` must be clean before a PR — it reproduces exactly what CI
runs.

## Conventions worth knowing up front

- **Feature-first layout, Clean Architecture inside each feature.**
  `src/app/features/<feature>/{domain,application,infrastructure,ui}` — the
  dependency rule is `ui → application → domain`, and the domain imports
  nothing from Angular. `depcruise` enforces it.
- **Domain factories return `Result` and validate invariants.** Content lives
  in `infrastructure/content` and is parsed at the boundary; a broken entry
  fails fast at bootstrap with its index, never renders half-broken.
- **Zoneless signals everywhere.** Translations go through `translateSignal`,
  not the Transloco pipe — the pipe does not re-render without zones.
- **Code and code comments are in English; docs (`docs/`) are in Russian.**
  i18n dictionaries ship in `en.ts` and `ru.ts`; the Russian one is typed as
  `typeof EN_TRANSLATIONS`, so a missing key fails at compile time.
- **Accept the linters' autofixes; do not silence a rule.** If a rule is
  genuinely wrong for a file, scope the exception and comment why.
- **Test behaviour, not implementation.** UI specs bind the real static
  content via `provide<Feature>Feature()`; a refactor that breaks a test but
  not the behaviour means the test was wrong.

## Commits and pull requests

Commit messages and PR titles follow
[Conventional Commits](https://www.conventionalcommits.org/) — enforced by the
husky + commitlint hooks locally and by the PR Title workflow on GitHub.
Commit subjects are lower-case sentence-case.

```
feat: add certificates page
fix: make inner hero ring chips hoverable
test: cover certificate catalog grouping
```

Fill in the pull request template, including the "What I did not verify"
section. Reporting that something is untested is useful; implying it works is
not.
