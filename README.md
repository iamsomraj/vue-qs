# vue-qs

[![CI](https://github.com/iamsomraj/vue-qs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/iamsomraj/vue-qs/actions/workflows/ci.yml)

Type-safe, reactive URL query params for Vue 3 — like nuqs, but for Vue.

## Install

```sh
npm i vue-qs
```

Peer deps: `vue@^3.3`. `vue-router@^4.2` is optional.

## TL;DR — copy, paste, go

1. No router? Start here.

```vue
<script setup lang="ts">
import { useQueryRef } from 'vue-qs';

const name = useQueryRef('name', { default: '', parse: String });
</script>

<template>
  <input v-model="name" placeholder="Your name" />
</template>
```

Multiple params:

```vue
<script setup lang="ts">
import { useQueryReactive } from 'vue-qs';

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

2. Using Vue Router? Two options.

- Pass an adapter to hooks (inside components):

```vue
<script setup lang="ts">
import { useQueryRef, useQueryReactive, createVueRouterQueryAdapter } from 'vue-qs';
import { useRouter } from 'vue-router';

const adapter = createVueRouterQueryAdapter(useRouter());

const page = useQueryRef<number>('page', { default: 1, parse: Number, adapter });
const { state } = useQueryReactive({ q: { default: '' } }, { adapter });
</script>
```

- Or set a global adapter once (recommended):

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

## Tips & tricks

- Two-way sync (URL -> state):
  - Pick up back/forward and router navigation.
  - useQueryRef('page', { default: 1, twoWay: true })
  - useQueryReactive(schema, { twoWay: true })

- Defaults are omitted from the URL by default:
  - Set omitIfDefault: false to always keep it.
  - Call .sync() to write current value(s) now.

- Common codecs (types):

  ```ts
  import { serializers } from 'vue-qs';

  const n = useQueryRef('n', { default: 0, parse: serializers.number.parse });
  const b = useQueryRef('b', { default: false, parse: serializers.boolean.parse });
  const tags = useQueryRef('tags', {
    default: [] as string[],
    ...serializers.arrayOf(serializers.string),
  });
  ```

- Batch updates (fewer history entries):

  ```ts
  const { state, batch } = useQueryReactive({ q: { default: '' }, page: { default: 1 } });
  batch({ q: 'hello', page: 2 }, { history: 'push' });
  ```

- SSR-safe: On the server, nothing touches `window`. Values write to an internal cache until the client hydrates.

## Mini API

- useQueryRef(name, options) -> ref with .sync()
- useQueryReactive(schema, options) -> { state, batch, sync }
- createVueRouterQueryAdapter(router)
- createVueQs({ adapter }) / provideQueryAdapter(adapter)

That’s it — keep your state in the URL, with types and great DX.
