# 哈希适配器

哈希适配器使 vue-qs 能够使用浏览器的哈希来存储 URL 参数，类似于 VueUse 的 `useUrlSearchParams` 哈希模式支持。这对于使用哈希路由的单页应用程序或希望在哈希片段中存储参数的场景特别有用。

## 功能特性

- **哈希模式**：在哈希片段中存储参数并保留路由 (`#/route?foo=bar`)
- **哈希参数模式**：将参数作为整个哈希片段存储 (`#foo=bar`)
- **双向同步**：自动与外部哈希更改同步
- **历史策略**：支持 `push` 和 `replace` 导航
- **SSR 兼容**：在服务器环境中工作，具有回退缓存
- **类型安全**：完整的 TypeScript 支持和适当的类型

## 用法

### 基本设置

```typescript
import { createHashAdapter } from 'vue-qs';

// 哈希模式（默认）- 保留路由：#/route?foo=bar
const { queryAdapter } = createHashAdapter({ mode: 'hash' });

// 哈希参数模式 - 整个哈希作为参数：#foo=bar
const { queryAdapter: hashParamsAdapter } = createHashAdapter({ mode: 'hash-params' });
```

### 与 Vue 插件一起使用

```typescript
// main.ts
import { createApp } from 'vue';
import { createVueQsPlugin, createHashAdapter } from 'vue-qs';

const app = createApp(App);

// 全局使用哈希模式
app.use(
  createVueQsPlugin({
    queryAdapter: createHashAdapter({ mode: 'hash' }),
  })
);

// 或使用哈希参数模式
app.use(
  createVueQsPlugin({
    queryAdapter: createHashAdapter({ mode: 'hash-params' }),
  })
);
```

### 与 useQueryRef 一起使用

```vue
<script setup lang="ts">
import { useQueryRef, createHashAdapter } from 'vue-qs';

const adapter = createHashAdapter({ mode: 'hash' });

// 使用哈希适配器的单个参数
const searchQuery = useQueryRef('q', {
  defaultValue: '',
  queryAdapter: adapter,
});

// 带类型的参数
const currentPage = useQueryRef('page', {
  defaultValue: 1,
  parseFunction: Number,
  queryAdapter: adapter,
});
</script>

<template>
  <input v-model="searchQuery" placeholder="搜索..." />
  <button @click="currentPage++">下一页</button>
  <p>查询：{{ searchQuery }}，页面：{{ currentPage }}</p>
</template>
```

### 与 useQueryReactive 一起使用

```vue
<script setup lang="ts">
import { useQueryReactive, createHashAdapter } from 'vue-qs';

const adapter = createHashAdapter({ mode: 'hash-params' });

// 在哈希参数模式中的多个参数
const { queryState, updateBatch } = useQueryReactive(
  {
    q: { defaultValue: '' },
    category: { defaultValue: 'all' },
    page: { defaultValue: 1, parseFunction: Number },
    sort: { defaultValue: 'date' },
  },
  { queryAdapter: adapter }
);

// 批量更新所有参数
const resetFilters = () => {
  updateBatch({
    q: '',
    category: 'all',
    page: 1,
    sort: 'date',
  });
};
</script>

<template>
  <div>
    <input v-model="queryState.q" placeholder="搜索..." />
    <select v-model="queryState.category">
      <option value="all">所有分类</option>
      <option value="tech">技术</option>
      <option value="science">科学</option>
    </select>
    <select v-model="queryState.sort">
      <option value="date">按日期排序</option>
      <option value="popularity">按热度排序</option>
    </select>
    <button @click="queryState.page++">下一页</button>
    <button @click="resetFilters">重置筛选</button>
  </div>
</template>
```

## 模式

### 哈希模式 (`hash`)

在哈希模式下，参数存储在哈希片段中的路由部分之后：

```typescript
const adapter = createHashAdapter({ mode: 'hash' });

// URL 示例：
// #/users?page=2&sort=name
// #/search?q=vue&filters=active
// #/?tab=settings&theme=dark
```

**特点：**

- 保留现有路由结构
- 参数在路由后用 `?` 追加
- 与基于哈希的路由兼容
- 路由导航保持参数

### 哈希参数模式 (`hash-params`)

在哈希参数模式下，整个哈希片段变成查询字符串：

```typescript
const adapter = createHashAdapter({ mode: 'hash-params' });

// URL 示例：
// #page=2&sort=name
// #q=vue&filters=active
// #tab=settings&theme=dark
```

**特点：**

- 整个哈希被视为参数
- 无路由保留
- 更紧凑的 URL
- 当不需要哈希路由时很有用

## 配置选项

```typescript
interface HashAdapterOptions {
  /** 要使用的哈希模式（默认：'hash'） */
  mode?: 'hash' | 'hash-params';

  /** 是否抑制自定义历史事件（默认：false） */
  suppressHistoryEvents?: boolean;
}
```

### 包含所有选项的示例：

```typescript
const { queryAdapter } = createHashAdapter({
  mode: 'hash-params',
  suppressHistoryEvents: true, // 不发出自定义事件
});
```

## 高级用法

### 双向同步

启用与外部哈希更改的自动同步：

```typescript
const nameParam = useQueryRef('name', {
  defaultValue: '',
  queryAdapter: createHashAdapter({ mode: 'hash' }),
  enableTwoWaySync: true, // 与外部更改同步
});

// 手动更改哈希将更新引用
// window.location.hash = '#/route?name=updated'
```

### 历史策略

控制浏览器历史行为：

```typescript
const searchParam = useQueryRef('q', {
  defaultValue: '',
  queryAdapter: createHashAdapter({ mode: 'hash' }),
  historyStrategy: 'push', // 创建新的历史条目
});

// 或使用替换策略（默认）
const filterParam = useQueryRef('filter', {
  defaultValue: 'all',
  queryAdapter: createHashAdapter({ mode: 'hash' }),
  historyStrategy: 'replace', // 替换当前历史条目
});
```

### 与哈希适配器一起使用自定义编解码器

```typescript
import { createHashAdapter, createArrayCodec, createEnumCodec } from 'vue-qs';

const adapter = createHashAdapter({ mode: 'hash-params' });

// 数组参数
const selectedIds = useQueryRef('ids', {
  defaultValue: [] as number[],
  codec: createArrayCodec(Number),
  queryAdapter: adapter,
});

// 枚举参数
type Theme = 'light' | 'dark' | 'auto';
const theme = useQueryRef('theme', {
  defaultValue: 'light' as Theme,
  codec: createEnumCodec(['light', 'dark', 'auto']),
  queryAdapter: adapter,
});
```

### 错误处理

哈希适配器包含内置错误处理：

```typescript
// 对格式错误的哈希的优雅回退
// 无效：#invalid%hash%content
// 结果：{}（空对象，不抛出错误）

// 对序列化错误的优雅回退
// 无效值从哈希中省略
```

## 与 VueUse 的比较

| 功能           | vue-qs 哈希适配器     | VueUse useUrlSearchParams |
| -------------- | --------------------- | ------------------------- |
| 哈希模式       | ✅ `#/route?foo=bar`  | ✅ `#/route?foo=bar`      |
| 哈希参数模式   | ✅ `#foo=bar`         | ✅ `#foo=bar`             |
| 类型安全       | ✅ 完整的编解码器系统 | ❌ 基本字符串处理         |
| 自定义序列化器 | ✅ 内置 + 自定义      | ✅ 仅自定义字符串化       |
| 双向同步       | ✅ 可配置             | ✅ 始终开启               |
| 历史策略       | ✅ Push/Replace       | ❌ 仅 Replace             |
| SSR 支持       | ✅ 内置               | ❌ 仅浏览器               |
| Vue 集成       | ✅ 插件系统           | ✅ 直接导入               |

## 浏览器支持

- 支持 `URLSearchParams` 的现代浏览器
- 哈希更改事件支持 (`hashchange`)
- 用于导航的 History API 支持

## 最佳实践

1. **选择正确的模式**：对于带路由的 SPA 使用 `hash`，对于简单参数存储使用 `hash-params`
2. **启用双向同步**：当用户可能手动编辑哈希时
3. **使用适当的历史策略**：导航使用 `push`，过滤器使用 `replace`
4. **利用编解码器**：使用内置编解码器进行适当的类型转换和验证
5. **处理边缘情况**：始终为参数提供合理的默认值

## 从 VueUse 迁移

如果您正在从 VueUse 的 `useUrlSearchParams` 迁移：

```typescript
// VueUse
import { useUrlSearchParams } from '@vueuse/core';
const params = useUrlSearchParams('hash');

// vue-qs 等效
import { useQueryReactive, createHashAdapter } from 'vue-qs';
const adapter = createHashAdapter({ mode: 'hash' });
const { queryState } = useQueryReactive(
  {
    // 定义您的参数架构
  },
  { queryAdapter: adapter }
);
```

主要区别：

- vue-qs 需要明确的参数架构定义
- vue-qs 通过编解码器提供更好的类型安全性
- vue-qs 支持更多配置选项
- vue-qs 具有内置的 SSR 支持
