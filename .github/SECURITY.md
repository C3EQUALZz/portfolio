# Security Policy

## Supported versions

`portfolio` is a personal static site. Only the `master` branch receives
security fixes.

## Reporting a vulnerability

Please **do not open a public issue** for a security problem.

Report it privately through GitHub's
[private vulnerability reporting](https://github.com/C3EQUALZz/portfolio/security/advisories/new),
or by email to <dan.kovalev2013@gmail.com>.

Include, as far as you can:

- what an attacker can do, and what access they need to do it
- the affected area (page, component, workflow)
- a reproduction — a request, a payload, or a failing test

You can expect an acknowledgement within 7 days and an assessment within 30.

## Scope

Especially relevant for this site:

- **Injection through content or translations.** The site renders localized
  dictionaries and static content; a payload that turns them into script
  execution (XSS) is in scope.
- **External links and embedded viewers.** The certificates page embeds local
  PDFs in an iframe and links out to issuers; a way to swap those targets for
  an attacker-controlled origin is in scope.
- **CI / supply chain.** Workflows run third-party actions pinned by SHA; a
  path that lets a pull request run code with a writable token is in scope.

Out of scope: findings that require an already-compromised host, denial of
service by volume alone, and reports produced by a scanner without a
demonstrated impact.
