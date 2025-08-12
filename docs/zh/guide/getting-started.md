# 快速开始

把常用的界面状态（搜索词、页码、筛选条件）放进 URL，这样刷新、分享、前进/后退都能保持。`vue-qs` 提供两个简单的组合式函数来做这件事。

## 安装

```bash
npm i vue-qs
# 或者
pnpm add vue-qs
# 或者
bun add vue-qs
```

对等依赖：`vue@^3.3`。可选：`vue-router@^4.2`（需要路由集成时）。

## 单个参数 (ref)

```vue
<script setup lang="ts">
import { useQueryRef } from 'vue-qs';

// 绑定到 ?name=... 缺失时使用默认值
const name = useQueryRef('name', { default: '' });
</script>

<template>
  <input v-model="name" placeholder="你的名字" />
</template>
```

## 多个参数 (reactive 对象)

```vue
<script setup lang="ts">
import { useQueryReactive } from 'vue-qs';

const { state } = useQueryReactive({
  search: { default: '' },
  page: { default: 1, parse: Number },
});
</script>

<template>
  <input v-model="state.search" />
  <button @click="state.page++">下一页</button>
</template>
```

## Hook 返回什么

- `useQueryRef(name, options)` → 一个普通 ref，额外提供 `.sync()`。
- `useQueryReactive(schema, options)` → `{ state, batch, sync }`。
  - `batch()` 把多次修改合并为一次历史记录。
  - `sync()` 立即写入 URL。
- 值等于默认值时默认不出现在 URL（可通过 `omitIfDefault: false` 关闭）。

继续查看 示例 / 双向同步 / 编解码器 获取更多用法。
