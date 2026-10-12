# Migrating from 0.1.x

vue-qs 0.2 is a rewrite that ports the [nuqs](https://nuqs.dev) API to Vue. The 0.1.x
API (`queryRef`, `queryReactive`, codecs) has been removed.

## Setup

An adapter is now required. Install the plugin once:

```ts
// 0.1.x
app.use(createVueQsPlugin({ queryAdapter: createVueRouterAdapter(router) }));

// 0.2
import { createVueQs } from 'vue-qs';
import { createVueRouterAdapter } from 'vue-qs/adapters/vue-router';

app.use(createVueQs({ adapter: createVueRouterAdapter(router) }));
```

Adapters are now imported from subpaths: `vue-qs/adapters/vue-router` and
`vue-qs/adapters/history`.

## Single parameter

```ts
// 0.1.x
const page = queryRef('page', { defaultValue: 1, codec: numberCodec, historyStrategy: 'push' });

// 0.2
const page = useQueryState('page', parseAsInteger.withDefault(1).withOptions({ history: 'push' }));
```

The result is still a writable ref, so `page.value = 2` and `v-model` keep working.

## Several parameters

```ts
// 0.1.x
const state = queryReactive({
  q: { defaultValue: '' },
  page: { defaultValue: 1, codec: numberCodec },
});

// 0.2
const state = useQueryStates({
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
});
```

## Name mapping

| 0.1.x                                     | 0.2                                                          |
| ----------------------------------------- | ------------------------------------------------------------ |
| `queryRef(key, options)`                  | `useQueryState(key, parser)`                                 |
| `queryReactive(schema, options)`          | `useQueryStates(parsers, options)`                           |
| `createVueQsPlugin({ queryAdapter })`     | `createVueQs({ adapter })`                                   |
| `provideQueryAdapter` / `useQueryAdapter` | unchanged                                                    |
| `createHistoryAdapter` (from `vue-qs`)    | `createHistoryAdapter` (from `vue-qs/adapters/history`)      |
| `createVueRouterAdapter` (from `vue-qs`)  | `createVueRouterAdapter` (from `vue-qs/adapters/vue-router`) |
| `stringCodec`                             | `parseAsString`                                              |
| `numberCodec`                             | `parseAsFloat` or `parseAsInteger`                           |
| `booleanCodec`                            | `parseAsBoolean`                                             |
| `dateISOCodec`                            | `parseAsIsoDateTime`                                         |
| `createJsonCodec<T>()`                    | `parseAsJson(validator)`                                     |
| `createArrayCodec(codec, sep)`            | `parseAsArrayOf(parser, sep)`                                |
| `createEnumCodec(values)`                 | `parseAsStringLiteral(values)`                               |
| `{ parse, serialize }` codec              | `createParser({ parse, serialize })`                         |
| `defaultValue: x`                         | `.withDefault(x)`                                            |
| `historyStrategy: 'push'`                 | `history: 'push'`                                            |
| `shouldOmitDefault`                       | `clearOnDefault`                                             |
| `isEqual`                                 | `eq` in `createParser`                                       |
| `parseSearchString` / `buildSearchString` | `createLoader` / `createSerializer`                          |

## Behaviour changes

- **Missing adapter:** composables throw instead of silently creating a History adapter.
- **Vue Router:** state now follows `router.push`, `<RouterLink>` and every navigation.
  In 0.1.x, it only followed Back/Forward.
- **Batching:** updates in the same tick produce one URL update instead of one each.
- **Throttling:** URL updates are throttled to one every 50 ms by default.
- **Missing keys without default** are `null`. In 0.1.x they were `undefined`.
- **Invalid values** fall back to the default. In 0.1.x, `numberCodec` returned `NaN`
  and `createEnumCodec` returned the first allowed value.
- **Booleans:** `parseAsBoolean` accepts `true` (case-insensitive). In 0.1.x, `booleanCodec`
  also accepted `1`.
- **Empty values:** `?q=` parses to `''` with `parseAsString`. In 0.1.x, it was treated
  as missing.
- **Equality:** custom `isEqual` functions move to the parser's `eq`, used for default
  detection and change detection.
- **Utilities removed:** `isBrowserEnvironment`, `createRuntimeEnvironment`,
  `areValuesEqual`, `mergeObjects` and `removeUndefinedValues` are no longer exported.
