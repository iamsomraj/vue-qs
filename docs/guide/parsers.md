# Parsers

Parsers convert between the strings stored in the URL and typed state. They are the
same as nuqs parsers, and work in the browser and on the server.

```ts
import { parseAsInteger, useQueryState } from 'vue-qs';

const page = useQueryState('page', parseAsInteger.withDefault(1));
```

Parsers are also exported from `vue-qs/server`, which has no Vue dependency.

## Built-in parsers

| Parser                         | State type           | URL example                    |
| ------------------------------ | -------------------- | ------------------------------ |
| `parseAsString`                | `string`             | `?q=hello+world`               |
| `parseAsInteger`               | `number`             | `?page=2`                      |
| `parseAsFloat`                 | `number`             | `?lat=48.8566`                 |
| `parseAsHex`                   | `number`             | `?color=ff`                    |
| `parseAsIndex`                 | `number` (0-based)   | `?page=1` → `0`                |
| `parseAsBoolean`               | `boolean`            | `?open=true`                   |
| `parseAsTimestamp`             | `Date`               | `?t=1735689600000`             |
| `parseAsIsoDateTime`           | `Date`               | `?at=2025-01-01T00:00:00.000Z` |
| `parseAsIsoDate`               | `Date`               | `?day=2025-01-01`              |
| `parseAsStringEnum(values)`    | string enum          | `?dir=UP`                      |
| `parseAsStringLiteral(values)` | string literal union | `?sort=asc`                    |
| `parseAsNumberLiteral(values)` | number literal union | `?dice=6`                      |
| `parseAsArrayOf(parser, sep?)` | `T[]`                | `?tags=vue,nuxt`               |
| `parseAsNativeArrayOf(parser)` | `T[]` (default `[]`) | `?tag=vue&tag=nuxt`            |
| `parseAsJson(validator)`       | `T`                  | `?filters={"a":1}`             |

Invalid values (`?page=abc`) parse to `null`, so the state falls back to the default.

### Literals and enums

```ts
const sort = useQueryState(
  'sort',
  parseAsStringLiteral(['asc', 'desc'] as const).withDefault('asc')
); // Ref<'asc' | 'desc'>

enum Direction {
  up = 'UP',
  down = 'DOWN',
}
const direction = useQueryState('dir', parseAsStringEnum<Direction>(Object.values(Direction)));
```

### Arrays

`parseAsArrayOf` stores items in a single key, joined by a separator (`,` by default).
Separators inside items are encoded.

```ts
const tags = useQueryState('tags', parseAsArrayOf(parseAsString).withDefault([]));
tags.value = ['vue', 'nuxt']; // ?tags=vue,nuxt
```

`parseAsNativeArrayOf` uses repeated keys instead, and defaults to `[]`:

```ts
const ids = useQueryState('id', parseAsNativeArrayOf(parseAsInteger));
ids.value = [1, 2]; // ?id=1&id=2
```

::: tip Replace, don't mutate
State values are not deeply reactive: `tags.value.push('x')` does not update the URL.
Assign a new value instead: `tags.value = [...tags.value, 'x']`.
:::

### JSON

`parseAsJson` requires a validator, because URL content is user input. Pass a function
returning the value (or `null` / throwing when invalid), or any
[Standard Schema](https://standardschema.dev) such as Zod, Valibot or ArkType:

```ts
import { z } from 'zod';

const schema = z.object({ lat: z.number(), lng: z.number() });
const position = useQueryState('pos', parseAsJson(schema));
// Ref<{ lat: number; lng: number } | null>
```

## Default values

`.withDefault(value)` returns the default when the key is missing or invalid, and
removes `null` from the state type:

```ts
const search = useQueryState('q', parseAsString.withDefault(''));
```

By default, setting the state to its default value removes the key from the URL
(`clearOnDefault: true`). See [Options](./options#clear-on-default).

For strings, you can also pass the default as an option:

```ts
const search = useQueryState('q', { defaultValue: '' });
```

## Options on parsers

`.withOptions()` attaches [options](./options) to a parser. Builder methods can be
chained in any order:

```ts
const page = useQueryState(
  'page',
  parseAsInteger.withDefault(1).withOptions({ history: 'push', scroll: true })
);
```

## Custom parsers

Use `createParser` to build a parser with the same builder methods:

```ts
import { createParser } from 'vue-qs';

const parseAsStarRating = createParser({
  parse: (value) => {
    const stars = value.match(/★/g)?.length ?? 0;
    return stars > 0 ? stars : null;
  },
  serialize: (value) => '★'.repeat(value),
});

const rating = useQueryState('rating', parseAsStarRating.withDefault(1));
```

Provide `eq` when values are objects, so vue-qs can detect default values and changes:

```ts
const parseAsPoint = createParser({
  parse: (value) => {
    const [x, y] = value.split(':').map(Number);
    return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
  },
  serialize: ({ x, y }) => `${x}:${y}`,
  eq: (a, b) => a.x === b.x && a.y === b.y,
});
```

`createMultiParser` does the same for parsers reading repeated keys (`string[]`).

## Server-side parsing

Every parser has `parseServerSide`, which accepts `string | string[] | undefined`
(as found in a route or H3 query object) and applies the default:

```ts
parseAsInteger.withDefault(1).parseServerSide(query.page); // number
```

To parse several keys at once, use [`createLoader`](./server#createloader).

## Inferring types

```ts
import type { inferParserType } from 'vue-qs';

const searchParams = {
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
};
type SearchParams = inferParserType<typeof searchParams>; // { q: string; page: number }
```
