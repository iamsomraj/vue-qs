# 示例

汇总一些常用片段。

## 哈希适配器（类似 VueUse）

对于使用哈希路由的 SPA 或希望在 URL 哈希中存储参数的场景：

```ts
import { useQueryRef, useQueryReactive, createHashAdapter } from 'vue-qs';

// 哈希模式：#/route?foo=bar&baz=qux
const hashAdapter = createHashAdapter({ mode: 'hash' });

// 哈希参数模式：#foo=bar&baz=qux
const hashParamsAdapter = createHashAdapter({ mode: 'hash-params' });

const searchQuery = useQueryRef('q', {
  defaultValue: '',
  queryAdapter: hashAdapter,
});

const { queryState } = useQueryReactive(
  {
    category: { defaultValue: 'all' },
    sort: { defaultValue: 'date' },
  },
  { queryAdapter: hashParamsAdapter }
);
```

插件全局设置：

```ts
// main.ts
import { createVueQsPlugin, createHashAdapter } from 'vue-qs';

app.use(
  createVueQsPlugin({
    queryAdapter: createHashAdapter({ mode: 'hash' }),
  })
);
```

## 基础：数字 / 布尔 / 字符串数组

```ts
import { useQueryRef, serializers } from 'vue-qs';

const count = useQueryRef('count', { defaultValue: 0, codec: serializers.numberCodec });
const published = useQueryRef('published', {
  defaultValue: false,
  codec: serializers.booleanCodec,
});
const tags = useQueryRef<string[]>('tags', {
  defaultValue: [],
  codec: serializers.createArrayCodec(serializers.stringCodec),
});
```

## 保留默认值

默认值会被省略。强制保留：

```ts
const page = useQueryRef('page', {
  defaultValue: 1,
  parseFunction: Number,
  shouldOmitDefault: false,
});
```

## 批量修改 & 控制历史

```ts
const { queryState, updateBatch } = useQueryReactive({
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
const filter = useQueryRef('filter', {
  defaultValue: { tags: [] as string[], maxPrice: 0 },
  codec: serializers.createJsonCodec<{ tags: string[]; maxPrice: number }>(),
  isEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),
});
```

## 枚举 + 数组

```ts
const category = useQueryRef<'books' | 'music' | 'games'>('category', {
  defaultValue: 'books',
  codec: serializers.createEnumCodec(['books', 'music', 'games'] as const),
});

const selectedIds = useQueryRef<number[]>('ids', {
  defaultValue: [],
  codec: serializers.createArrayCodec(serializers.numberCodec),
});
```

## 双向同步（URL -> 状态）

```ts
const page = useQueryRef('page', {
  defaultValue: 1,
  parseFunction: Number,
  enableTwoWaySync: true,
});
```

或多个：

```ts
const { queryState } = useQueryReactive({ page: { defaultValue: 1 } }, { enableTwoWaySync: true });
```
