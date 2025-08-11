# vue-qs

[![CI](https://github.com/iamsomraj/vue-qs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/iamsomraj/vue-qs/actions/workflows/ci.yml)

Type-safe, reactive URL query params state for Vue 3 (nuqs for Vue).

## Install

```sh
npm install vue-qs
```

Peer deps: `vue@^3.3`, `vue-router@^4.2` (router is optional).

## Quick start

A minimal example that keeps an input bound to a `name` query param.

```vue
<script setup lang="ts">
import { useQueryRef } from 'vue-qs';

const name = useQueryRef('name', { default: '', parse: String });
</script>

<template>
  <input v-model="name" placeholder="Your name" />
</template>
```

A small reactive group of params using `useQueryReactive`:

```vue
<script setup lang="ts">
import { useQueryReactive } from 'vue-qs';

const { state } = useQueryReactive({
  search: { default: '' },
  sort: { default: 'asc' as 'asc' | 'desc' },
});
</script>

<template>
  <input v-model="state.search" placeholder="Search" />
  <select v-model="state.sort">
    <option value="asc">asc</option>
    <option value="desc">desc</option>
  </select>
  <!-- URL: ?search=...&sort=asc|desc -->
</template>
```

Using Vue Router (optional; recommended if your app uses vue-router):

```vue
<script setup lang="ts">
import { useQueryRef, useQueryReactive, createVueRouterQueryAdapter } from 'vue-qs';

import { useRouter } from 'vue-router';

const router = useRouter();
const adapter = createVueRouterQueryAdapter(router);

const page = useQueryRef<number>('page', { default: 1, parse: Number, adapter });

const { state } = useQueryReactive(
  {
    search: { default: '' },
    sort: { default: 'asc' as 'asc' | 'desc' },
  },
  { adapter }
);
</script>
```

Global adapter (plugin) for DX:

```ts
// main.ts
import { createApp } from 'vue';
import { createVueQs, createVueRouterQueryAdapter } from 'vue-qs';
import { router } from './router';
import App from './App.vue';

const app = createApp(App);
app.use(createVueQs({ adapter: createVueRouterQueryAdapter(router) }));
app.use(router);
app.mount('#app');
```

Then you can omit `adapter` in hooks; they pick the injected one.

Two-way sync (URL -> state):

```ts
const page = useQueryRef('page', { default: 1, twoWay: true });
// or
const { state } = useQueryReactive({ q: { default: '' } }, { twoWay: true });
```

When using the router adapter, internal navigation (router.push/replace or back/forward) triggers updates via the adapter's subscription.

## Advanced usage with serializers

```ts
import { useQueryRef, useQueryReactive, serializers } from 'vue-qs';

export default {
  setup() {
    const page = useQueryRef<number>('page', { default: 1, parse: Number });

    const filters = useQueryReactive({
      search: { default: '', parse: serializers.string.parse },
      sort: { default: 'asc' as 'asc' | 'desc', parse: serializers.string.parse },
      tags: {
        default: [] as string[],
        parse: serializers.arrayOf(serializers.string).parse,
        serialize: serializers.arrayOf(serializers.string).serialize,
      },
      minPrice: {
        default: null as number | null,
        parse: (s) => (s == null ? null : serializers.number.parse(s)),
      },
    });

    return { page, filters };
  },
};
```

- SSR-safe (no window access on server).
- Works with or without Vue Router; when present, uses History API-compatible URL updates.
- Defaults are omitted from the URL; configurable per param.

### SSR

No direct `window` access on import. When not in a browser, changes write to an internal cache until hydration on the client.

## API

- `useQueryRef(name, options)` -> `ref` with `.sync()`
- `useQueryReactive(schema)` -> `{ state, batch, sync }`
- `createVueQs({ adapter })` Vue plugin to provide a global adapter
- `provideQueryAdapter(adapter)` and `useQueryAdapter()` for manual DI

See `src/` for full types and options.

### Built-in serializers

From `import { serializers } from 'vue-qs'`:

- `serializers.string`, `serializers.number`, `serializers.boolean`, `serializers.dateISO`
- `serializers.json<T>()` for object-like values
- `serializers.arrayOf(codec, sep?)` to handle arrays
- `serializers.enumOf(['a','b'] as const)` for enums
