# 编解码器 (Codecs)

编解码器负责把你的类型值 <-> URL 中的字符串 互相转换。

## 内置列表

- `serializers.string`
- `serializers.number`
- `serializers.boolean`
- `serializers.dateISO`
- `serializers.json<T>()`
- `serializers.arrayOf(innerCodec, separator?)`
- `serializers.enumOf(values)`

两种等价写法：

```ts
useQueryRef('count', { default: 0, parse: serializers.number.parse });
// 或更简洁
useQueryRef('count', { default: 0, codec: serializers.number });
```

数组 & 枚举：

```ts
const tags = useQueryRef<string[]>('tags', {
  default: [],
  codec: serializers.arrayOf(serializers.string),
});

const sort = useQueryRef<'asc' | 'desc'>('sort', {
  default: 'asc',
  codec: serializers.enumOf(['asc', 'desc'] as const),
});
```

## 自定义编解码器

```ts
import type { QueryCodec } from 'vue-qs';

const percentNumber: QueryCodec<number> = {
  parse: (raw) => (raw ? Number(raw.replace('%', '')) : 0),
  serialize: (n) => `${n}%`,
};

const discountRate = useQueryRef('discountRate', { default: 0, codec: percentNumber });
```

返回 `null` 表示在 URL 中省略该参数。
