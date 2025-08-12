# Examples

## Common codecs

```ts
import { useQueryRef, serializers } from 'vue-qs';

const itemCount = useQueryRef('itemCount', { default: 0, codec: serializers.number });
const isPublished = useQueryRef('isPublished', { default: false, codec: serializers.boolean });
const tags = useQueryRef<string[]>('tags', {
  default: [],
  codec: serializers.arrayOf(serializers.string),
});
```

## Keep defaults in the URL

```ts
const page = useQueryRef('page', { default: 1, codec: serializers.number, omitIfDefault: false });
```

## Batch updates (one history entry)

```ts
const { state, batch } = useQueryReactive({ search: { default: '' }, page: { default: 1 } });
batch({ search: 'hello', page: 2 }, { history: 'push' });
```

## Two‑way sync (URL -> state)

```ts
const page = useQueryRef('page', { default: 1, codec: serializers.number, twoWay: true });
```

Reactive version:

```ts
const { state } = useQueryReactive(schema, { twoWay: true });
```

## Deep equality for objects

```ts
const jsonCodec = serializers.json<{ a: number }>();
const obj = useQueryRef('obj', {
  default: { a: 1 },
  codec: jsonCodec,
  equals: (x, y) => x?.a === y?.a,
});
```

## Enum + array combo

```ts
const sort = useQueryRef<'asc' | 'desc'>('sort', {
  default: 'asc',
  codec: serializers.enumOf(['asc', 'desc'] as const),
});
const selectedIds = useQueryRef<number[]>('ids', {
  default: [],
  codec: serializers.arrayOf(serializers.number),
});
```
