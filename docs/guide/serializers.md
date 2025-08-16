# Codecs (Serializers)

Codecs convert between your typed values and the string stored in the URL.

## Built‑in codecs

- `serializers.stringCodec`
- `serializers.numberCodec`
- `serializers.booleanCodec`
- `serializers.dateISOCodec`
- `serializers.createJsonCodec<T>()`
- `serializers.createArrayCodec(innerCodec, separator?)`
- `serializers.createEnumCodec(values)`

You can use either:

```ts
queryRef('count', { defaultValue: 0, parse: serializers.numberCodec.parse });
// or shorter
queryRef('count', { defaultValue: 0, codec: serializers.numberCodec });
```

Arrays and enums:

```ts
const tags = queryRef<string[]>('tags', {
  defaultValue: [],
  codec: serializers.createArrayCodec(serializers.stringCodec),
});

const sort = queryRef<'asc' | 'desc'>('sort', {
  defaultValue: 'asc',
  codec: serializers.createEnumCodec(['asc', 'desc'] as const),
});
```

## Custom codec

```ts
import type { QueryCodec } from 'vue-qs';

const percentNumber: QueryCodec<number> = {
  parse: (raw) => (raw ? Number(raw.replace('%', '')) : 0),
  serialize: (n) => `${n}%`,
};

const discountRate = queryRef('discountRate', { defaultValue: 0, codec: percentNumber });
```

Return `null` from `serialize` to omit the param entirely.
