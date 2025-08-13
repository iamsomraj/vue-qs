# Hash Adapter

The hash adapter enables vue-qs to use the browser hash for URL parameter storage, similar to VueUse's `useUrlSearchParams` hash mode support. This is particularly useful for SPAs using hash routing or when you want to store parameters in the hash fragment.

## Features

- **Hash mode**: Store parameters in hash fragment with route preservation (`#/route?foo=bar`)
- **Hash-params mode**: Store parameters as the entire hash fragment (`#foo=bar`)
- **Two-way synchronization**: Automatic sync with external hash changes
- **History strategy**: Support for both `push` and `replace` navigation
- **SSR compatible**: Works in server environments with fallback cache
- **Type-safe**: Full TypeScript support with proper typings

## Usage

### Basic Setup

```typescript
import { createHashAdapter } from 'vue-qs';

// Hash mode (default) - preserves route: #/route?foo=bar
const { queryAdapter } = createHashAdapter({ mode: 'hash' });

// Hash-params mode - entire hash as params: #foo=bar
const { queryAdapter: hashParamsAdapter } = createHashAdapter({ mode: 'hash-params' });
```

### With Vue Plugin

```typescript
// main.ts
import { createApp } from 'vue';
import { createVueQsPlugin, createHashAdapter } from 'vue-qs';

const app = createApp(App);

// Use hash mode globally
app.use(
  createVueQsPlugin({
    queryAdapter: createHashAdapter({ mode: 'hash' }),
  })
);

// Or hash-params mode
app.use(
  createVueQsPlugin({
    queryAdapter: createHashAdapter({ mode: 'hash-params' }),
  })
);
```

### With useQueryRef

```vue
<script setup lang="ts">
import { useQueryRef, createHashAdapter } from 'vue-qs';

const adapter = createHashAdapter({ mode: 'hash' });

// Single parameter with hash adapter
const searchQuery = useQueryRef('q', {
  defaultValue: '',
  queryAdapter: adapter,
});

// With typed parameter
const currentPage = useQueryRef('page', {
  defaultValue: 1,
  parseFunction: Number,
  queryAdapter: adapter,
});
</script>

<template>
  <input v-model="searchQuery" placeholder="Search..." />
  <button @click="currentPage++">Next Page</button>
  <p>Query: {{ searchQuery }}, Page: {{ currentPage }}</p>
</template>
```

### With useQueryReactive

```vue
<script setup lang="ts">
import { useQueryReactive, createHashAdapter } from 'vue-qs';

const adapter = createHashAdapter({ mode: 'hash-params' });

// Multiple parameters in hash-params mode
const { queryState, updateBatch } = useQueryReactive(
  {
    q: { defaultValue: '' },
    category: { defaultValue: 'all' },
    page: { defaultValue: 1, parseFunction: Number },
    sort: { defaultValue: 'date' },
  },
  { queryAdapter: adapter }
);

// Batch update all parameters
const resetFilters = () => {
  updateBatch({
    q: '',
    category: 'all',
    page: 1,
    sort: 'date',
  });
};
</script>

<template>
  <div>
    <input v-model="queryState.q" placeholder="Search..." />
    <select v-model="queryState.category">
      <option value="all">All Categories</option>
      <option value="tech">Technology</option>
      <option value="science">Science</option>
    </select>
    <select v-model="queryState.sort">
      <option value="date">Sort by Date</option>
      <option value="popularity">Sort by Popularity</option>
    </select>
    <button @click="queryState.page++">Next Page</button>
    <button @click="resetFilters">Reset Filters</button>
  </div>
</template>
```

## Modes

### Hash Mode (`hash`)

In hash mode, parameters are stored after the route part in the hash fragment:

```typescript
const adapter = createHashAdapter({ mode: 'hash' });

// URL examples:
// #/users?page=2&sort=name
// #/search?q=vue&filters=active
// #/?tab=settings&theme=dark
```

**Characteristics:**

- Preserves existing route structure
- Parameters are appended after the route with `?`
- Compatible with hash-based routers
- Route navigation maintains parameters

### Hash-params Mode (`hash-params`)

In hash-params mode, the entire hash fragment becomes the query string:

```typescript
const adapter = createHashAdapter({ mode: 'hash-params' });

// URL examples:
// #page=2&sort=name
// #q=vue&filters=active
// #tab=settings&theme=dark
```

**Characteristics:**

- Entire hash is treated as parameters
- No route preservation
- More compact URLs
- Useful when hash routing is not needed

## Configuration Options

```typescript
interface HashAdapterOptions {
  /** The hash mode to use (default: 'hash') */
  mode?: 'hash' | 'hash-params';

  /** Whether to suppress custom history events (default: false) */
  suppressHistoryEvents?: boolean;
}
```

### Example with all options:

```typescript
const { queryAdapter } = createHashAdapter({
  mode: 'hash-params',
  suppressHistoryEvents: true, // Don't emit custom events
});
```

## Advanced Usage

### Two-way Synchronization

Enable automatic sync with external hash changes:

```typescript
const nameParam = useQueryRef('name', {
  defaultValue: '',
  queryAdapter: createHashAdapter({ mode: 'hash' }),
  enableTwoWaySync: true, // Sync with external changes
});

// Manually changing hash will update the ref
// window.location.hash = '#/route?name=updated'
```

### History Strategy

Control browser history behavior:

```typescript
const searchParam = useQueryRef('q', {
  defaultValue: '',
  queryAdapter: createHashAdapter({ mode: 'hash' }),
  historyStrategy: 'push', // Create new history entries
});

// Or with replace strategy (default)
const filterParam = useQueryRef('filter', {
  defaultValue: 'all',
  queryAdapter: createHashAdapter({ mode: 'hash' }),
  historyStrategy: 'replace', // Replace current history entry
});
```

### Custom Codecs with Hash Adapter

```typescript
import { createHashAdapter, createArrayCodec, createEnumCodec } from 'vue-qs';

const adapter = createHashAdapter({ mode: 'hash-params' });

// Array parameters
const selectedIds = useQueryRef('ids', {
  defaultValue: [] as number[],
  codec: createArrayCodec(Number),
  queryAdapter: adapter,
});

// Enum parameters
type Theme = 'light' | 'dark' | 'auto';
const theme = useQueryRef('theme', {
  defaultValue: 'light' as Theme,
  codec: createEnumCodec(['light', 'dark', 'auto']),
  queryAdapter: adapter,
});
```

### Error Handling

The hash adapter includes built-in error handling:

```typescript
// Graceful fallback for malformed hash
// Invalid: #invalid%hash%content
// Result: {} (empty object, no errors thrown)

// Graceful fallback for serialization errors
// Invalid values are omitted from the hash
```

## Comparison with VueUse

| Feature            | vue-qs Hash Adapter  | VueUse useUrlSearchParams |
| ------------------ | -------------------- | ------------------------- |
| Hash mode          | ✅ `#/route?foo=bar` | ✅ `#/route?foo=bar`      |
| Hash-params mode   | ✅ `#foo=bar`        | ✅ `#foo=bar`             |
| Type safety        | ✅ Full codec system | ❌ Basic string handling  |
| Custom serializers | ✅ Built-in + custom | ✅ Custom stringify only  |
| Two-way sync       | ✅ Configurable      | ✅ Always on              |
| History strategy   | ✅ Push/Replace      | ❌ Replace only           |
| SSR support        | ✅ Built-in          | ❌ Browser only           |
| Vue integration    | ✅ Plugin system     | ✅ Direct import          |

## Browser Support

- Modern browsers with `URLSearchParams` support
- Hash change event support (`hashchange`)
- History API support for navigation

## Best Practices

1. **Choose the right mode**: Use `hash` for SPAs with routes, `hash-params` for simple parameter storage
2. **Enable two-way sync**: When users might manually edit the hash
3. **Use appropriate history strategy**: `push` for navigation, `replace` for filters
4. **Leverage codecs**: Use built-in codecs for proper type conversion and validation
5. **Handle edge cases**: Always provide sensible defaults for parameters

## Migration from VueUse

If you're migrating from VueUse's `useUrlSearchParams`:

```typescript
// VueUse
import { useUrlSearchParams } from '@vueuse/core';
const params = useUrlSearchParams('hash');

// vue-qs equivalent
import { useQueryReactive, createHashAdapter } from 'vue-qs';
const adapter = createHashAdapter({ mode: 'hash' });
const { queryState } = useQueryReactive(
  {
    // Define your parameter schema
  },
  { queryAdapter: adapter }
);
```

The main differences:

- vue-qs requires explicit parameter schema definition
- vue-qs provides better type safety through codecs
- vue-qs supports more configuration options
- vue-qs has built-in SSR support
