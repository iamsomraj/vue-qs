# 编解码器 (Codecs)

编解码器负责把你的类型值 <-> URL 中的字符串 互相转换。

## 内置列表

- `serializers.stringCodec`
- `serializers.numberCodec`
- `serializers.booleanCodec`
- `serializers.dateISOCodec`
- `serializers.createJsonCodec<T>()`
- `serializers.createArrayCodec(innerCodec, separator?)`
- `serializers.createEnumCodec(values)`

两种等价写法：

```ts
queryRef('count', { defaultValue: 0, parse: serializers.numberCodec.parse });
// 或更简洁
queryRef('count', { defaultValue: 0, codec: serializers.numberCodec });
```

数组 & 枚举：

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

## 自定义编解码器

```ts
import type { QueryCodec } from 'vue-qs';

const percentNumber: QueryCodec<number> = {
  parse: (raw) => (raw ? Number(raw.replace('%', '')) : 0),
  serialize: (n) => `${n}%`,
};

const discountRate = queryRef('discountRate', { defaultValue: 0, codec: percentNumber });
```

返回 `null` 表示在 URL 中省略该参数。
