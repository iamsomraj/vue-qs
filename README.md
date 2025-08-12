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
const name = useQueryRef('name', { default: '', parse: String });
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
const { state } = useQueryReactive({
  q: { default: '' },
  page: { default: 1, parse: Number },
});
</script>

<template>
  <input v-model="state.q" />
  <button @click="state.page++">Next</button>
</template>
```

## Using Vue Router

Two ways:

1. Pass an adapter directly

```vue
<script setup lang="ts">
import { useQueryRef, useQueryReactive, createVueRouterQueryAdapter } from 'vue-qs';
import { useRouter } from 'vue-router';

const adapter = createVueRouterQueryAdapter(useRouter());

const page = useQueryRef<number>('page', { default: 1, parse: Number, adapter });
const { state } = useQueryReactive({ q: { default: '' } }, { adapter });
</script>
```

2. Provide a global adapter once (recommended)

```ts
// main.ts
import { createApp } from 'vue';
import { createVueQs, createVueRouterQueryAdapter } from 'vue-qs';
import { router } from './router';
import App from './App.vue';

createApp(App)
  .use(createVueQs({ adapter: createVueRouterQueryAdapter(router) }))
  .use(router)
  .mount('#app');
```

## Two‑way sync (URL -> state)

Disabled by default. Turn on with `twoWay: true` to react to back/forward and router navigations.

```ts
const page = useQueryRef('page', { default: 1, parse: Number, twoWay: true });
const { state } = useQueryReactive({ q: { default: '' } }, { twoWay: true });
```

## Omitting defaults

By default if a value equals its `default`, the param is removed from the URL for cleanliness. Want it always there? Set `omitIfDefault: false`.

Call `.sync()` on a ref or the reactive group to force a write right now.

## Codecs (parse + serialize)

Import ready‑made codecs:

```ts
import { serializers } from 'vue-qs';

const n = useQueryRef('n', { default: 0, parse: serializers.number.parse });
const b = useQueryRef('b', { default: false, parse: serializers.boolean.parse });
const tags = useQueryRef('tags', {
  default: [] as string[],
  codec: serializers.arrayOf(serializers.string),
});
```

Use `codec` instead of separate `parse` / `serialize` for brevity.

Available built‑ins: `string`, `number`, `boolean`, `dateISO`, `json<T>()`, `arrayOf(codec)`, `enumOf([...])`.

## Batch updates

Update several params in one history entry:

```ts
const { state, batch } = useQueryReactive({ q: { default: '' }, page: { default: 1 } });
batch({ q: 'hello', page: 2 }, { history: 'push' });
```

## Custom equality

For objects/arrays supply `equals(a,b)` to decide if current value equals the default (so it can be omitted).

```ts
const jsonCodec = serializers.json<{ a: number }>();
const item = useQueryRef('obj', {
  default: { a: 1 },
  codec: jsonCodec,
  equals: (x, y) => x?.a === y?.a,
});
```

## SSR safety

On the server the hooks never touch `window`. They use an internal cache until hydration, so you can render initial HTML safely.

## Mini API reference

useQueryRef(name, options)

- Returns a ref with extra method `.sync()`.

useQueryReactive(schema, options)

- Returns `{ state, batch, sync }`.

createVueRouterQueryAdapter(router)

- Adapter for Vue Router (enables reacting to navigations).

createVueQs({ adapter }) / provideQueryAdapter(adapter)

- Provide an adapter globally or locally.

## Options snapshot

Shared options:

- default: initial value if param is missing
- parse / serialize OR codec: convert string <-> type
- omitIfDefault (default true): remove from URL when equal to default
- equals: custom compare (deep equality, etc.)
- history: 'replace' (default) or 'push'
- twoWay: listen to back/forward & router changes
- adapter: override which query adapter to use

Extra on reactive version:

- batch(update, { history }): multi‑field update

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
