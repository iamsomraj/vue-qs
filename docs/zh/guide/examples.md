# 示例

## 常用类型编解码器

```ts
import { useQueryRef, serializers } from 'vue-qs';

const n = useQueryRef('n', { default: 0, codec: serializers.number });
const b = useQueryRef('b', { default: false, codec: serializers.boolean });
const tags = useQueryRef<string[]>('tags', {
  default: [],
  codec: serializers.arrayOf(serializers.string),
});
```

## URL 中始终保留默认值

```ts
const page = useQueryRef('page', { default: 1, codec: serializers.number, omitIfDefault: false });
```

## 批量更新（减少历史记录）

```ts
const { state, batch } = useQueryReactive({ q: { default: '' }, page: { default: 1 } });
batch({ q: 'hello', page: 2 }, { history: 'push' });
```

## 双向同步（URL -> 状态）

```ts
const page = useQueryRef('page', { default: 1, codec: serializers.number, twoWay: true });
```

或多个参数：

```ts
const { state } = useQueryReactive(schema, { twoWay: true });
```
