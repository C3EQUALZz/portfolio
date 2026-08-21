# Portfolio

A personal landing-resume: a single-page site with experience, stack, projects
and contacts, plus a certificates page. Two locales (en/ru), static deploy to
GitHub Pages. Angular 22, feature-first structure with
`domain / application / infrastructure / presentation` layers inside each
feature.

Content is the domain. The resume is modelled as an aggregate with real
invariants: role periods never overlap deeper than one shared month, only one
role may be current, and the total experience shown in the hero is **derived**
from the periods (union of intervals, gaps excluded) — so the number cannot
drift away from the dates.

Languages: code and code comments (including error messages) in English.
Documentation (`docs/`, `CONTEXT.md`) is written in Russian; this file is the
exception and stays in English.

## Project Structure

```
src/
  main.ts                          # bootstrap
  app/
    app.ts | app.config.ts | app.routes.ts   # entry point and composition root
    layout/                        # app shell: header, footer
    pages/                         # pages composing several features (landing)
    shared/
      kernel/                      # pure core: Result, branded types, base VOs (no framework)
      i18n/                        # Transloco: provideI18n(), LocaleService, en/ru dictionaries
      testing/                     # test helpers (must/mustFail)
    features/
      <feature>/
        domain/                    # entities, value objects, ports (interface). 0 framework imports
        application/               # feature store: state and derived signals. Ports only
        infrastructure/            # port adapters, typed content, mappers
        presentation/              # components and pages
        index.ts                   # the feature's public API — the only door from outside
e2e/                               # Playwright, three browsers
docs/                              # architecture.md, domain-plan.md, adr/
```

The dependency rules are **enforced, not advisory**: `eslint-plugin-boundaries`
(in the IDE) and `dependency-cruiser` (`npm run arch`) check them, and a
violation fails the build. Direction is inward only:
`presentation / infrastructure → application → domain`.

| Layer            | May import                                                                       | Never                                                                            |
| ---------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `domain`         | own `domain`, `shared/kernel`                                                    | `@angular/*`, `rxjs`, browser APIs, any other layer                              |
| `application`    | own `domain`/`application`, `shared*`                                            | `@angular/common/http`, `@angular/router`, DOM, `infrastructure`, `presentation` |
| `infrastructure` | own `domain`/`application`, `shared*`                                            | `presentation`                                                                   |
| `presentation`   | own `domain`/`application`/`presentation`, `shared*`, other features' `index.ts` | `infrastructure`                                                                 |
| `shared`         | `shared`, `shared/kernel`                                                        | anything from `features/`                                                        |
| `layout`/`pages` | `shared*`, features' public APIs (`index.ts`)                                    | feature internals                                                                |

Two key ideas:

1. **The domain is framework-agnostic.** When it needs a `ResumeRepository` it
   declares an `interface`, and the Angular adapter lives in `infrastructure`.
   Observable consequence: the domain tests run in a node environment in
   milliseconds (`npm run test:domain`).
2. **A feature is a black box.** From the outside only
   `features/<feature>/index.ts` is visible; deep-importing another feature's
   internals is forbidden. The feature exports its own providers
   (`provideResumeFeature()`), so the composition root (`app.config.ts`) wires
   it without knowing about its `infrastructure`.

The top-level names are chosen deliberately: `core` and `shell` are not used.
`core` was too broad, and its only content (i18n) is shared by nature — it lives
in `shared/i18n`. `shell` collides with the console shell; the page frame is
`layout`. A page owned by one feature (e.g. `/certificates`) lives in that
feature's `presentation`; `pages/` holds only compositions over several
features.

## Bounded Contexts

The domain vocabulary lives in `CONTEXT.md`, decisions in `docs/adr/`. Four
features:

| Feature        | What it owns                                                                                  |
| -------------- | --------------------------------------------------------------------------------------------- |
| `resume`       | The document about the candidate: experience, stack, education, languages. Aggregate `Resume` |
| `projects`     | The candidate's open source. Aggregate `Project` + `RepositorySnapshot` from GitHub           |
| `contact`      | Ways to get in touch. The typed union `ContactChannel`                                        |
| `certificates` | Certificates and their viewing (PDF viewer), the `/certificates` page                         |

Terms to know before changing the domain (full glossary in `CONTEXT.md`,
including the _Avoid_ lists):

- **Resume** — an immutable document, validated whole at parse time, read-only
  ever after. No commands mutate it.
- **Experience** — one period of work at one company on one product. At least
  one `Achievement` (a result, not a duty), unique impact labels, a non-empty
  stack.
- **Impact** — a claim about a result: a number with a unit and a direction
  (`−40%`) **or** a literal (`compile-time`). `isAnimatable` tells the two
  apart; the sign and suffix are rendered by the UI.
- **Period / YearMonth** — time in the core. Months are counted inclusively:
  `(end − start) + 1`. `totalExperience` is a union of intervals: a shared
  boundary month of two roles (a job transition) counts once, real gaps do not
  count at all.
- **TechnologyCluster** — a deliberate group of technologies under one label
  ("Frida · Androguard · YARA"), with the emphasis on the whole cluster.
- **SkillGroupEntry.emphasis** — `lead | supporting`: the domain says what
  matters, the UI decides what color that is. The hero icon ring is fed from
  the `lead` technologies of the SkillGroups (limit ~18, enforced by a content
  spec) — there is no separate hardcoded list.
- **LocalizedText** — `{ en, ru }`, both locales required. The domain knows
  nothing about language switching; picking the locale is the UI's job.
- **RepositorySnapshot** — the repository state at build time (stars, language,
  last commit date). A missing snapshot is a normal state, not an error.

**The domain does not format strings.** `durationInMonths` returns a number; the
UI assembles `{ years, months }` — "9 months" is a locale concern, not domain.

## Domain Layer

```
domain/<concept>/
  <concept>.ts          # interface + namespace object with create() and queries
  <concept>.spec.ts     # the spec sits next to the implementation
```

Conventions:

- **One concept — one directory**, no barrels (`check-file/no-index`); imports
  are direct relative paths to the file.
- **Errors are values, not exceptions.** Every constructor returns
  `Result<T, E>`, where `E` is an object with a discriminator:
  `{ readonly kind: 'InvalidExperience' }`. See `shared/kernel/result`.
- **The factory is a namespace object.** `export interface Experience { ... }` +
  `export const experience = { create(input): Result<...>, duration(...) }`.
  No classes, no `new` from outside.
- **No `enum`** (`erasableSyntaxOnly`): union types or `as const`.
- **No `as const` on namespace objects** — it blinds Stryker (see below).
- **Ports are `Promise`, not `Observable`**: the domain knows nothing about
  RxJS (enforced by the linter). The Angular adapter wraps it in `resource()`
  in the application layer.

`shared/kernel` is the strictest: **no dependencies at all** (neither framework
nor npm packages), pure functions and types only, 95%+ coverage, participates in
mutation testing.

## Application Layer

The pattern is a **feature store** (`application/<feature>-store/`):

- An `@Injectable` class receives the port through an `InjectionToken`
  (`export const RESUME_REPOSITORY = new InjectionToken<ResumeRepository>(...)`);
  the adapter is bound by `provide<Feature>Feature()` in the feature's
  `index.ts`.
- Loading goes through `resource()`; the store turns a port error
  (`Result.err`) into a `throw` so `resource` can see it.
- Everything derived is a `computed` signal over `resource.value()`; the store
  does not know where the data comes from (static, JSON, CMS) — only the port.
- `asOf` for experience calculations is fixed at page load: the resume does not
  age while you read it.

## Infrastructure Layer

Content is a typed TS module
(`infrastructure/content/<feature>-content.ts`), with a mapper
`to<Aggregate>(dto): Result<...>` and the repository adapter next to it.

Why not JSON over HTTP: a TS module is checked by the compiler, needs no
network and does not break prerendering. The port stays the same, so moving to
JSON or the GitHub API is a one-adapter change. And "the content parses without
errors" is an ordinary spec (`<feature>-content.spec.ts`) that runs in
`test:domain`.

## Presentation Layer

- Standalone components, signals, `OnPush`, `@if`/`@for` control flow.
- **Transloco in templates only via `translateSignal`, never the pipe.** In
  zoneless, `markForCheck` from a pipe does not schedule a re-render; signals
  do. Dynamic keys inside a `computed` go through `transloco.translate(...)`.
- Icons and accent colors are picked by the UI; the domain provides the
  semantics (`emphasis: 'lead'`, `HighlightTopic`).
- Routes live only in `app.routes.ts`; page components are imported from the
  features' `index.ts`.

## Testing (Mandatory)

| Suite              | Command               | What it covers                                        | Thresholds  |
| ------------------ | --------------------- | ----------------------------------------------------- | ----------- |
| Domain + content   | `npm run test:domain` | `features/*/domain`, `shared/kernel`, content mappers | 95/90/95/95 |
| The rest (TestBed) | `npm run test:ci`     | application (resource/DI/signals), presentation       | 80%         |
| E2E                | `npm run e2e`         | Chromium + Firefox + WebKit, boots `ng serve` itself  | —           |
| Mutation           | `npm run mutation`    | domain/application via Stryker (slow, manual)         | —           |

Rules:

- The spec sits next to the implementation (`<concept>.spec.ts`), named by
  behaviour and outcome, not by method name.
- The domain is tested in a node environment; no browser needed. Domain work
  order: spec on the invariant first, implementation second.
- The `must`/`mustFail` helpers (`shared/testing`) unwrap `Result` in tests —
  do not write your own unwraps.
- Specs are exempt from the layer bans (`presentation → infrastructure` etc.):
  they verify the wiring against real content, not test doubles. Do not abuse
  this — pure layers are tested purely.
- **Do not test libraries.** Test the project's decisions: aggregate
  invariants, content mapping, period edge cases.

## Tooling & Standards (Mandatory)

- Angular **22** (signal-first, zoneless), TypeScript **~6.0**, package manager
  **npm 11** (`packageManager` in `package.json`); install with `npm ci`.
- Linting: ESLint `strictTypeChecked` + sonarjs + unicorn + rxjs-x +
  no-secrets, angular-eslint (templates + a11y). **There are no warnings**:
  `--max-warnings=0`; if you are not ready to fix one, disable the rule
  explicitly with a reason (`require-description`).
- Formatting: Prettier (printWidth 100, singleQuote), CSS via Stylelint
  (`recess-order`). Line endings are LF (see `.gitattributes`).
- Commits: Conventional Commits (commitlint); the PR title becomes the squash
  commit, so it is checked too.

Common commands:

```sh
npm start              # dev server on :4200
npm run verify:quick   # types + architecture + dead code (what pre-commit runs)
npm run verify         # everything — the same as pre-push and CI
npm run test:domain    # fast pure-layer tests in node
npm run test:ci        # TestBed specs + coverage
npm run e2e            # Playwright; e2e:ui is interactive, e2e:report shows the report
npm run arch:graph     # architecture diagram (mermaid) into reports/
npm run size           # bundle budget
```

## Code Quality Rules (Mandatory)

After **any** code change, in this order:

```sh
npm run verify:quick   # the minimum after every change
npm run verify         # before pushing / marking work done
```

- Fix ALL linter and type errors before moving on. Accept autofixes; do not
  silence a rule to make it quiet — if a rule genuinely does not fit a file,
  add a scoped disable with a comment explaining why.
- Never claim work is done without running the checks and reporting the result.

Git gates (husky): `pre-commit` — lint-staged + `verify:quick` (~4s, fast on
purpose so nobody reaches for `--no-verify`); `commit-msg` — commitlint;
`pre-push` — the full `verify` (~15–20s).

## CI

| Workflow                   | What it guards                                                                                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`                   | Format, ESLint (SARIF), types & templates, architecture (graph), dead code + jscpd, tests with coverage, build + size-limit, Playwright E2E — and deploy to GitHub Pages on green |
| `codeql.yml`               | CodeQL for JS/TS                                                                                                                                                                  |
| `dependency-review.yml`    | Blocks PRs with vulnerable dependencies                                                                                                                                           |
| `pr-title.yml`             | Conventional Commits on the PR title                                                                                                                                              |
| `labeler.yml`/`labels.yml` | Path-based PR labels                                                                                                                                                              |
| `zizmor.yml`               | Static security analysis of the workflows themselves                                                                                                                              |

Third-party actions are pinned to a full commit SHA. SonarCloud analyzes every
PR. Dependencies are kept current by Dependabot, in grouped PRs.

## Things That Have Bitten Us

Read the relevant entry before touching that area.

- **Banning packages ≠ boundaries.** In `eslint-plugin-boundaries@7` an allow
  policy overrides a deny policy, so "the domain has no Angular" is expressed
  two ways: no allow-policy for external packages on `feature-domain`, plus a
  native `no-restricted-imports`. The second echelon is dependency-cruiser. Do
  not rewrite this as a `disallow` policy: it will not fire.
- **`node_modules` is not excluded from dependency-cruiser.** Otherwise the
  banned-package rules silently never trigger: the package nodes are simply not
  in the graph. `doNotFollow` protects against descending into packages.
- **`template/no-call-expression` is off on purpose.** In signal-first Angular
  `{{ mySignal() }}` is correct code, and the rule bans any call.
- **`@angular/forms` was removed** as unused (knip found it). If the contact
  form needs it, bring it back with `npm i @angular/forms`.
- **`as const` on a namespace object blinds Stryker** — the instrumenter skips
  such an object's methods entirely: `period.ts` produced 2 mutants instead of 52. That is why namespace objects are exported without `as const`. Verified
  by bisection with probes.
- **The `shared-kernel-is-pure` rule excludes `*.spec.ts`.** Otherwise it bans
  specs from importing vitest. Any "this layer depends on nothing" rule needs
  the same carve-out once specs appear in that layer.
- **Keyframes live globally in `styles.css`**, so stylelint's
  `no-unknown-animations` is off: the rule checks animations file by file, and
  duplicating keyframes into components gets caught by jscpd as copy-paste.
- **`LocaleService.locale()` switches after the dictionary loads.** Transloco's
  `setActiveLang` emits the language change synchronously while the dictionary
  loads asynchronously — without this, computed signals using
  `transloco.translate` recomputed against an unloaded locale. In tests, after
  `setLocale` you need one macrotask (`setTimeout 0`) before `whenStable`.
- **The jscpd check is sensitive to a stale PR base.** The 1% threshold catches
  duplicates in code that no longer exists on master — a dependabot PR lagging
  behind a refactor fails through no fault of its own. The fix is a rebase, not
  a weaker threshold.
- **The `codeql-action` parts only bump together.** `init`, `analyze` and
  `upload-sarif` must be the same version; dependabot sends them as three PRs,
  and each one alone fails with "Loaded a configuration file for version X,
  but running version Y". They merge as a chain: the first with a red check,
  the rest go green after a rebase.
- **TypeScript 7 is incompatible with the current toolchain**: `@angular/build@22`
  requires `typescript >=6.0 <6.1`. The TypeScript major is ignored in
  dependabot until Angular supports it.
- **CRLF on Windows broke the local gates.** With `core.autocrlf=true` the
  working copy got CRLF while Prettier (`endOfLine: lf`) flagged every file,
  and pre-push failed on unchanged code. Fixed by `.gitattributes` with
  `* text=auto eol=lf` — do not delete it.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (via the `gh` CLI); external PRs are also a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles map to same-named labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
