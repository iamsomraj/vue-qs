# 示例

汇总一些常用片段。

## 基础：数字 / 布尔 / 字符串数组

```ts
import { useQueryRef, serializers } from 'vue-qs';

const count = useQueryRef('count', { default: 0, codec: serializers.number });
const published = useQueryRef('published', { default: false, codec: serializers.boolean });
const tags = useQueryRef<string[]>('tags', {
  default: [],
  codec: serializers.arrayOf(serializers.string),
});
```

## 保留默认值

默认值会被省略。强制保留：

```ts
const page = useQueryRef('page', { default: 1, parse: Number, omitIfDefault: false });
```

## 批量修改 & 控制历史

```ts
const { state, batch } = useQueryReactive({ search: { default: '' }, page: { default: 1 } });

batch(
  () => {
    state.search = 'hello';
    state.page = 2;
  },
  { history: 'push' }
);
```

## 深比较避免多余写入

```ts
const filter = useQueryRef('filter', {
  default: { tags: [] as string[], maxPrice: 0 },
  codec: serializers.json<{ tags: string[]; maxPrice: number }>(),
  equals: (a, b) => JSON.stringify(a) === JSON.stringify(b),
});
```

## 枚举 + 数组

```ts
const category = useQueryRef<'books' | 'music' | 'games'>('category', {
  default: 'books',
  codec: serializers.enumOf(['books', 'music', 'games'] as const),
});

const selectedIds = useQueryRef<number[]>('ids', {
  default: [],
  codec: serializers.arrayOf(serializers.number),
});
```

## 双向同步（URL -> 状态）

```ts
const page = useQueryRef('page', { default: 1, parse: Number, twoWay: true });
```

或多个：

```ts
const { state } = useQueryReactive({ page: { default: 1 } }, { twoWay: true });
```
