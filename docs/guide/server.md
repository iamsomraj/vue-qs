# Server utilities

`vue-qs/server` exports Vue-free helpers to parse and build search params outside
components: in Nuxt server routes, route middleware, data loaders, or any Node code.
Everything here is also exported from `vue-qs`.

Define parsers once and share them between components and the server:

```ts
// search-params.ts
import { parseAsInteger, parseAsString } from 'vue-qs/server';

export const searchParams = {
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
};
```

## createLoader

`createLoader` returns a function that parses search params into typed values,
applying defaults:

```ts
import { createLoader } from 'vue-qs/server';
import { searchParams } from './search-params';

export const loadSearchParams = createLoader(searchParams);
```

It accepts many input types:

```ts
loadSearchParams('https://example.com/?q=vue'); // URL string
loadSearchParams('?q=vue&page=2'); // query string
loadSearchParams(new URL(request.url)); // URL
loadSearchParams(new URLSearchParams('q=vue')); // URLSearchParams
loadSearchParams(request); // Request
loadSearchParams(route.query); // Vue Router query
loadSearchParams(getQuery(event)); // H3 / Nitro query
await loadSearchParams(promiseOfAnyOfTheAbove); // Promise
```

In a Nuxt server route:

```ts
// server/api/items.get.ts
import { loadSearchParams } from '~/search-params';

export default defineEventHandler((event) => {
  const { q, page } = loadSearchParams(getQuery(event));
  return findItems({ q, page });
});
```

Invalid values fall back to the default. Pass `{ strict: true }` to throw instead:

```ts
loadSearchParams('?page=abc', { strict: true }); // throws
```

Use `urlKeys` when the URL uses different key names:

```ts
createLoader(searchParams, { urlKeys: { page: 'p' } });
```

## createSerializer

`createSerializer` builds type-safe URLs, e.g. for links:

```ts
import { createSerializer } from 'vue-qs';
import { searchParams } from './search-params';

const serialize = createSerializer(searchParams);

serialize({ q: 'vue', page: 2 }); // '?q=vue&page=2'
serialize('/search', { q: 'vue' }); // '/search?q=vue'
serialize('/search?lang=en#top', { page: 3 }); // '/search?lang=en&page=3#top'
serialize('/search?q=vue&page=2', { q: null }); // '/search?page=2'
serialize('/search?q=vue&lang=en', null); // '/search?lang=en' (clears known keys)
```

```vue
<RouterLink :to="serialize('/search', { q: 'nuxt' })">Search Nuxt</RouterLink>
```

Options: `clearOnDefault` (default `true`) and `urlKeys`.

## createStandardSchemaV1

Creates a [Standard Schema](https://standardschema.dev) from parsers, for libraries
that validate search params with Standard Schemas:

```ts
import { createStandardSchemaV1 } from 'vue-qs/server';

const schema = createStandardSchemaV1(searchParams, { partialOutput: true });
```

## About `createSearchParamsCache`

nuqs's `createSearchParamsCache` exists for React Server Components and has no
equivalent in Vue. Use `createLoader` instead.
