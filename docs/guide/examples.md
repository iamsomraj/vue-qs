# Examples

## Common codecs

```ts
import { useQueryRef, serializers } from 'vue-qs';

const itemCount = useQueryRef('itemCount', { defaultValue: 0, codec: serializers.numberCodec });
const isPublished = useQueryRef('isPublished', {
  defaultValue: false,
  codec: serializers.booleanCodec,
});
const tags = useQueryRef<string[]>('tags', {
  defaultValue: [],
  codec: serializers.createArrayCodec(serializers.stringCodec),
});
```

## Keep defaults in the URL

```ts
const page = useQueryRef('page', {
  defaultValue: 1,
  codec: serializers.numberCodec,
  shouldOmitDefault: false,
});
```

## Batch updates (one history entry)

```ts
const { queryState, updateBatch } = useQueryReactive({
  search: { defaultValue: '' },
  page: { defaultValue: 1 },
});
updateBatch({ search: 'hello', page: 2 }, { historyStrategy: 'push' });
```

## Two‑way sync (URL -> state)

```ts
const page = useQueryRef('page', {
  defaultValue: 1,
  codec: serializers.numberCodec,
  enableTwoWaySync: true,
});
```

Reactive version:

```ts
const { queryState } = useQueryReactive(schema, { enableTwoWaySync: true });
```

## Deep equality for objects

```ts
const jsonCodec = serializers.createJsonCodec<{ a: number }>();
const obj = useQueryRef('obj', {
  defaultValue: { a: 1 },
  codec: jsonCodec,
  isEqual: (x, y) => x?.a === y?.a,
});
```

## Enum + array combo

```ts
const sort = useQueryRef<'asc' | 'desc'>('sort', {
  defaultValue: 'asc',
  codec: serializers.createEnumCodec(['asc', 'desc'] as const),
});
const selectedIds = useQueryRef<number[]>('ids', {
  defaultValue: [],
  codec: serializers.createArrayCodec(serializers.numberCodec),
});
```
