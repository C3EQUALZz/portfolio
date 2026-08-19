## Summary

## Motivation / context

## Changes

-

## Checklist

- [ ] `npm run verify` зелёный (prettier, eslint, stylelint, typecheck, depcruise, knip, test:ci) — укажи, сколько тестов прогналось
- [ ] Новое поведение покрыто тестами: домен — чистые спеки (`test:domain`), UI/application — TestBed (`ng test`)
- [ ] Слойные границы соблюдены: `ui → application → domain`, инфраструктура связывается через порты и `provide<Feature>Feature()`
- [ ] i18n: ключи добавлены и в `en.ts`, и в `ru.ts` (parity проверяется типом); UI использует `translateSignal`, не pipe
- [ ] Контент меняется только через `infrastructure/content`, доменные инварианты не ослаблены ради данных
- [ ] Заголовок PR следует Conventional Commits

## What I did not verify
