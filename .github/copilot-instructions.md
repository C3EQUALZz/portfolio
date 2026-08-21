# Copilot instructions

Read [AGENTS.md](../AGENTS.md) first — it is the single source of truth for this
repository. The short version:

- Feature-first structure; layers inside each feature:
  `domain / application / infrastructure / presentation`. Imports flow inward
  only, enforced by eslint-plugin-boundaries and dependency-cruiser.
- A feature is a black box: import only `features/<feature>/index.ts`, never its
  internals.
- Domain is framework-free: no `@angular/*`, no rxjs, no browser APIs.
  Constructors return `Result<T, E>`, never throw. Ports are `Promise`-based
  interfaces.
- Standalone components, signals, `OnPush`, `@if`/`@for`. Transloco in templates
  only via `translateSignal`, never the pipe.
- No `enum`, no barrels, no TS path aliases, no `any`.
- Specs sit next to the implementation (`<concept>.spec.ts`).
- After any code change run `npm run verify:quick`; before finishing run
  `npm run verify`. Zero ESLint warnings are allowed.
- Commits follow Conventional Commits (see commitlint.config.mjs).
