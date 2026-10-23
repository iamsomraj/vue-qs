---
description: 'vue-qs 内置解析器：整数、浮点数、布尔值、日期、枚举、字面量、数组和经过校验的 JSON，以及使用 createParser 编写自定义解析器。'
---

# 解析器 {#parsers}

解析器负责在 URL 中存储的字符串与类型化状态之间进行转换。它们与 nuqs 的解析器相同，
在浏览器和服务端都能使用。

```ts
import { parseAsInteger, useQueryState } from 'vue-qs';

const page = useQueryState('page', parseAsInteger.withDefault(1));
```

解析器也可以从 `vue-qs/server` 导入，该入口不依赖 Vue。

## 内置解析器 {#built-in-parsers}

| 解析器                         | 状态类型              | URL 示例                       |
| ------------------------------ | --------------------- | ------------------------------ |
| `parseAsString`                | `string`              | `?q=hello+world`               |
| `parseAsInteger`               | `number`              | `?page=2`                      |
| `parseAsFloat`                 | `number`              | `?lat=48.8566`                 |
| `parseAsHex`                   | `number`              | `?color=ff`                    |
| `parseAsIndex`                 | `number`（从 0 开始） | `?page=1` → `0`                |
| `parseAsBoolean`               | `boolean`             | `?open=true`                   |
| `parseAsTimestamp`             | `Date`                | `?t=1735689600000`             |
| `parseAsIsoDateTime`           | `Date`                | `?at=2025-01-01T00:00:00.000Z` |
| `parseAsIsoDate`               | `Date`                | `?day=2025-01-01`              |
| `parseAsStringEnum(values)`    | 字符串枚举            | `?dir=UP`                      |
| `parseAsStringLiteral(values)` | 字符串字面量联合类型  | `?sort=asc`                    |
| `parseAsNumberLiteral(values)` | 数字字面量联合类型    | `?dice=6`                      |
| `parseAsArrayOf(parser, sep?)` | `T[]`                 | `?tags=vue,nuxt`               |
| `parseAsNativeArrayOf(parser)` | `T[]`（默认 `[]`）    | `?tag=vue&tag=nuxt`            |
| `parseAsJson(validator)`       | `T`                   | `?filters={"a":1}`             |

无效的值（如 `?page=abc`）会被解析为 `null`，因此状态会回退到默认值。

### 字面量和枚举 {#literals-and-enums}

```ts
const sort = useQueryState(
  'sort',
  parseAsStringLiteral(['asc', 'desc'] as const).withDefault('asc')
); // Ref<'asc' | 'desc'>

enum Direction {
  up = 'UP',
  down = 'DOWN',
}
const direction = useQueryState('dir', parseAsStringEnum<Direction>(Object.values(Direction)));
```

### 数组 {#arrays}

`parseAsArrayOf` 将所有元素存放在同一个键中，并用分隔符连接（默认为 `,`）。
元素中出现的分隔符会被编码。

```ts
const tags = useQueryState('tags', parseAsArrayOf(parseAsString).withDefault([]));
tags.value = ['vue', 'nuxt']; // ?tags=vue,nuxt
```

`parseAsNativeArrayOf` 则使用重复的键，默认值为 `[]`：

```ts
const ids = useQueryState('id', parseAsNativeArrayOf(parseAsInteger));
ids.value = [1, 2]; // ?id=1&id=2
```

无效的元素会被跳过。当没有任何有效元素时（`?id=a&id=b`），状态会回退到默认值。
如果默认值不是 `[]`，空数组会被写成一个空值（`?id=`），因此刷新页面后仍能保留。

元素解析器只需要提供 `parse`：对两种数组解析器而言，`serialize` 默认为 `String`，
`eq` 默认为严格相等。

::: tip 替换而不是修改
状态值不是深层响应式的：`tags.value.push('x')` 不会更新 URL。
请赋一个新值：`tags.value = [...tags.value, 'x']`。
:::

### JSON {#json}

由于 URL 内容属于用户输入，`parseAsJson` 必须传入校验器。可以传入一个返回值的函数
（无效时返回 `null` 或抛出错误），也可以传入任意
[Standard Schema](https://standardschema.dev)，例如 Zod、Valibot 或 ArkType：

```ts
import { z } from 'zod';

const schema = z.object({ lat: z.number(), lng: z.number() });
const position = useQueryState('pos', parseAsJson(schema));
// Ref<{ lat: number; lng: number } | null>
```

## 默认值 {#default-values}

`.withDefault(value)` 在键不存在或值无效时返回默认值，并从状态类型中去掉 `null`：

```ts
const search = useQueryState('q', parseAsString.withDefault(''));
```

默认情况下，将状态设置为默认值会从 URL 中移除该键（`clearOnDefault: true`）。
请参阅[选项](/guide/options#clear-on-default)（英文）。

对于字符串，也可以通过选项传入默认值：

```ts
const search = useQueryState('q', { defaultValue: '' });
```

## 解析器上的选项 {#options-on-parsers}

`.withOptions()` 可以将[选项](/guide/options)（英文）附加到解析器上。构建方法可以以任意顺序链式调用：

```ts
const page = useQueryState(
  'page',
  parseAsInteger.withDefault(1).withOptions({ history: 'push', scroll: true })
);
```

## 自定义解析器 {#custom-parsers}

使用 `createParser` 创建一个拥有相同构建方法的解析器：

```ts
import { createParser } from 'vue-qs';

const parseAsStarRating = createParser({
  parse: (value) => {
    const stars = value.match(/★/g)?.length ?? 0;
    return stars > 0 ? stars : null;
  },
  serialize: (value) => '★'.repeat(value),
});

const rating = useQueryState('rating', parseAsStarRating.withDefault(1));
```

当值是对象时，请提供 `eq`，以便 vue-qs 能够判断默认值和变化：

```ts
const parseAsPoint = createParser({
  parse: (value) => {
    const [x, y] = value.split(':').map(Number);
    return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
  },
  serialize: ({ x, y }) => `${x}:${y}`,
  eq: (a, b) => a.x === b.x && a.y === b.y,
});
```

`createMultiParser` 用于读取重复键（`string[]`）的解析器，用法相同。

## 服务端解析 {#server-side-parsing}

每个解析器都有 `parseServerSide` 方法，它接受 `string | string[] | undefined`
（即路由或 H3 查询对象中的值），并应用默认值：

```ts
parseAsInteger.withDefault(1).parseServerSide(query.page); // number
```

如需一次解析多个键，请使用 [`createLoader`](/guide/server#createloader)（英文）。

## 类型推断 {#inferring-types}

```ts
import type { inferParserType } from 'vue-qs';

const searchParams = {
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
};
type SearchParams = inferParserType<typeof searchParams>; // { q: string; page: number }
```
