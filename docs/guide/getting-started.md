# Getting Started

Keep important UI state (search text, page number, filters) in the URL, not hidden in component memory. `vue-qs` makes this easy with two composables.

## Install

```bash
npm i vue-qs
# or
pnpm add vue-qs
# or
bun add vue-qs
```

Peer dependency: `vue@^3.3`. Optional: `vue-router@^4.2` if you want router integration.

## Single param (ref)

```vue
<script setup lang="ts">
import { useQueryRef } from 'vue-qs';

// A ref bound to ?name=... (falls back to default when missing)
const name = useQueryRef('name', { default: '' });
</script>

<template>
  <input v-model="name" placeholder="Your name" />
</template>
```

## Multiple params (reactive object)

```vue
<script setup lang="ts">
import { useQueryReactive } from 'vue-qs';

const { state } = useQueryReactive({
  search: { default: '' },
  page: { default: 1, parse: Number },
});
</script>

<template>
  <input v-model="state.search" />
  <button @click="state.page++">Next</button>
</template>
```

## What the hooks give you

- `useQueryRef(name, options)` → a normal ref with an added `.sync()` method.
- `useQueryReactive(schema, options)` → `{ state, batch, sync }`.
  - `state` is a reactive object.
  - `batch()` groups multiple updates into one history entry.
  - `sync()` forces an immediate URL write.
- Both omit defaults from the URL unless you set `omitIfDefault: false`.

## Adapters

You can use `vue-qs` without Vue Router (History API adapter is built‑in). When you do use Router, pass or provide the router adapter so back/forward and navigations stay in sync:

```ts
import { createVueQs, createVueRouterQueryAdapter } from 'vue-qs';
import { router } from './router';

app.use(createVueQs({ adapter: createVueRouterQueryAdapter(router) }));
```

Continue to Examples for patterns like codecs, two‑way sync, batching, and custom equality.
