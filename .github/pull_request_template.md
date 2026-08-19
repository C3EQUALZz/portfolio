## Summary

## Motivation / context

## Changes

-

## Checklist

- [ ] `npm run verify` is green (prettier, eslint, stylelint, typecheck, depcruise, knip, test:ci) — state how many tests ran
- [ ] New behaviour is tested: pure domain specs (`test:domain`) for domain, TestBed specs (`ng test`) for application / ui
- [ ] Layer rule preserved: `ui → application → domain`; adapters are wired via ports and `provide<Feature>Feature()`
- [ ] i18n: keys added to both `en.ts` and `ru.ts` (parity is type-checked); UI uses `translateSignal`, not the Transloco pipe
- [ ] Content changes go through `infrastructure/content` only; domain invariants are not weakened to fit the data
- [ ] PR title follows Conventional Commits

## What I did not verify
