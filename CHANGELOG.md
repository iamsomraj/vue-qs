# Changelog

## v0.2.1

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.2.0...v0.2.1)

### 🩹 Fixes

- Resync state after a rejected router navigation and skip no-op history updates ([f6067b5](https://github.com/iamsomraj/vue-qs/commit/f6067b5))
  - Vue Router: when a navigation guard cancels or redirects an update, state now follows the resulting URL
  - History: `history: 'push'` no longer adds a duplicate entry when the URL does not change
  - Custom adapters can return `false` from `updateUrl` to signal a rejected update

### 📖 Documentation

- Unique page titles and descriptions, canonical URLs, Open Graph / Twitter images, sitemap, robots.txt, local search and a version menu ([51e3a41](https://github.com/iamsomraj/vue-qs/commit/51e3a41))
- Regenerate the API reference with source links ([7ae11cb](https://github.com/iamsomraj/vue-qs/commit/7ae11cb))

### 🏡 Chore

- CI: format and publint checks, Node 20/22/24 matrix, and tests against the minimum peer versions (vue 3.3, vue-router 4.2) ([51e3a41](https://github.com/iamsomraj/vue-qs/commit/51e3a41))
- Add SECURITY.md, a pull request template and Dependabot; update the issue templates, CONTRIBUTING.md and LICENSE; remove legacy config files ([51e3a41](https://github.com/iamsomraj/vue-qs/commit/51e3a41))

### ❤️ Contributors

- Somraj Mukherjee ([@iamsomraj](https://github.com/iamsomraj))

## v0.2.0

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.1.18...v0.2.0)

vue-qs is now a port of [nuqs](https://nuqs.dev) for Vue. See the [migration guide](https://iamsomraj.github.io/vue-qs/guide/migration).

### ⚠️ Breaking Changes

- Remove `queryRef`, `queryReactive`, `createVueQsPlugin`, the `*Codec` serializers and the URL utilities, replaced by the nuqs-style API below ([#14](https://github.com/iamsomraj/vue-qs/issues/14))
- Adapters are imported from `vue-qs/adapters/history` and `vue-qs/adapters/vue-router`, and must be installed with `createVueQs({ adapter })`; composables throw when no adapter is provided
- Missing keys without a default are `null` instead of `undefined`; invalid values fall back to the default

### 🚀 Enhancements

- Add `useQueryState`, returning a writable ref (works with `v-model`) with a `.set(value | updater | null, options)` method returning a promise
- Add `useQueryStates`, returning a reactive object with `$set` and `urlKeys` support
- Add nuqs parsers: `parseAsString`, `parseAsInteger`, `parseAsFloat`, `parseAsHex`, `parseAsIndex`, `parseAsBoolean`, `parseAsTimestamp`, `parseAsIsoDateTime`, `parseAsIsoDate`, `parseAsStringEnum`, `parseAsStringLiteral`, `parseAsNumberLiteral`, `parseAsArrayOf`, `parseAsNativeArrayOf`, `parseAsJson` (validator or Standard Schema), `createParser`, `createMultiParser`, with `.withDefault()` and `.withOptions()`
- Add nuqs options: `history`, `scroll`, `shallow`, `clearOnDefault` (default `true`), `limitUrlUpdates` with `throttle()` / `debounce()`
- Batch updates made in the same tick into a single URL update
- Keep composables bound to the same key in sync
- Support repeated keys (`?id=1&id=2`)
- Add `createLoader`, `createSerializer` and `createStandardSchemaV1`, also available Vue-free from `vue-qs/server`
- Add the testing adapter (`vue-qs/adapters/testing`), `createAdapter` for custom adapters and the `VueQsAdapter` component
- Debug logging with `localStorage.debug = 'vue-qs'`

### 🩹 Fixes

- Vue Router adapter now follows every navigation (`router.push`, `<RouterLink>`), not only Back/Forward
- History adapter follows `pushState` / `replaceState` calls made by other code
- Update queues are scoped per adapter, so state no longer leaks between apps or SSR requests

### 📖 Documentation

- Rewrite the README and guides: parsers, options, adapters (including Nuxt), server utilities, testing, examples and migration from 0.1.x

### ✅ Tests

- Rewrite the test suite: parsers, serializer, loader, update queue, composables, History and Vue Router adapters, and type-level tests

### ❤️ Contributors

- Somraj Mukherjee ([@iamsomraj](https://github.com/iamsomraj))

## v0.1.18

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.1.17...v0.1.18)

### 🚀 Enhancements

- Add isUpdating method to QueryAdapter and prevent infinite loops during URL updates ([5c47647](https://github.com/iamsomraj/vue-qs/commit/5c47647))
- Enhance package.json and README for clarity and usability ([75960a4](https://github.com/iamsomraj/vue-qs/commit/75960a4))

### 🩹 Fixes

- Update createEnumCodec to allow undefined values and adjust related tests ([28d9815](https://github.com/iamsomraj/vue-qs/commit/28d9815))

### 💅 Refactors

- Simplify queryReactive and queryRef APIs ([d23e55e](https://github.com/iamsomraj/vue-qs/commit/d23e55e))
- Remove unit tests for vue-router adapter, query reactive, query ref, serializers, and core helpers ([da5af50](https://github.com/iamsomraj/vue-qs/commit/da5af50))
- Update import paths to use alias for better readability ([c46bf58](https://github.com/iamsomraj/vue-qs/commit/c46bf58))

### 📖 Documentation

- Remove redundant active development notice from README ([e4c5161](https://github.com/iamsomraj/vue-qs/commit/e4c5161))

### 🏡 Chore

- Update documentation for vue-qs v0.1.17 ([03a7742](https://github.com/iamsomraj/vue-qs/commit/03a7742))
- Update import paths in unit tests and standardize markdown separators ([111de7c](https://github.com/iamsomraj/vue-qs/commit/111de7c))
- Update version to 0.1.18-beta.7 and adjust documentation ([bc37e2b](https://github.com/iamsomraj/vue-qs/commit/bc37e2b))

### ✅ Tests

- Add comprehensive unit tests for serializers, Vue components, and Vue Router integration ([8d1dd83](https://github.com/iamsomraj/vue-qs/commit/8d1dd83))
- Add unit tests for serializers including string, number, boolean, date, JSON, array, and enum codecs ([388f009](https://github.com/iamsomraj/vue-qs/commit/388f009))
- Add integration tests for BasicQueryRefComponent and QueryReactiveComponent with history and Vue Router support ([560b507](https://github.com/iamsomraj/vue-qs/commit/560b507))

### ❤️ Contributors

- Iamsomraj ([@iamsomraj](https://github.com/iamsomraj))
- Somraj Mukherjee ([@iamsomraj](https://github.com/iamsomraj))

## v0.1.17

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.1.16...v0.1.17)

### 💅 Refactors

- Rename useQueryRef and useQueryReactive to queryRef and queryReactive ([a3913bb](https://github.com/iamsomraj/vue-qs/commit/a3913bb))
- Remove two-way synchronization feature from queryRef and queryReactive ([479c0d0](https://github.com/iamsomraj/vue-qs/commit/479c0d0))
- Update query parameter parsing method from parseFunction to parse ([d77e2e1](https://github.com/iamsomraj/vue-qs/commit/d77e2e1))

### 📖 Documentation

- Remove redundant note about back/forward button usage ([a7f03fa](https://github.com/iamsomraj/vue-qs/commit/a7f03fa))
- Add active development notice to documentation and update package description ([c2299b6](https://github.com/iamsomraj/vue-qs/commit/c2299b6))

### 🏡 Chore

- Update version to v0.1.16-beta.0 and remove HistoryAdapterOptions interface ([824f5e1](https://github.com/iamsomraj/vue-qs/commit/824f5e1))
- **release:** V0.1.16 ([e1f88d6](https://github.com/iamsomraj/vue-qs/commit/e1f88d6))
- Update documentation for vue-qs v0.1.16 ([29c354e](https://github.com/iamsomraj/vue-qs/commit/29c354e))
- Add additional keywords to package.json for better discoverability ([f8ec7fd](https://github.com/iamsomraj/vue-qs/commit/f8ec7fd))

### ❤️ Contributors

- Somraj Mukherjee ([@iamsomraj](https://github.com/iamsomraj))

## v0.1.16

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.1.15...v0.1.16)

### 💅 Refactors

- Rename useQueryRef and useQueryReactive to queryRef and queryReactive ([a3913bb](https://github.com/iamsomraj/vue-qs/commit/a3913bb))
- Remove two-way synchronization feature from queryRef and queryReactive ([479c0d0](https://github.com/iamsomraj/vue-qs/commit/479c0d0))

### 🏡 Chore

- Update documentation for vue-qs v0.1.15 ([cb7da35](https://github.com/iamsomraj/vue-qs/commit/cb7da35))
- Update version to v0.1.16-beta.0 and remove HistoryAdapterOptions interface ([824f5e1](https://github.com/iamsomraj/vue-qs/commit/824f5e1))

### ❤️ Contributors

- Somraj Mukherjee ([@iamsomraj](https://github.com/iamsomraj))

## v0.1.15

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.1.15-beta.2...v0.1.15)

## v0.1.14

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.1.13...v0.1.14)

### 🚀 Enhancements

- Add Chinese API documentation with navigation links ([89e6de3](https://github.com/iamsomraj/vue-qs/commit/89e6de3))

### 🏡 Chore

- **release:** V0.1.13 ([a4643e0](https://github.com/iamsomraj/vue-qs/commit/a4643e0))
- Update version to v0.1.13 in documentation ([4b2f352](https://github.com/iamsomraj/vue-qs/commit/4b2f352))

### ❤️ Contributors

- Somraj Mukherjee ([@iamsomraj](https://github.com/iamsomraj))

## v0.1.13

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.1.12...v0.1.13)

### 🩹 Fixes

- Ensure inject function returns undefined if no query adapter is provided ([bf3da41](https://github.com/iamsomraj/vue-qs/commit/bf3da41))

### 🏡 Chore

- Update version to v0.1.12 in documentation ([a939c82](https://github.com/iamsomraj/vue-qs/commit/a939c82))
- Update links to source code in documentation ([25821b3](https://github.com/iamsomraj/vue-qs/commit/25821b3))
- Update documentation links to reflect new commit references ([eb53bfb](https://github.com/iamsomraj/vue-qs/commit/eb53bfb))

### ❤️ Contributors

- Somraj Mukherjee ([@iamsomraj](https://github.com/iamsomraj))

## v0.1.12

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.1.11...v0.1.12)

### 🏡 Chore

- **release:** V0.1.11 ([be6e959](https://github.com/iamsomraj/vue-qs/commit/be6e959))
- Remove changelog and package.json files ([d8f1c6d](https://github.com/iamsomraj/vue-qs/commit/d8f1c6d))
- **release:** V0.1.11 ([765d964](https://github.com/iamsomraj/vue-qs/commit/765d964))

### ❤️ Contributors

- Somraj Mukherjee ([@iamsomraj](https://github.com/iamsomraj))

## v0.1.11

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.1.11...v0.1.11)

### 🏡 Chore

- **release:** V0.1.11 ([be6e959](https://github.com/iamsomraj/vue-qs/commit/be6e959))
- Remove changelog and package.json files ([d8f1c6d](https://github.com/iamsomraj/vue-qs/commit/d8f1c6d))

### ❤️ Contributors

- Somraj Mukherjee ([@iamsomraj](https://github.com/iamsomraj))

## v0.1.10

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.1.8...v0.1.10)

### 🚀 Enhancements

- Add issue templates for bug reports and feature requests ([c0ab2b5](https://github.com/iamsomraj/vue-qs/commit/c0ab2b5))

### 🩹 Fixes

- Update README to use consistent banner image format ([1e388e2](https://github.com/iamsomraj/vue-qs/commit/1e388e2))

### 💅 Refactors

- Improve documentation and code structure for vue-qs ([ecf86f6](https://github.com/iamsomraj/vue-qs/commit/ecf86f6))
- Consolidate shared history adapter logic and improve batching handling in queryReactive ([08ad70f](https://github.com/iamsomraj/vue-qs/commit/08ad70f))

### 🏡 Chore

- Update version to 0.1.8 and add changelog entry ([c305702](https://github.com/iamsomraj/vue-qs/commit/c305702))
- Update version to 0.1.9 and add changelog entry ([45dc30a](https://github.com/iamsomraj/vue-qs/commit/45dc30a))
- Update version to v0.1.9 in documentation and links ([6a64a7d](https://github.com/iamsomraj/vue-qs/commit/6a64a7d))

### ❤️ Contributors

- Somraj Mukherjee ([@iamsomraj](https://github.com/iamsomraj))

## v0.1.9

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.1.8...v0.1.9)

### 🏡 Chore

- Update version to 0.1.8 and add changelog entry ([c305702](https://github.com/iamsomraj/vue-qs/commit/c305702))

### ❤️ Contributors

- Somraj Mukherjee ([@iamsomraj](https://github.com/iamsomraj))

## v0.1.8

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.1.8...v0.1.8)

## v0.1.7

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.1.5...v0.1.7)

### 🚀 Enhancements

- Add two-way binding support for queryRef and queryReactive with popstate handling ([39c0fa1](https://github.com/iamsomraj/vue-qs/commit/39c0fa1))
- Add custom equals comparator for deep value handling in queryRef and queryReactive ([b1ac89a](https://github.com/iamsomraj/vue-qs/commit/b1ac89a))
- Add global adapter support and enhance query synchronization in Vue 3 ([f04b727](https://github.com/iamsomraj/vue-qs/commit/f04b727))
- Add unit tests for adapter injection and router subscription behavior ([533fb02](https://github.com/iamsomraj/vue-qs/commit/533fb02))
- Enhance query handling by adding codec support for simpler usage in queryRef and queryReactive ([d3e4ee6](https://github.com/iamsomraj/vue-qs/commit/d3e4ee6))
- Optimize adapter retrieval by implementing caching for default adapters in queryRef and queryReactive ([8c26481](https://github.com/iamsomraj/vue-qs/commit/8c26481))

### 🩹 Fixes

- Cache default adapter in queryReactive to prevent unnecessary re-creation ([873d4ee](https://github.com/iamsomraj/vue-qs/commit/873d4ee))

### 💅 Refactors

- Remove unnecessary comments and ESLint version reference ([f44949b](https://github.com/iamsomraj/vue-qs/commit/f44949b))
- Update import paths to use alias for improved module resolution ([3d92f49](https://github.com/iamsomraj/vue-qs/commit/3d92f49))

### 📖 Documentation

- Enhance README for clarity and add Vue Router usage example ([09219a3](https://github.com/iamsomraj/vue-qs/commit/09219a3))
- Update README for clarity and improve examples of query params usage ([b71f4f9](https://github.com/iamsomraj/vue-qs/commit/b71f4f9))

### 🏡 Chore

- Release %s ([d2fff1e](https://github.com/iamsomraj/vue-qs/commit/d2fff1e))
- Adjust release scripts order and commit scope ([7d98e8d](https://github.com/iamsomraj/vue-qs/commit/7d98e8d))
- Refine release scripts to be idempotent ([3afdddc](https://github.com/iamsomraj/vue-qs/commit/3afdddc))
- Release v0.1.8 ([2cdc86c](https://github.com/iamsomraj/vue-qs/commit/2cdc86c))
- Revert version to 0.1.5 and clean up release scripts ([1761646](https://github.com/iamsomraj/vue-qs/commit/1761646))
- Update version to 0.1.6 and enhance changelog with new features and contributors ([2220379](https://github.com/iamsomraj/vue-qs/commit/2220379))

### ✅ Tests

- Enhance queryReactive and queryRef tests with additional codec support ([1806d07](https://github.com/iamsomraj/vue-qs/commit/1806d07))

### ❤️ Contributors

- Somraj Mukherjee ([@iamsomraj](https://github.com/iamsomraj))

## v0.1.6

[compare changes](https://github.com/iamsomraj/vue-qs/compare/v0.1.5...v0.1.6)

### 🚀 Enhancements

- Add two-way binding support for queryRef and queryReactive with popstate handling ([39c0fa1](https://github.com/iamsomraj/vue-qs/commit/39c0fa1))
- Add custom equals comparator for deep value handling in queryRef and queryReactive ([b1ac89a](https://github.com/iamsomraj/vue-qs/commit/b1ac89a))

### 💅 Refactors

- Remove unnecessary comments and ESLint version reference ([f44949b](https://github.com/iamsomraj/vue-qs/commit/f44949b))
- Update import paths to use alias for improved module resolution ([3d92f49](https://github.com/iamsomraj/vue-qs/commit/3d92f49))

### 🏡 Chore

- Release %s ([d2fff1e](https://github.com/iamsomraj/vue-qs/commit/d2fff1e))
- Adjust release scripts order and commit scope ([7d98e8d](https://github.com/iamsomraj/vue-qs/commit/7d98e8d))
- Refine release scripts to be idempotent ([3afdddc](https://github.com/iamsomraj/vue-qs/commit/3afdddc))
- Release v0.1.8 ([2cdc86c](https://github.com/iamsomraj/vue-qs/commit/2cdc86c))
- Revert version to 0.1.5 and clean up release scripts ([1761646](https://github.com/iamsomraj/vue-qs/commit/1761646))

### ✅ Tests

- Enhance queryReactive and queryRef tests with additional codec support ([1806d07](https://github.com/iamsomraj/vue-qs/commit/1806d07))

### ❤️ Contributors

- Somraj Mukherjee ([@iamsomraj](https://github.com/iamsomraj))

## 0.1.0

- Initial release with `queryRef`, `queryReactive`, and Vue Router adapter.
