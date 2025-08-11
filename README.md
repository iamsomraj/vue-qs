# vue-qs

[![CI](https://github.com/iamsomraj/vue-qs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/iamsomraj/vue-qs/actions/workflows/ci.yml)

Type-safe URL query params state for Vue 3 (nuqs for Vue).

## Install

```sh
npm install vue-qs
```

Peer deps: `vue@^3.3`, `vue-router@^4.2` (router is optional).

## Usage

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
- Works without Vue Router; when present, uses History API-compatible URL updates.
- Defaults omitted from URL by default; configurable per param.

### With Vue Router

```ts
import { useQueryRef, createVueRouterQueryAdapter } from 'vue-qs';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const adapter = createVueRouterQueryAdapter(router);
    const page = useQueryRef<number>('page', { default: 1, parse: Number, adapter });
    return { page };
  },
};
```

### SSR

No direct `window` access on import. When not in a browser, changes write to an internal cache until hydrated on client.

## API

- `useQueryRef(name, options)` -> `ref` with `.sync()`
- `useQueryReactive(schema)` -> `{ state, batch, sync }`

See `src/` for full types and options.

### Built-in serializers

From `import { serializers } from 'vue-qs'`:

- `serializers.string`, `serializers.number`, `serializers.boolean`, `serializers.dateISO`
- `serializers.json<T>()` for object-like values
- `serializers.arrayOf(codec, sep?)` to handle arrays
- `serializers.enumOf(['a','b'] as const)` for enums
