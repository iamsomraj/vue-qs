# Serializers

Serializers (codecs) define how values convert to and from query strings.

Built-ins:

- `serializers.string`
- `serializers.number`
- `serializers.boolean`
- `serializers.dateISO`
- `serializers.json<T>()`
- `serializers.arrayOf(codec, sep?)`
- `serializers.enumOf(values)`

## Custom codec

```ts
import type { QueryCodec } from 'vue-qs';

const percentNumber: QueryCodec<number> = {
  parse: (v) => (v ? Number(v.replace('%', '')) : 0),
  serialize: (n) => `${n}%`,
};
```

Use it:

```ts
const discountRate = useQueryRef('discountRate', { default: 0, codec: percentNumber });
```
