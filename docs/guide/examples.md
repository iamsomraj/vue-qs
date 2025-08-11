# Examples

## Common codecs

Use built-in serializers for common types.

```ts
import { useQueryRef, serializers } from 'vue-qs';

const itemCount = useQueryRef('itemCount', { default: 0, codec: serializers.number });
const isPublished = useQueryRef('isPublished', { default: false, codec: serializers.boolean });
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
const { state, batch } = useQueryReactive({ search: { default: '' }, page: { default: 1 } });
batch({ search: 'hello', page: 2 }, { history: 'push' });
```

## Two-way sync with browser navigation

```ts
const page = useQueryRef('page', { default: 1, codec: serializers.number, twoWay: true });
```

Or for multiple params:

```ts
const { state } = useQueryReactive(schema, { twoWay: true });
```
