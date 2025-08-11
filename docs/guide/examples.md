# Examples

## Common codecs

Use built-in serializers for common types.

```ts
import { useQueryRef, serializers } from 'vue-qs';

const n = useQueryRef('n', { default: 0, codec: serializers.number });
const b = useQueryRef('b', { default: false, codec: serializers.boolean });
const tags = useQueryRef<string[]>('tags', {
  default: [],
  codec: serializers.arrayOf(serializers.string),
});
```

## Always keep defaults in URL

```ts
const page = useQueryRef('page', { default: 1, codec: serializers.number, omitIfDefault: false });
```

## Batch updates (fewer history entries)

```ts
const { state, batch } = useQueryReactive({ q: { default: '' }, page: { default: 1 } });
batch({ q: 'hello', page: 2 }, { history: 'push' });
```

## Two-way sync with browser navigation

```ts
const page = useQueryRef('page', { default: 1, codec: serializers.number, twoWay: true });
```

Or for multiple params:

```ts
const { state } = useQueryReactive(schema, { twoWay: true });
```
