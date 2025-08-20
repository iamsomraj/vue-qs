# vue-qs

![vue-qs social](https://iamsomraj.github.io/vue-qs/banner.svg)

[![CI](https://github.com/iamsomraj/vue-qs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/iamsomraj/vue-qs/actions/workflows/ci.yml) [![npm version](https://img.shields.io/npm/v/vue-qs.svg)](https://www.npmjs.com/package/vue-qs) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **Note**: This library is currently in active development. APIs may change significantly between versions. Please use with caution and expect breaking changes.

📖 **Documentation**: [https://iamsomraj.github.io/vue-qs/](https://iamsomraj.github.io/vue-qs/)  
🌏 **中文文档**: [https://iamsomraj.github.io/vue-qs/zh/](https://iamsomraj.github.io/vue-qs/zh/)

Type‑safe, reactive URL query parameters for Vue 3. Inspired by [nuqs](https://nuqs.47ng.com/) (React) but built for the Vue Composition API.

## ✨ Features

- 🔄 **Bidirectional Sync**: URL parameters stay in sync with your reactive state
- 🎯 **Type Safety**: Full TypeScript support with type inference
- 🚀 **Vue 3 Ready**: Built for Vue 3 Composition API
- 🔧 **Flexible**: Works with or without Vue Router
- 🛡️ **SSR Safe**: Server-side rendering compatible
- 📦 **Tree Shakeable**: Only import what you need
- 🎨 **Customizable**: Built-in codecs + custom serialization support

## 🎯 Why vue-qs?

Keep UI state (page, filters, search text, sort, tabs) in the URL so users can:

- 🔄 **Refresh and keep state**
- 🔗 **Share links with specific state**
- ⬅️➡️ **Use browser back/forward buttons**

vue-qs gives you composables that feel like normal refs/reactive objects, but they automatically stay in sync with the URL query string.

## 📦 Installation

```bash
npm install vue-qs
# or
pnpm add vue-qs
# or
bun add vue-qs
```

**Peer Dependencies:**

- `vue` ^3.3.0 (required)
- `vue-router` ^4.2.0 (optional, for router integration)

## 🚀 Quick Start

### Basic Usage (No Router)

```vue
<script setup lang="ts">
import { queryRef } from 'vue-qs';

// Create a ref bound to ?name=...
// Falls back to default value if param is missing
const name = queryRef('name', {
  defaultValue: '',
});
</script>

<template>
  <input v-model="name" placeholder="Your name" />
</template>
```

### Multiple Parameters

```vue
<script setup lang="ts">
import { queryReactive } from 'vue-qs';

// Each field config controls parsing, defaults, and omission rules
const queryState = queryReactive({
  q: { defaultValue: '' },
  page: { defaultValue: 1, codec: numberCodec },
  showDetails: { defaultValue: false, codec: booleanCodec },
});
</script>

<template>
  <input v-model="queryState.q" placeholder="Search..." />
  <button @click="queryState.page++">Next Page</button>
  <button @click="queryState.showDetails = !queryState.showDetails">Toggle Details</button>
</template>
```

## 🔗 Vue Router Integration

### Option 1: Global Plugin (Recommended)

```ts
// main.ts
import { createApp } from 'vue';
import { createVueQsPlugin, createVueRouterAdapter } from 'vue-qs';
import { router } from './router';
import App from './App.vue';

const app = createApp(App);

app.use(
  createVueQsPlugin({
    queryAdapter: createVueRouterAdapter(router),
  })
);
app.use(router);
app.mount('#app');
```

### Option 2: Per-Component Adapter

```vue
<script setup lang="ts">
import { queryRef, createVueRouterAdapter } from 'vue-qs';
import { useRouter } from 'vue-router';

const router = useRouter();
const adapter = createVueRouterAdapter(router);

const page = queryRef('page', {
  defaultValue: 1,
  codec: numberCodec,
  queryAdapter: adapter,
});
</script>
```

## 🔧 Codecs (Type Conversion)

Import ready‑made codecs for common types:

```ts
import {
  stringCodec,
  numberCodec,
  booleanCodec,
  dateISOCodec,
  createArrayCodec,
  createJsonCodec,
} from 'vue-qs';

// Basic types
const name = queryRef('name', {
  defaultValue: '',
  codec: stringCodec,
});

const page = queryRef('page', {
  defaultValue: 1,
  codec: numberCodec,
});

const isActive = queryRef('active', {
  defaultValue: false,
  codec: booleanCodec,
});

// Complex types
const tags = queryRef('tags', {
  defaultValue: [] as string[],
  codec: createArrayCodec(stringCodec),
});

const filters = queryRef('filters', {
  defaultValue: { category: 'all', sort: 'name' },
  codec: createJsonCodec<{ category: string; sort: string }>(),
});
```

## ⚙️ Configuration Options

### Shared Options

| Option              | Type                      | Default       | Description                                  |
| ------------------- | ------------------------- | ------------- | -------------------------------------------- |
| `defaultValue`      | `T`                       | -             | Initial value if parameter is missing        |
| `codec`             | `QueryCodec<T>`           | `stringCodec` | Parser and serializer for the type           |
| `parse`             | `QueryParser<T>`          | -             | Custom parser function (overrides codec)     |
| `serializeFunction` | `QuerySerializer<T>`      | -             | Custom serializer function (overrides codec) |
| `shouldOmitDefault` | `boolean`                 | `true`        | Remove from URL when equal to default        |
| `isEqual`           | `(a: T, b: T) => boolean` | `Object.is`   | Custom equality function                     |
| `historyStrategy`   | `'replace' \| 'push'`     | `'replace'`   | Browser history update strategy              |
| `queryAdapter`      | `QueryAdapter`            | -             | Override default query adapter               |

### Custom Equality Example

```ts
const filters = queryRef('filters', {
  defaultValue: { category: 'all', sort: 'name' },
  codec: createJsonCodec<{ category: string; sort: string }>(),
  isEqual: (a, b) => a.category === b.category && a.sort === b.sort,
});
```

## 🛡️ SSR Safety

vue-qs is SSR-safe. On the server, the composables use an internal cache until hydration, so you can render initial HTML safely without touching `window`.

## 📚 API Reference

### `queryRef(name, options)`

Creates a reactive ref that syncs with a URL query parameter.

```ts
function queryRef<T>(parameterName: string, options?: QueryRefOptions<T>): Ref<T>;
```

### `queryReactive(schema, options)`

Creates a reactive object that syncs multiple URL query parameters.

```ts
function queryReactive<TSchema extends QueryParameterSchema>(
  parameterSchema: TSchema,
  options?: QueryReactiveOptions
): ReactiveQueryState<TSchema>;
```

### `createHistoryAdapter()`

Creates an adapter for browser History API (default).

```ts
function createHistoryAdapter(): QueryAdapter;
```

### `createVueRouterAdapter(router)`

Creates an adapter for Vue Router integration.

```ts
function createVueRouterAdapter(router: Router): QueryAdapter;
```

### Development Setup

```bash
# Clone and install
git clone https://github.com/iamsomraj/vue-qs.git
cd vue-qs
bun install

# Development
bun run dev          # Watch mode
bun run test         # Run tests
bun run typecheck    # Type checking
bun run lint         # Linting
bun run docs:dev     # Documentation dev server
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Inspired by [nuqs](https://nuqs.47ng.com/) for React
- Built with [Vue 3](https://vuejs.org/) Composition API
- TypeScript support powered by [TypeScript](https://www.typescriptlang.org/)
