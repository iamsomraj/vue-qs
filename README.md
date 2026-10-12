# vue-qs

![vue-qs social](https://iamsomraj.github.io/vue-qs/banner.svg)

[![CI](https://github.com/iamsomraj/vue-qs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/iamsomraj/vue-qs/actions/workflows/ci.yml) [![npm version](https://img.shields.io/npm/v/vue-qs.svg)](https://www.npmjs.com/package/vue-qs) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Type-safe search params state manager for Vue 3. A port of [nuqs](https://nuqs.dev)
that uses Vue idioms: writable refs, `v-model`, reactive objects and a plugin.

📖 **Documentation**: [https://iamsomraj.github.io/vue-qs/](https://iamsomraj.github.io/vue-qs/)

```ts
const page = useQueryState('page', parseAsInteger.withDefault(1));
page.value++; // ?page=2
```

## Features

- 🧩 **The nuqs API**: the same parsers, options and behaviour, adapted to Vue
- 🔒 **Type-safe**: typed state from parsers, with `null` removed by `.withDefault()`
- ✍️ **Writable refs**: assign `.value` or use `v-model`; `.set()` for options and promises
- 📦 **Batched updates**: changes in the same tick produce a single URL update
- ⏱️ **Throttle & debounce**: state is instant, URL writes are rate-limited
- 🧭 **Adapters**: Vue Router (and Nuxt), History API, testing, custom
- 🖥️ **Server utilities**: `createLoader` and `createSerializer` share your parsers
- 🧪 **Testable**: an in-memory testing adapter

## Installation

```sh
npm install vue-qs
```

Requires Vue 3.3+. `vue-router` 4 is an optional peer dependency.

## Setup

Install the plugin with an adapter:

```ts
import { createApp } from 'vue';
import { createVueQs } from 'vue-qs';
import { createVueRouterAdapter } from 'vue-qs/adapters/vue-router';
// Without a router: import { createHistoryAdapter } from 'vue-qs/adapters/history'

createApp(App)
  .use(router)
  .use(createVueQs({ adapter: createVueRouterAdapter(router) }))
  .mount('#app');
```

For Nuxt, see the [adapters guide](https://iamsomraj.github.io/vue-qs/guide/adapters#nuxt).

## Usage

```vue
<script setup lang="ts">
import { parseAsInteger, useQueryState } from 'vue-qs';

const name = useQueryState('name'); // Ref<string | null>
const count = useQueryState('count', parseAsInteger.withDefault(0)); // Ref<number>
</script>

<template>
  <input v-model="name" placeholder="Your name" />
  <button @click="count++">Count: {{ count }}</button>
  <button @click="count = 0">Reset</button>
  <!-- the default clears ?count -->
</template>
```

### Updating with options

```ts
await count.set((c) => c + 1, { history: 'push', scroll: true });
await count.set(null); // removes ?count, count.value === 0
```

### Several keys

```ts
import { toRefs } from 'vue';
import { parseAsFloat, useQueryStates } from 'vue-qs';

const coordinates = useQueryStates(
  { lat: parseAsFloat.withDefault(0), lng: parseAsFloat.withDefault(0) },
  { urlKeys: { lat: 'y', lng: 'x' } }
);

coordinates.lat = 48.85; // ?y=48.85
await coordinates.$set({ lat: 1, lng: 2 }); // one URL update
const { lat, lng } = toRefs(coordinates); // refs for v-model
```

## Parsers

`parseAsString`, `parseAsInteger`, `parseAsFloat`, `parseAsHex`, `parseAsIndex`,
`parseAsBoolean`, `parseAsTimestamp`, `parseAsIsoDateTime`, `parseAsIsoDate`,
`parseAsStringEnum`, `parseAsStringLiteral`, `parseAsNumberLiteral`, `parseAsArrayOf`,
`parseAsNativeArrayOf`, `parseAsJson` (with a validator or Standard Schema), and
`createParser` for your own. See the [parsers guide](https://iamsomraj.github.io/vue-qs/guide/parsers).

## Options

| Option            | Default        | Description                                      |
| ----------------- | -------------- | ------------------------------------------------ |
| `history`         | `'replace'`    | `'push'` creates a history entry                 |
| `scroll`          | `false`        | Scroll to top after the update                   |
| `clearOnDefault`  | `true`         | Remove the key when the value equals the default |
| `limitUrlUpdates` | `throttle(50)` | `throttle(ms)` or `debounce(ms)`                 |
| `shallow`         | `true`         | Forwarded to custom adapters                     |

See the [options guide](https://iamsomraj.github.io/vue-qs/guide/options).

## Server

```ts
import { createLoader, createSerializer, parseAsInteger, parseAsString } from 'vue-qs/server';

const searchParams = { q: parseAsString.withDefault(''), page: parseAsInteger.withDefault(1) };

const load = createLoader(searchParams);
load(getQuery(event)); // { q: string; page: number }

const serialize = createSerializer(searchParams);
serialize('/search', { q: 'vue', page: 2 }); // '/search?q=vue&page=2'
```

## Testing

```ts
import { createVueQs } from 'vue-qs';
import { createTestingAdapter } from 'vue-qs/adapters/testing';

const onUrlUpdate = vi.fn();
mount(Component, {
  global: {
    plugins: [
      createVueQs({ adapter: createTestingAdapter({ searchParams: '?count=1', onUrlUpdate }) }),
    ],
  },
});
```

## Migrating from 0.1.x

0.2 replaces `queryRef` / `queryReactive` and codecs with `useQueryState` /
`useQueryStates` and parsers. See the
[migration guide](https://iamsomraj.github.io/vue-qs/guide/migration).

## Credits

vue-qs is a port of [nuqs](https://github.com/47ng/nuqs) by François Best.

## License

MIT
