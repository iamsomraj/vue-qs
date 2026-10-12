---
description: 'Install vue-qs and store Vue 3 state in the URL with useQueryState and useQueryStates: writable refs, typed parsers and v-model support.'
---

# Getting Started

vue-qs is a type-safe search params state manager for Vue 3. It is a port of
[nuqs](https://nuqs.dev) for Vue: the same parsers, options and behaviour, exposed
through writable refs and reactive objects.

```ts
const page = useQueryState('page', parseAsInteger.withDefault(1));
page.value++; // ?page=2
```

## Installation

::: code-group

```sh [npm]
npm install vue-qs
```

```sh [pnpm]
pnpm add vue-qs
```

```sh [bun]
bun add vue-qs
```

:::

Requires Vue 3.3+. `vue-router` (4.2+ or 5) is an optional peer dependency.

## Install the plugin

vue-qs reads and writes the URL through an **adapter**. Install the plugin with the
adapter that matches your app:

::: code-group

```ts [Vue Router]
import { createApp } from 'vue';
import { createVueQs } from 'vue-qs';
import { createVueRouterAdapter } from 'vue-qs/adapters/vue-router';
import { router } from './router';

createApp(App)
  .use(router)
  .use(createVueQs({ adapter: createVueRouterAdapter(router) }))
  .mount('#app');
```

```ts [No router]
import { createApp } from 'vue';
import { createVueQs } from 'vue-qs';
import { createHistoryAdapter } from 'vue-qs/adapters/history';

createApp(App)
  .use(createVueQs({ adapter: createHistoryAdapter() }))
  .mount('#app');
```

:::

Using Nuxt? See [Adapters → Nuxt](./adapters#nuxt).

## Your first query state

```vue
<script setup lang="ts">
import { useQueryState } from 'vue-qs';

const name = useQueryState('name'); // Ref<string | null>
</script>

<template>
  <input v-model="name" placeholder="Your name" />
  <p>Hello, {{ name || 'anonymous visitor' }}!</p>
  <button @click="name = null">Clear</button>
</template>
```

Typing in the input updates `?name=…` in the URL, and navigating Back/Forward
updates the input.

## Typed state with parsers

Without a parser, state is a `string | null`. Pass a [parser](./parsers) to get typed
state, and `.withDefault()` to drop `null`:

```ts
import { parseAsBoolean, parseAsInteger, useQueryState } from 'vue-qs';

const page = useQueryState('page', parseAsInteger.withDefault(1)); // Ref<number>
const open = useQueryState('open', parseAsBoolean); // Ref<boolean | null>
```

When the key is missing or its value is invalid, the state falls back to the default
value. Setting the state to the default (or to `null`) removes the key from the URL.

## Updating state

Assign `.value`, or call `.set()` to pass [options](./options) or wait for the URL update:

```ts
page.value = 2;

await page.set((current) => current + 1); // updater function
await page.set(3, { history: 'push' }); // add a history entry
await page.set(null); // remove ?page (page.value === 1)

const search = await page.set(4); // URLSearchParams after the update
```

Updates made in the same tick are [batched](./options#batching) into a single URL update.

## Several keys at once

`useQueryStates` binds several keys to one reactive object:

```vue
<script setup lang="ts">
import { toRefs } from 'vue';
import { parseAsFloat, useQueryStates } from 'vue-qs';

const coordinates = useQueryStates({
  lat: parseAsFloat.withDefault(45.18),
  lng: parseAsFloat.withDefault(5.72),
});

const { lat, lng } = toRefs(coordinates); // writable refs, for v-model

function reset() {
  coordinates.$set(null); // removes both keys in one update
}
</script>

<template>
  <input v-model.number="lat" type="number" />
  <input v-model.number="lng" type="number" />
</template>
```

## Next steps

- [Parsers](./parsers): every built-in parser and how to write your own
- [Options](./options): history, scroll, batching, throttle and debounce
- [Adapters](./adapters): Vue Router, Nuxt, plain History API, custom adapters
- [Server](./server): `createLoader` and `createSerializer`
- [Testing](./testing): unit-testing components that use vue-qs
- [Migrating from 0.1.x](./migration)
