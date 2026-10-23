---
description: '从 vue-qs 0.1.x（queryRef、queryReactive、codec）升级到 vue-qs 0.2 的 nuqs 风格 API。'
---

# 从 0.1.x 迁移 {#migrating-from-0-1-x}

vue-qs 0.2 是一次重写，将 [nuqs](https://nuqs.dev) 的 API 移植到了 Vue。0.1.x 的
API（`queryRef`、`queryReactive`、codec）已被移除。

## 初始化 {#setup}

现在必须提供适配器。只需安装一次插件：

```ts
// 0.1.x
app.use(createVueQsPlugin({ queryAdapter: createVueRouterAdapter(router) }));

// 0.2
import { createVueQs } from 'vue-qs';
import { createVueRouterAdapter } from 'vue-qs/adapters/vue-router';

app.use(createVueQs({ adapter: createVueRouterAdapter(router) }));
```

适配器现在从子路径导入：`vue-qs/adapters/vue-router` 和 `vue-qs/adapters/history`。

## 单个参数 {#single-parameter}

```ts
// 0.1.x
const page = queryRef('page', { defaultValue: 1, codec: numberCodec, historyStrategy: 'push' });

// 0.2
const page = useQueryState('page', parseAsInteger.withDefault(1).withOptions({ history: 'push' }));
```

返回值仍然是可写 ref，因此 `page.value = 2` 和 `v-model` 照常可用。

## 多个参数 {#several-parameters}

```ts
// 0.1.x
const state = queryReactive({
  q: { defaultValue: '' },
  page: { defaultValue: 1, codec: numberCodec },
});

// 0.2
const state = useQueryStates({
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
});
```

## 名称对照 {#name-mapping}

| 0.1.x                                     | 0.2                                                         |
| ----------------------------------------- | ----------------------------------------------------------- |
| `queryRef(key, options)`                  | `useQueryState(key, parser)`                                |
| `queryReactive(schema, options)`          | `useQueryStates(parsers, options)`                          |
| `createVueQsPlugin({ queryAdapter })`     | `createVueQs({ adapter })`                                  |
| `provideQueryAdapter` / `useQueryAdapter` | 不变                                                        |
| `createHistoryAdapter`（从 `vue-qs`）     | `createHistoryAdapter`（从 `vue-qs/adapters/history`）      |
| `createVueRouterAdapter`（从 `vue-qs`）   | `createVueRouterAdapter`（从 `vue-qs/adapters/vue-router`） |
| `stringCodec`                             | `parseAsString`                                             |
| `numberCodec`                             | `parseAsFloat` 或 `parseAsInteger`                          |
| `booleanCodec`                            | `parseAsBoolean`                                            |
| `dateISOCodec`                            | `parseAsIsoDateTime`                                        |
| `createJsonCodec<T>()`                    | `parseAsJson(validator)`                                    |
| `createArrayCodec(codec, sep)`            | `parseAsArrayOf(parser, sep)`                               |
| `createEnumCodec(values)`                 | `parseAsStringLiteral(values)`                              |
| `{ parse, serialize }` codec              | `createParser({ parse, serialize })`                        |
| `defaultValue: x`                         | `.withDefault(x)`                                           |
| `historyStrategy: 'push'`                 | `history: 'push'`                                           |
| `shouldOmitDefault`                       | `clearOnDefault`                                            |
| `isEqual`                                 | `createParser` 中的 `eq`                                    |
| `parseSearchString` / `buildSearchString` | `createLoader` / `createSerializer`                         |

## 行为变化 {#behaviour-changes}

- **缺少适配器**：组合式函数会抛出错误，而不是悄悄创建一个 History 适配器。
- **Vue Router**：状态现在会跟随 `router.push`、`<RouterLink>` 以及每一次导航。
  在 0.1.x 中，它只跟随后退/前进。
- **批量更新**：同一个 tick 内的多次更新只产生一次 URL 更新，而不是每次各一次。
- **节流**：URL 更新默认节流为每 50 ms 最多一次。
- **没有默认值且缺失的键**为 `null`。在 0.1.x 中为 `undefined`。
- **无效的值**会回退到默认值。在 0.1.x 中，`numberCodec` 返回 `NaN`，
  `createEnumCodec` 返回第一个允许的值。
- **布尔值**：`parseAsBoolean` 接受 `true`（不区分大小写）。在 0.1.x 中，`booleanCodec`
  还接受 `1`。
- **空值**：使用 `parseAsString` 时，`?q=` 会被解析为 `''`。在 0.1.x 中，它被视为缺失。
- **相等性判断**：自定义的 `isEqual` 函数改为解析器的 `eq`，用于判断默认值和检测变化。
- **移除的工具函数**：`isBrowserEnvironment`、`createRuntimeEnvironment`、
  `areValuesEqual`、`mergeObjects` 和 `removeUndefinedValues` 不再导出。
