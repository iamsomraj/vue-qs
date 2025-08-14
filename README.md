# vue-qs

![vue-qs social](https://iamsomraj.github.io/vue-qs/banner.svg)

[![CI](https://github.com/iamsomraj/vue-qs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/iamsomraj/vue-qs/actions/workflows/ci.yml) [![npm version](https://img.shields.io/npm/v/vue-qs.svg)](https://www.npmjs.com/package/vue-qs) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Docs: https://iamsomraj.github.io/vue-qs/ · 中文文档: https://iamsomraj.github.io/vue-qs/zh/

Type‑safe, reactive URL query params for Vue 3. Inspired by nuqs (React) but built for the Vue Composition API.

## Why

Keep UI state (page, filters, search text, sort, tabs) in the URL so users can:

- Refresh and keep state
- Share links
- Use back / forward buttons

vue-qs gives you small composables that feel like normal refs / reactive objects, but they stay in sync with the query string. You pick the type (string, number, boolean, Date, enum, arrays, custom) through codecs.

## Install

```sh
npm i vue-qs
# or
pnpm add vue-qs
# or
bun add vue-qs
```

Peer dependency: vue ^3.3. Vue Router ^4.2 is optional (only if you want to integrate with router navigation).

## Quick start (no router)

```vue
<script setup lang="ts">
import { useQueryRef } from 'vue-qs';

// Create a ref bound to ?name=...
// If the param is missing we fall back to the default ('').
const name = useQueryRef('name', { defaultValue: '', parseFunction: String });
</script>

<template>
  <input v-model="name" placeholder="Your name" />
</template>
```

Multiple params in one reactive object:

```vue
<script setup lang="ts">
import { useQueryReactive } from 'vue-qs';

// Each field config controls parsing, defaults, omission rules
const { queryState } = useQueryReactive({
  q: { defaultValue: '' },
  page: { defaultValue: 1, parseFunction: Number },
});
</script>

<template>
  <input v-model="queryState.q" />
  <button @click="queryState.page++">Next</button>
</template>
```

## Using Vue Router

Two ways:

1. Pass an adapter directly

```vue
<script setup lang="ts">
import { useQueryRef, useQueryReactive, createVueRouterAdapter } from 'vue-qs';
import { useRouter } from 'vue-router';

const adapter = createVueRouterAdapter(useRouter());

const page = useQueryRef<number>('page', {
  defaultValue: 1,
  parseFunction: Number,
  queryAdapter: adapter,
});
const { queryState } = useQueryReactive({ q: { defaultValue: '' } }, { queryAdapter: adapter });
</script>
```

2. Provide a global adapter once (recommended)

```ts
// main.ts
import { createApp } from 'vue';
import { createVueQsPlugin, createVueRouterAdapter } from 'vue-qs';
import { router } from './router';
import App from './App.vue';

createApp(App)
  .use(createVueQsPlugin({ queryAdapter: createVueRouterAdapter(router) }))
  .use(router)
  .mount('#app');
```

## Two‑way sync (URL -> state)

Disabled by default. Turn on with `enableTwoWaySync: true` to react to back/forward and router navigations.

```ts
const page = useQueryRef('page', {
  defaultValue: 1,
  parseFunction: Number,
  enableTwoWaySync: true,
});
const { queryState } = useQueryReactive({ q: { defaultValue: '' } }, { enableTwoWaySync: true });
```

## Omitting defaults

By default if a value equals its `defaultValue`, the param is removed from the URL for cleanliness. Want it always there? Set `shouldOmitDefault: false`.

Call `.syncToUrl()` on a ref or the reactive group to force a write right now.

## Codecs (parse + serialize)

Import ready‑made codecs:

```ts
import { serializers } from 'vue-qs';

const n = useQueryRef('n', { defaultValue: 0, parseFunction: serializers.numberCodec.parse });
const b = useQueryRef('b', { defaultValue: false, parseFunction: serializers.booleanCodec.parse });
const tags = useQueryRef('tags', {
  defaultValue: [] as string[],
  codec: serializers.createArrayCodec(serializers.stringCodec),
});
```

Use `codec` instead of separate `parseFunction` / `serializeFunction` for brevity.

Available built‑ins: `stringCodec`, `numberCodec`, `booleanCodec`, `dateISOCodec`, `createJsonCodec<T>()`, `createArrayCodec(codec)`, `createEnumCodec([...])`.

## Batch updates

Update several params in one history entry:

```ts
const { queryState, updateBatch } = useQueryReactive({
  q: { defaultValue: '' },
  page: { defaultValue: 1 },
});
updateBatch({ q: 'hello', page: 2 }, { historyStrategy: 'push' });
```

## Custom equality

For objects/arrays supply `isEqual(a,b)` to decide if current value equals the default (so it can be omitted).

```ts
const jsonCodec = serializers.createJsonCodec<{ a: number }>();
const item = useQueryRef('obj', {
  defaultValue: { a: 1 },
  codec: jsonCodec,
  isEqual: (x, y) => x?.a === y?.a,
});
```

## SSR safety

On the server the hooks never touch `window`. They use an internal cache until hydration, so you can render initial HTML safely.

## Mini API reference

useQueryRef(name, options)

- Returns a ref with extra method `.syncToUrl()`.

useQueryReactive(schema, options)

- Returns `{ queryState, updateBatch, syncAllToUrl }`.

createHistoryAdapter(options)

- Creates adapter for browser History API (default choice).

createVueRouterAdapter(router)

- Creates adapter for Vue Router (enables reacting to navigations).

createVueQsPlugin({ queryAdapter }) / provideQueryAdapter(adapter)

- Provide an adapter globally or locally.

## Options snapshot

Shared options:

- defaultValue: initial value if param is missing
- parseFunction / serializeFunction OR codec: convert string <-> type
- shouldOmitDefault (default true): remove from URL when equal to default
- isEqual: custom compare (deep equality, etc.)
- historyStrategy: 'replace' (default) or 'push'
- enableTwoWaySync: listen to back/forward & router changes
- queryAdapter: override which query adapter to use

Extra on reactive version:

- updateBatch(update, { historyStrategy }): multi‑field update

## Contributing

Clone and install:

```sh
bun install
```

Dev build (watch):

```sh
bun run dev
```

Run tests / typecheck / lint:

```sh
bun run test
bun run typecheck
bun run lint
```

Docs local dev:

```sh
bun run docs:dev
```

PRs and issues welcome (see CONTRIBUTING.md).

## License

MIT
