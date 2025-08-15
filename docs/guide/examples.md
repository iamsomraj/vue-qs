# Examples

## Common codecs

```ts
import { queryRef, serializers } from 'vue-qs';

const itemCount = queryRef('itemCount', { defaultValue: 0, codec: serializers.numberCodec });
const isPublished = queryRef('isPublished', {
  defaultValue: false,
  codec: serializers.booleanCodec,
});
const tags = queryRef<string[]>('tags', {
  defaultValue: [],
  codec: serializers.createArrayCodec(serializers.stringCodec),
});
```

## Keep defaults in the URL

```ts
const page = queryRef('page', {
  defaultValue: 1,
  codec: serializers.numberCodec,
  shouldOmitDefault: false,
});
```

## Batch updates (one history entry)

```ts
const { queryState, updateBatch } = queryReactive({
  search: { defaultValue: '' },
  page: { defaultValue: 1 },
});
updateBatch({ search: 'hello', page: 2 }, { historyStrategy: 'push' });
```

## Two‑way sync (URL -> state)

```ts
const page = queryRef('page', {
  defaultValue: 1,
  codec: serializers.numberCodec,
  enableTwoWaySync: true,
});
```

Reactive version:

```ts
const { queryState } = queryReactive(schema, { enableTwoWaySync: true });
```

## Deep equality for objects

```ts
const jsonCodec = serializers.createJsonCodec<{ a: number }>();
const obj = queryRef('obj', {
  defaultValue: { a: 1 },
  codec: jsonCodec,
  isEqual: (x, y) => x?.a === y?.a,
});
```

## Enum + array combo

```ts
const sort = queryRef<'asc' | 'desc'>('sort', {
  defaultValue: 'asc',
  codec: serializers.createEnumCodec(['asc', 'desc'] as const),
});
const selectedIds = queryRef<number[]>('ids', {
  defaultValue: [],
  codec: serializers.createArrayCodec(serializers.numberCodec),
});
```
