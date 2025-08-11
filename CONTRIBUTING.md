# Contributing to vue-qs

Thanks for your interest in contributing!

## Development

- Requires Node 18+ and Bun 1.2+
- Install deps: `bun install`
- Run typecheck/lint/tests: `bun run typecheck && bun run lint && bun run test`
- Build: `bun run build`

## Commit style

Any clear commit messages are fine. Conventional Commits are welcome.

## Release process

- Update `CHANGELOG.md`
- Bump version in `package.json`
- Run `bun run prepublishOnly` locally
- `npm publish --access public`

## Issues & PRs

- Please include a minimal repro when reporting bugs.
- For feature requests, describe use cases and API proposals.
