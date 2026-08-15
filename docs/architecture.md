# Архитектура и контроль качества

## Структура

Feature-first: единицей организации является фича, слои живут **внутри** неё.

```
src/
  main.ts                        # bootstrap
  app/
    app.ts | app.config.ts | app.routes.ts   # app-shell
    core/                        # composition root: DI-провайдеры, interceptors, guards
    shared/
      kernel/                    # чистое ядро: Result, Brand-типы, базовые VO (без фреймворка)
      ...                        # ui-kit и утилиты без бизнес-логики
    features/
      <feature>/
        domain/                  # сущности, value objects, порты (interface). 0 импортов фреймворка
        application/             # use-cases, состояние фичи. Работает только через порты
        infrastructure/          # адаптеры портов: HTTP, storage, мапперы
        ui/                      # компоненты и страницы
        index.ts                 # публичный API фичи — единственная дверь снаружу
```

## Правила зависимостей

Направление — только внутрь: `ui / infrastructure → application → domain`.

| Слой             | Может импортировать                                                        | Никогда                                                                |
| ---------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `domain`         | свой `domain`, `shared/kernel`                                             | `@angular/*`, `rxjs`, браузерные API, любые другие слои                |
| `application`    | свой `domain`/`application`, `shared*`                                     | `@angular/common/http`, `@angular/router`, DOM, `infrastructure`, `ui` |
| `infrastructure` | свой `domain`/`application`, `shared*`, `core`                             | `ui`                                                                   |
| `ui`             | свой `domain`/`application`/`ui`, `shared*`, `core`, `index.ts` других фич | `infrastructure`                                                       |
| `shared`         | `shared`, `shared/kernel`                                                  | что-либо из `features/`                                                |
| `core`           | `core`, `shared*`, публичные API фич                                       | внутренности фич                                                       |

Две ключевые идеи:

1. **Домен framework-agnostic.** Ему нужен `UserRepository` — он объявляет `interface`, а Angular-реализация живёт в `infrastructure`. Проверяемое следствие: тесты домена запускаются в node-окружении за миллисекунды (`npm run test:domain`).
2. **Фича — чёрный ящик.** Снаружи доступен только `features/<feature>/index.ts`; deep-import во внутренности другой фичи запрещён. Провайдеры фича экспортирует сама (`provideProjectsFeature()`), поэтому `core` подключает её, не зная про `infrastructure`.

## Как это проверяется

| Уровень        | Инструмент                                                     | Что ловит                                                                                  |
| -------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 0. Компилятор  | `tsc` + `angularCompilerOptions`                               | типы, `strictTemplates`, extendedDiagnostics как ошибки (в т.ч. `{{ signal }}` без вызова) |
| 1. Формат      | Prettier + EditorConfig                                        | единый стиль, детерминированные диффы                                                      |
| 2. Код         | ESLint: `strictTypeChecked`, sonarjs, unicorn, rxjs-x          | небезопасные типы, сложность, RxJS-ошибки, секреты                                         |
| 3. Angular     | angular-eslint (TS + шаблоны + a11y)                           | signals, OnPush, `@if/@for`, доступность                                                   |
| 4. Архитектура | `eslint-plugin-boundaries` (IDE) + `dependency-cruiser` (граф) | нарушения слоёв, циклы, orphans, deep-import                                               |
| 5. Гигиена     | knip, jscpd, check-file, stylelint                             | мёртвый код, копипаста, имена файлов, CSS                                                  |
| 6. Гейт        | husky + lint-staged + commitlint, GitHub Actions               | ничего не проходит мимо                                                                    |
| 7. Метрики     | coverage thresholds, Stryker, size-limit                       | качество тестов и бюджеты бандла                                                           |

### Команды

```bash
npm run lint            # ESLint (код + шаблоны + архитектурные границы)
npm run lint:styles     # Stylelint
npm run typecheck       # tsc для app и spec
npm run arch            # dependency-cruiser: слои, циклы, orphans
npm run arch:graph      # диаграмма архитектуры (mermaid) в reports/
npm run deadcode        # knip: неиспользуемые файлы/экспорты/зависимости
npm run dupes           # jscpd: копипаста
npm run test:ci         # тесты + пороги покрытия (80%)
npm run test:domain     # быстрые тесты чистых слоёв (пороги 95%)
npm run mutation        # Stryker по domain/application (медленно, вручную)
npm run size            # бюджет бандла
npm run verify:quick    # типы + архитектура + мёртвый код (то, что гоняет pre-commit)
npm run verify          # всё вместе — то же, что делает pre-push
```

### Гейты git

| Хук          | Что запускает                                                                              | Время     |
| ------------ | ------------------------------------------------------------------------------------------ | --------- |
| `pre-commit` | `lint-staged` (prettier + eslint --fix + stylelint по staged-файлам), затем `verify:quick` | ~4 с      |
| `commit-msg` | `commitlint` — Conventional Commits                                                        | мгновенно |
| `pre-push`   | `verify` — всё, включая формат, стили, тесты и покрытие                                    | ~15–20 с  |

Разделение осознанное: pre-commit должен оставаться быстрым, иначе его начнут обходить
через `--no-verify`. Проверено на живых коммитах: `any` + `console.log` в staged-файле и
сообщение не по Conventional Commits блокируются, рабочее дерево при откате не страдает.

## Соглашения

- **Без TS path aliases.** `boundaries` резолвит только реальные пути, поэтому импорты относительные — заодно `../../features/other` выглядит подозрительно, а `@features/other` маскировался бы. Единственный барrel — `features/<feature>/index.ts` (правило `check-file/no-index` запрещает остальные).
- **Без `enum`** (`erasableSyntaxOnly`): union-типы или `as const`.
- **Warning'ов не существует**: всё `error`, `--max-warnings=0`. Не готов чинить — выключай явно, с описанием причины (`require-description`).
- **Строгость по слоям**: `domain` — сложность ≤ 6, покрытие 95%; `ui` — мягче; тесты — без type-aware строгости.

## Решения, которые стоит помнить

Всё ниже проверено на пробных нарушениях (домен с `@angular/core`, UI → infrastructure,
deep-import в чужую фичу, `localStorage` в use-case) — каждое ловится минимум одним инструментом.

- **Запрет пакетов ≠ boundaries.** В `eslint-plugin-boundaries@7` разрешающая политика
  перекрывает запрещающую, поэтому «домен без Angular» выражен двумя способами:
  отсутствием allow-политики на external для `feature-domain` (default `disallow`)
  плюс нативным `no-restricted-imports` в слоевом блоке. Второй эшелон —
  `dependency-cruiser`. Не переписывай это на `disallow`-политику: она не сработает.
- **`node_modules` не исключён из dependency-cruiser.** Иначе правила про запрещённые
  пакеты молча не срабатывают: узлов пакетов просто нет в графе. От углубления внутрь
  пакетов защищает `doNotFollow`.
- **`template/no-call-expression` выключено осознанно.** В signal-first Angular
  `{{ mySignal() }}` — правильный код, а правило запрещает любые вызовы.
- **`@angular/forms` удалён** как неиспользуемый (нашёл knip). Понадобится для формы
  контактов — вернуть через `npm i @angular/forms`.
- **Расширенные диагностики шаблонов** заданы через `defaultCategory: "error"` без
  перечисления проверок: новые проверки будущих версий Angular включатся автоматически.
- **`as const` на namespace-объекте глушит Stryker.** Инструментер пропускает методы
  объекта с `as const` целиком: `period.ts` давал 2 мутанта вместо 52. Поэтому
  namespace-объекты (`export const period = { ... }`) экспортируются без `as const`.
  Проверено бисекцией на зондах: та же функция standalone — 14 мутантов, метод объекта
  с `as const` — 0.
- **Правило `shared-kernel-is-pure` в dependency-cruiser исключает `*.spec.ts`.** Иначе
  оно запрещает спекам импортировать vitest. Та же оговорка нужна любому правилу
  «слой ни от чего не зависит» при появлении спек в этом слое. Спеки освобождены и от
  слоевых запретов (`ui → infrastructure` и т.п.): они проверяют связывание на реальном
  контенте, а не на тест-дублях.
- **Keyframes живут глобально в `styles.css`, поэтому `no-unknown-animations` выключено.**
  Правило stylelint проверяет анимации по одному файлу и не видит глобальные
  `@keyframes` из компонентных стилей; альтернатива — дублировать keyframes в каждый
  компонент, что ловит jscpd как копипасту.
