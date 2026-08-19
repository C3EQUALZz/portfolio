# AI Policy

AI assistants are used on this repository, and that is fine. The rules exist so
that a reviewer can trust a diff without having to guess how it was produced.

## For contributors

- **You own the diff.** Whether you typed it or generated it, you are the author
  and you answer for it in review.
- **Run it.** This codebase has produced bugs that typed clean and passed
  review: a Transloco pipe that never re-rendered under zoneless change
  detection, an invisible hover hint that still ate the card's flex width,
  invisible outer ring layers swallowing pointer events over inner icons.
  `npm run verify` is the minimum bar.
- **Report what actually happened.** If tests fail, say so and show the output.
  If a part is unverified — no browser check, no deployed preview — say which
  part. The pull request template has a section for exactly this.
- **Do not paste secrets into a model.** `.env` files, API keys and tokens stay
  out of prompts.
- Disclosure of AI assistance is welcome but not required. Unrunnable or
  unreviewed generated code is not, regardless of disclosure.

## For agents

Agent configuration is checked in and is the source of truth:

- [`AGENTS.md`](../AGENTS.md) — architecture, layer rules, commands, language
  conventions. Shared by every agent.
- `docs/agents/` — issue tracker, triage labels and domain docs conventions.
- `.claude/` — permissions, skills and subagents.

An agent that changes behaviour should update the relevant document in the same
pull request.

## Automated review

CodeRabbit reviews pull requests (`.coderabbit.yaml`). Its comments are advice,
not an approval: a human code owner still reviews and merges.
