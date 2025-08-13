# Vue QS

**Type‑safe, reactive URL query params for Vue**

[![npm version](https://img.shields.io/npm/v/vue-qs.svg)](https://www.npmjs.com/package/vue-qs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, type-safe, and flexible URL query parameter state management library for Vue 3. Think "nuqs for Vue" - manage your app's URL search parameters with full type safety, comprehensive error handling, and modern conventions.

## 🚀 Features

- **🔒 Full Type Safety** - TypeScript-first with complete type inference
- **⚡ Performance Optimized** - Efficient URL synchronization with minimal re-renders
- **🛡️ Error Resilient** - Comprehensive try-catch blocks and optional chaining
- **📚 Well Documented** - Extensive JSDoc comments for better DX
- **🏗️ Clean Architecture** - Modular folder structure with clear separation of concerns
- **🔄 Two-way Sync** - Optional bidirectional URL ↔ state synchronization
- **🎨 Multiple Adapters** - Works with History API, Vue Router, or custom adapters
- **🧩 Rich Serializers** - Built-in support for strings, numbers, booleans, dates, JSON, arrays, enums
- **⚙️ Highly Configurable** - Flexible options for every use case
- **📦 Tree Shakeable** - Import only what you need
- **🏃 SSR Compatible** - Server-side rendering ready

## 📦 Installation

```bash
# npm
npm install vue-qs

# yarn
yarn add vue-qs

# pnpm
pnpm add vue-qs

# bun
bun add vue-qs
```

## 🎯 Quick Start

### Basic Usage with `useQueryRef`

```typescript
import { useQueryRef, numberCodec, booleanCodec } from 'vue-qs';

// Simple string parameter
const searchQuery = useQueryRef('search', {
  defaultValue: '',
  enableTwoWaySync: true,
});

// Number parameter with validation
const currentPage = useQueryRef('page', {
  defaultValue: 1,
  codec: numberCodec,
  shouldOmitDefault: true,
});

// Boolean parameter
const showDetails = useQueryRef('details', {
  defaultValue: false,
  codec: booleanCodec,
});

// Usage in template or script
searchQuery.value = 'hello world'; // Updates URL automatically
currentPage.value = 2; // URL becomes ?search=hello+world&page=2

// Manual synchronization
searchQuery.syncToUrl();
```

### Multiple Parameters with `useQueryReactive`

```typescript
import { useQueryReactive, numberCodec, booleanCodec, createEnumCodec } from 'vue-qs';

const querySchema = {
  search: {
    defaultValue: '',
    shouldOmitDefault: true,
  },
  page: {
    defaultValue: 1,
    codec: numberCodec,
  },
  sort: {
    defaultValue: 'name' as const,
    codec: createEnumCodec(['name', 'date', 'popularity'] as const),
  },
  showArchived: {
    defaultValue: false,
    codec: booleanCodec,
  },
} as const;

const { queryState, updateBatch, syncAllToUrl } = useQueryReactive(querySchema, {
  enableTwoWaySync: true,
  historyStrategy: 'replace',
});

// Reactive access to all parameters
console.log(queryState.search, queryState.page, queryState.sort);

// Update individual parameters (automatically syncs to URL)
queryState.search = 'vue.js';
queryState.page = 2;

// Batch update multiple parameters
updateBatch({
  search: 'typescript',
  page: 1,
  showArchived: true,
});

// Manual sync all parameters
syncAllToUrl();
```

## 🔧 Configuration

### Vue Plugin Setup (Recommended)

```typescript
import { createApp } from 'vue';
import { createVueQueryPlugin, createHistoryAdapter } from 'vue-qs';

const app = createApp(App);

// Create and configure the adapter
const { queryAdapter } = createHistoryAdapter();

// Install the plugin
app.use(createVueQueryPlugin({ queryAdapter }));

app.mount('#app');
```

### Vue Router Integration

```typescript
import { createRouter, createWebHistory } from 'vue-router';
import { createVueQueryPlugin, createVueRouterAdapter } from 'vue-qs';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    /* your routes */
  ],
});

const vueRouterAdapter = createVueRouterAdapter(router);
app.use(createVueQueryPlugin({ queryAdapter: vueRouterAdapter }));
```

### Manual Provider (for specific components)

```typescript
import { provideQueryAdapter, createHistoryAdapter } from 'vue-qs';

// In a parent component
const { queryAdapter } = createHistoryAdapter();
provideQueryAdapter(queryAdapter);
```

## 🎨 Built-in Serializers

Vue QS provides robust serializers for common data types:

```typescript
import {
  stringCodec,
  numberCodec,
  booleanCodec,
  dateISOCodec,
  createJsonCodec,
  createArrayCodec,
  createEnumCodec,
} from 'vue-qs';

// String (default)
const name = useQueryRef('name', {
  defaultValue: '',
  codec: stringCodec, // Can be omitted as it's the default
});

// Number with NaN handling
const count = useQueryRef('count', {
  defaultValue: 0,
  codec: numberCodec, // Handles invalid numbers gracefully
});

// Boolean (treats 'true'/'1' as true)
const isActive = useQueryRef('active', {
  defaultValue: false,
  codec: booleanCodec,
});

// ISO Date strings
const createdAt = useQueryRef('created', {
  defaultValue: new Date(),
  codec: dateISOCodec, // Converts to/from ISO strings
});

// JSON objects with error handling
const filters = useQueryRef('filters', {
  defaultValue: { category: 'all' },
  codec: createJsonCodec<{ category: string }>(),
});

// Arrays with custom delimiters
const tags = useQueryRef('tags', {
  defaultValue: [] as string[],
  codec: createArrayCodec(stringCodec, '|'), // Custom delimiter
});

// Enums with fallbacks
const sortOrder = useQueryRef('sort', {
  defaultValue: 'asc' as const,
  codec: createEnumCodec(['asc', 'desc'] as const),
});
```

## ⚙️ Advanced Configuration

### Custom Parser and Serializer

```typescript
const customParam = useQueryRef('custom', {
  defaultValue: { id: 0, name: '' },
  parseFunction: (rawValue) => {
    try {
      if (!rawValue) return { id: 0, name: '' };
      const [id, name] = rawValue.split(':');
      return { id: parseInt(id) || 0, name: name || '' };
    } catch {
      return { id: 0, name: '' };
    }
  },
  serializeFunction: (value) => {
    try {
      return `${value.id}:${value.name}`;
    } catch {
      return null;
    }
  },
});
```

### Custom Equality and Default Handling

```typescript
const user = useQueryRef('user', {
  defaultValue: { id: 1, role: 'user' },
  codec: createJsonCodec<{ id: number; role: string }>(),
  isEqual: (a, b) => a?.id === b?.id && a?.role === b?.role,
  shouldOmitDefault: false, // Always include in URL
});
```

### Two-way Synchronization

Enable automatic updates when the URL changes (e.g., browser back/forward):

```typescript
const searchState = useQueryReactive(
  {
    query: { defaultValue: '' },
    filters: { defaultValue: {} as Record<string, string> },
  },
  {
    enableTwoWaySync: true, // Enables URL → state sync
    historyStrategy: 'replace', // or 'push'
  }
);
```

## 🏗️ Architecture

The rewritten vue-qs follows clean architecture principles:

```
src/
├── types.ts                    # Core TypeScript definitions
├── index.ts                    # Main exports
├── serializers.ts              # Built-in codecs with error handling
├── adapterContext.ts          # Vue dependency injection
├── core/
│   └── injection-keys.ts      # DI keys
├── utils/
│   └── core-helpers.ts        # Utility functions with try-catch
├── adapters/
│   ├── history-adapter.ts     # Browser History API adapter
│   └── vue-router-adapter.ts  # Vue Router integration
└── composables/
    ├── use-query-ref.ts       # Single parameter composable
    └── use-query-reactive.ts  # Multiple parameters composable
```

## 🔄 Migration from v0.1.x

The new API uses more descriptive naming and better conventions:

```typescript
// Old API
const page = useQueryRef('page', {
  default: 1, // → defaultValue: 1
  parse: Number, // → parseFunction: Number or codec: numberCodec
  serialize: String, // → serializeFunction: String or codec: numberCodec
  omitIfDefault: true, // → shouldOmitDefault: true
  twoWay: true, // → enableTwoWaySync: true
  history: 'push', // → historyStrategy: 'push'
  adapter: myAdapter, // → queryAdapter: myAdapter
});

page.sync(); // → page.syncToUrl()

// Old reactive API
const { state, batch, sync } = useQueryReactive(schema);
// New reactive API
const { queryState, updateBatch, syncAllToUrl } = useQueryReactive(schema);
```

## 🛡️ Error Handling

Vue QS now includes comprehensive error handling:

```typescript
// All serializers include try-catch blocks
const safeNumber = useQueryRef('num', {
  codec: numberCodec, // Returns NaN for invalid input instead of throwing
});

// All parsing operations are wrapped
const safeJson = useQueryRef('data', {
  codec: createJsonCodec<MyType>(), // Returns null for invalid JSON
});

// Utility functions use optional chaining
import { parseSearchString, buildSearchString } from 'vue-qs';

const params = parseSearchString('?invalid=data'); // Never throws
const url = buildSearchString({ key: undefined }); // Handles edge cases
```

## 📚 API Reference

### Core Composables

#### `useQueryRef<T>(name: string, options?: UseQueryRefOptions<T>)`

Manages a single URL query parameter as a reactive Vue ref.

**Parameters:**

- `name` - The URL parameter name
- `options` - Configuration options

**Returns:** `QueryRefReturn<T>` - Reactive ref with `syncToUrl()` method

#### `useQueryReactive<TSchema>(schema: TSchema, options?: UseQueryReactiveOptions)`

Manages multiple URL query parameters as a reactive object.

**Parameters:**

- `schema` - Object defining parameter configurations
- `options` - Global configuration options

**Returns:** `QueryReactiveReturn<TSchema>` with `queryState`, `updateBatch()`, and `syncAllToUrl()`

### Adapters

#### `createHistoryAdapter(options?: HistoryAdapterOptions)`

Creates an adapter using the browser's History API.

#### `createVueRouterAdapter(router: Router, options?: VueRouterAdapterOptions)`

Creates an adapter that integrates with Vue Router.

### Serializers

All serializers include error handling and return sensible defaults for invalid input:

- `stringCodec` - String values (default)
- `numberCodec` - Numeric values with NaN fallback
- `booleanCodec` - Boolean values ('true'/'1' → true)
- `dateISOCodec` - ISO date strings
- `createJsonCodec<T>()` - JSON serialization with error handling
- `createArrayCodec(elementCodec, delimiter?)` - Array serialization
- `createEnumCodec(allowedValues)` - Enum with fallback to first value

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [nuqs](https://github.com/47ng/nuqs) for React
- Built with ❤️ for the Vue.js community
