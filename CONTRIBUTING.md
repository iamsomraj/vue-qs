# Contributing to vue-qs

Thanks for your interest in contributing! vue-qs is a port of [nuqs](https://nuqs.dev) for
Vue: when proposing a feature or behaviour change, check how nuqs handles it first.

## Development

Requires Node 22.12+ and [Bun](https://bun.sh) 1.4+.

```sh
bun install
bun run test:watch   # tests in watch mode
bun run docs:dev     # documentation site
```

Before opening a pull request, run:

```sh
bun run lint && bun run typecheck && bun run test && bun run build && bun run format
```

| Script               | Description                                            |
| -------------------- | ------------------------------------------------------ |
| `bun run test`       | Unit, adapter and type-level tests (Vitest)            |
| `bun run typecheck`  | TypeScript check                                       |
| `bun run lint`       | ESLint                                                 |
| `bun run format:fix` | Prettier                                               |
| `bun run build`      | Build `dist/` with tsup                                |
| `bun run docs:api`   | Generate the API reference (`docs/api`, not committed) |
| `bun run docs:build` | Generate the API reference and build the docs site     |

## Workflow

1. Open (or pick) an issue.
2. Create a branch named `<issue-number>-<short-slug>`, e.g. `42-fix-hash-routing`.
3. Make **one commit** using [Conventional Commits](https://www.conventionalcommits.org)
   (`feat:`, `fix:`, `docs:`, `chore:`, `test:`…, with `!` for breaking changes) and
   reference the issue (`Closes #42`). Amend and force-push instead of adding commits.
4. Open a pull request. It is squash-merged once CI passes.

## Release process (maintainers)

1. Open a `chore(release): vX.Y.Z` pull request that bumps `package.json` and adds a
   `CHANGELOG.md` section, then merge it.
2. Tag and create the GitHub release:
   ```sh
   git tag -a vX.Y.Z -m vX.Y.Z && git push origin vX.Y.Z
   gh release create vX.Y.Z --notes-file <notes>
   ```
3. Publish (`prepublishOnly` runs every check): `npm publish --otp=<code>`
4. The `Docs` workflow deploys the documentation to GitHub Pages when the release is
   published. To redeploy manually, run `bun run docs:deploy` (triggers the workflow).

## Reporting issues

- Bugs: include a minimal reproduction (StackBlitz or a repository) and the debug logs
  (`localStorage.debug = 'vue-qs'`).
- Security issues: see [SECURITY.md](SECURITY.md).
