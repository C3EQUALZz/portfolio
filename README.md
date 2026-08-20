# Portfolio

_A personal landing-resume — a single-page site with my experience, stack, projects and ways to reach me, plus a separate certificates page. Bilingual (en/ru), statically deployed to GitHub Pages._

Built with feature-first Clean Architecture on Angular: the domain layer is framework-agnostic, every feature is a black box behind its `index.ts`.

[![CI](https://github.com/C3EQUALZz/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/C3EQUALZz/portfolio/actions/workflows/ci.yml)
[![CodeQL](https://github.com/C3EQUALZz/portfolio/actions/workflows/codeql.yml/badge.svg)](https://github.com/C3EQUALZz/portfolio/actions/workflows/codeql.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=C3EQUALZz_portfolio&metric=alert_status)](https://sonarcloud.io/dashboard?id=C3EQUALZz_portfolio)

**Live:** https://c3equalzz.github.io/portfolio/

---

## Overview

The site is a resume rendered as a landing page: hero with a technology ring, experience timeline, stack, projects, contact channels, and a `/certificates`
page. All content is localized in English and Russian.

The content is the domain. The resume is modelled as an aggregate with real invariants — roles may share a boundary month but never overlap deeper, exactly one role may be current, and the total experience shown in the hero is _derived_
from the role periods (union of intervals, gaps excluded), so the number cannot drift away from the dates. Content lives in a typed TypeScript module behind a repository port: moving it to JSON over HTTP or the GitHub API is a one-adapter change, and "the content parses" is an ordinary unit test.

---

## Tech Stack

### Core Technologies

| Tool               | Role                                                           |
| ------------------ | -------------------------------------------------------------- |
| **Angular 22**     | Signal-first, zoneless, `OnPush`, control flow `@if`/`@for`    |
| **TypeScript 6**   | Strict mode, `strictTemplates`, extended diagnostics as errors |
| **RxJS**           | Streams at the edges; the domain knows nothing about it        |
| **Transloco**      | Runtime i18n (en/ru), signals + messageformat plurals          |
| **Phosphor Icons** | Icon set                                                       |
| **Vitest**         | Unit tests; the domain suite runs in node in milliseconds      |
| **Playwright**     | E2E across chromium/firefox/webkit, gating deploy              |

### Code Quality

| Tool                                 | Role                                                                              |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| **ESLint**                           | `strictTypeChecked`, sonarjs, unicorn, rxjs-x, no-secrets — zero warnings allowed |
| **angular-eslint**                   | Templates, accessibility, signal conventions                                      |
| **eslint-plugin-boundaries**         | Layer boundaries in the IDE                                                       |
| **dependency-cruiser**               | The same boundaries on the graph: cycles, orphans, deep imports                   |
| **Prettier + EditorConfig**          | Deterministic formatting                                                          |
| **Stylelint**                        | CSS, `recess-order` property ordering                                             |
| **knip**                             | Dead files, exports and dependencies                                              |
| **jscpd**                            | Copy-paste detection over a 1% threshold                                          |
| **Stryker**                          | Mutation testing of `domain`/`application` (manual)                               |
| **size-limit**                       | Bundle size budget                                                                |
| **commitlint + husky + lint-staged** | Conventional Commits and staged-file gates                                        |

---

## Architecture

Feature-first: the unit of organization is a feature (bounded context), and the Clean Architecture layers live **inside** it.

```
presentation / infrastructure → application → domain
```

The direction is enforced by `eslint-plugin-boundaries` and
`dependency-cruiser`, not by convention — a deep import or a domain file importing `@angular/*` fails the build.

| Layer            | May import                                        | Never                                          |
| ---------------- | ------------------------------------------------- | ---------------------------------------------- |
| `domain`         | own `domain`, `shared/kernel`                     | `@angular/*`, rxjs, browser APIs, other layers |
| `application`    | own `domain`/`application`, `shared*`             | HTTP, router, DOM, `infrastructure`            |
| `infrastructure` | own `domain`/`application`, `shared*`             | `presentation`                                 |
| `presentation`   | own layers, `shared*`, other features' `index.ts` | `infrastructure`                               |

Two key ideas:

1. **The domain is framework-agnostic.** It declares ports (`ResumeRepository`)
   as interfaces; Angular adapters live in `infrastructure`. Observable consequence: `npm run test:domain` runs the whole domain suite in node.
2. **A feature is a black box.** From the outside only `features/<feature>/index.ts`
   is visible; the feature exports its own providers (`provideProjectsFeature()`), so the composition root wires it without knowing about its infrastructure.

The full rulebook — including the decisions that were verified by deliberately breaking them — lives in [docs/architecture.md](docs/architecture.md); the domain model rationale is in [docs/domain-plan.md](docs/domain-plan.md).

---

## Project Structure

```
src/
  main.ts                          # bootstrap
  app/
    app.ts | app.config.ts | app.routes.ts   # entry point and composition root
    layout/                        # app shell: header, footer
    pages/                         # pages composing several features (landing)
    shared/
      kernel/                      # pure core: Result, branded types, base VOs
      i18n/                        # Transloco: provideI18n(), LocaleService, en/ru
      testing/                     # test helpers (must/mustFail)
    features/
      resume/                      # the resume document: aggregate, invariants
      projects/                    # project showcase
      contact/                     # contact channels
      certificates/                # certificates page
        domain/                    # entities, value objects, ports — 0 framework imports
        application/               # use-cases, feature state
        infrastructure/            # port adapters, content mappers
        presentation/              # components and pages
        index.ts                   # the feature's public API — the only door in
```

---

## Development

### Prerequisites

- Node.js with npm 11 (see `packageManager` in `package.json`)

### Setup

```sh
git clone https://github.com/C3EQUALZz/portfolio
cd portfolio
npm ci        # also installs git hooks via husky
npm start     # dev server on http://localhost:4200
```

### Everyday commands

```sh
npm run test:ci        # unit tests + coverage thresholds (80%)
npm run test:domain    # pure-layer tests in node (95% thresholds)
npm run e2e            # Playwright, boots the dev server itself
npm run build          # production build into dist/
npm run verify:quick   # types + architecture + dead code (the pre-commit gate)
npm run verify         # everything — the same as pre-push and CI
```

The split is deliberate: pre-commit stays fast enough that nobody reaches for
`--no-verify`, while pre-push runs the full battery.

---

## Continuous Integration

| Workflow                     | What it guards                                                                                                                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`                     | Format, ESLint (SARIF upload), types & templates, architecture graph, dead code & duplication, tests with coverage, build & size budget, Playwright E2E — and deploy to GitHub Pages on green |
| `codeql.yml`                 | CodeQL analysis for JavaScript/TypeScript                                                                                                                                                     |
| `dependency-review.yml`      | Blocks PRs introducing known-vulnerable dependencies                                                                                                                                          |
| `pr-title.yml`               | Conventional Commits on the PR title, which becomes the squash commit                                                                                                                         |
| `labeler.yml` / `labels.yml` | Path-based PR labels                                                                                                                                                                          |
| `zizmor.yml`                 | Static security analysis of the workflows themselves                                                                                                                                          |

Third-party actions are pinned to a full commit SHA. SonarCloud analyzes every PR. Dependencies are kept current by Dependabot, in grouped PRs.

---

## Contributing

Project rules for humans and agents alike live in **[AGENTS.md](AGENTS.md)** — layer boundaries, naming, testing rules, and where the domain docs are.
