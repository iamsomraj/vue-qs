# 示例

汇总一些常用片段。

## 基础：数字 / 布尔 / 字符串数组

```ts
import { queryRef, serializers } from 'vue-qs';

const count = queryRef('count', { defaultValue: 0, codec: serializers.numberCodec });
const published = queryRef('published', {
  defaultValue: false,
  codec: serializers.booleanCodec,
});
const tags = queryRef<string[]>('tags', {
  defaultValue: [],
  codec: serializers.createArrayCodec(serializers.stringCodec),
});
```

## 保留默认值

默认值会被省略。强制保留：

```ts
const page = queryRef('page', {
  defaultValue: 1,
  parse: Number,
  shouldOmitDefault: false,
});
```

## 批量修改 & 控制历史

```ts
const { queryState, updateBatch } = queryReactive({
  search: { defaultValue: '' },
  page: { defaultValue: 1 },
});

updateBatch(
  () => {
    queryState.search = 'hello';
    queryState.page = 2;
  },
  { historyStrategy: 'push' }
);
```

## 深比较避免多余写入

```ts
const filter = queryRef('filter', {
  defaultValue: { tags: [] as string[], maxPrice: 0 },
  codec: serializers.createJsonCodec<{ tags: string[]; maxPrice: number }>(),
  isEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),
});
```

## 枚举 + 数组

```ts
const category = queryRef<'books' | 'music' | 'games'>('category', {
  defaultValue: 'books',
  codec: serializers.createEnumCodec(['books', 'music', 'games'] as const),
});

const selectedIds = queryRef<number[]>('ids', {
  defaultValue: [],
  codec: serializers.createArrayCodec(serializers.numberCodec),
});
```

## 双向同步（URL -> 状态）

```ts
const page = queryRef('page', {
  defaultValue: 1,
  parse: Number,
});
```

或多个：

```ts
const { queryState } = queryReactive({ page: { defaultValue: 1 } });
```
