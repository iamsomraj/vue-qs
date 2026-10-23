---
description: 'How vue-qs compares with VueUse useRouteQuery and hand-written route.query watchers for URL query state in Vue 3.'
---

# Comparison

There are three common ways to keep state in the URL query string in Vue 3. This page sets
them side by side so you can choose the one that fits.

## Watching `route.query` by hand

```ts
const route = useRoute();
const router = useRouter();

const page = computed({
  get: () => Number(route.query.page ?? 1),
  set: (value) => router.replace({ query: { ...route.query, page: String(value) } }),
});
```

This needs no dependency and works well for one or two keys. As the number of keys grows,
you end up writing parsing, defaults, removing keys that hold their default value, and
merging updates made in the same tick, over and over.

## VueUse `useRouteQuery`

[`useRouteQuery`](https://vueuse.org/router/useRouteQuery/) from `@vueuse/router` gives you
a ref bound to one query key, with a default value and an optional `transform`. Pick it if
you already use VueUse and your query state is simple and only needs Vue Router.

## vue-qs

vue-qs is designed for apps where URL state is a large part of the UI, such as filters,
search, tables and dashboards:

- **Parsers**: integers, floats, booleans, dates, enums, literals, arrays and JSON (with
  Standard Schema validation), plus `createParser` for your own types. Each one parses and
  serializes, so the value is typed in both directions.
- **Defaults that keep URLs clean**: `.withDefault()` removes `null` from the type, and
  `clearOnDefault` drops the key from the URL when the value equals the default.
- **Several keys at once**: `useQueryStates` with `urlKeys` for short URL names, and
  `$set` to change several keys in one URL update.
- **Rate limiting**: `throttle` and `debounce` for URL writes, while the state itself
  updates instantly. Useful for search inputs.
- **No router required**: the History API adapter works without Vue Router, and Nuxt is
  supported.
- **Server utilities**: `createLoader` and `createSerializer` reuse the same parsers in
  Nitro handlers and when building links.
- **Testing adapter**: an in-memory adapter for component tests.
- **The nuqs API**: patterns and docs from [nuqs](https://nuqs.dev) carry over, which helps
  teams that use both React and Vue.

## At a glance

|                                    | `route.query` by hand | `useRouteQuery` | vue-qs |
| ---------------------------------- | :-------------------: | :-------------: | :----: |
| No extra dependency                |          ✅           |                 |        |
| Ref you can bind with `v-model`    |   with a `computed`   |       ✅        |   ✅   |
| Built-in typed parsers             |                       |                 |   ✅   |
| Removes keys that hold the default |                       |                 |   ✅   |
| Throttle / debounce URL writes     |                       |                 |   ✅   |
| Works without Vue Router           |                       |                 |   ✅   |
| Server-side loader and serializer  |                       |                 |   ✅   |
| Testing adapter                    |                       |                 |   ✅   |

Ready to try it? Start with [Getting Started](./getting-started), or open the
[StackBlitz playground](https://stackblitz.com/github/iamsomraj/vue-qs/tree/main/examples/vite-vue-router).
