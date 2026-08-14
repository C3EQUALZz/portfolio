# Portfolio

Персональный лендинг-резюме. Angular 22, feature-first структура со слоями
`domain / application / infrastructure / ui` внутри каждой фичи. См. `docs/architecture.md`
(правила зависимостей, команды проверки) и `docs/domain-plan.md` (доменная модель).

Языки: код и комментарии в коде (включая сообщения ошибок) — на английском;
документация (`docs/`, `CONTEXT.md`) — на русском.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (via the `gh` CLI); external PRs are also a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles map to same-named labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
