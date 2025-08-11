# Getting Started

vue-qs keeps your Vue 3 state in the URL query string, with types and minimal ceremony.

## Installation

```bash
npm i vue-qs
# or
pnpm add vue-qs
# or
bun add vue-qs
```

Peer dependencies: `vue@^3.3`. `vue-router@^4.2` is optional.

## Quick start

Single param with a ref:

```vue
<script setup lang="ts">
import { useQueryRef } from 'vue-qs';

const name = useQueryRef('name', { default: '' });
</script>

<template>
  <input v-model="name" placeholder="Your name" />
</template>
```

Multiple params with a reactive object:

```vue
<script setup lang="ts">
import { useQueryReactive } from 'vue-qs';

const { state } = useQueryReactive({
  q: { default: '' },
  page: { default: 1, codec: { parse: Number, serialize: (n: number) => String(n) } },
});
</script>

<template>
  <input v-model="state.q" />
  <button @click="state.page++">Next</button>
</template>
```

## Concepts

- useQueryRef: manage one query param as a `Ref<T>` with a `.sync()` helper.
- useQueryReactive: manage multiple params as a single reactive object with `batch()` and `sync()`.
- Adapters: swap out how the URL is read/written (History API by default, Vue Router via adapter).

Continue to Examples for more patterns.
